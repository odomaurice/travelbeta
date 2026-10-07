import Link from "next/link"
import { geoMercator, geoPath } from "d3-geo"
import { feature } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import world from "world-atlas/countries-110m.json"
import { Airplane01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/icons"
import { SectionHeading } from "@/components/site/section-heading"
import { DESTINATIONS } from "@/lib/data/destinations"

const W = 960
const H = 470
const LABEL_SIZE = 12

type Country = Feature<Geometry, { name: string }>

// Built once at module load: this is a server component, so none of the map
// data or d3 code ships to the browser.
const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>
const countries = (feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>).features.filter(
  (f) => f.properties.name !== "Antarctica"
) as Country[]
const projection = geoMercator()
  .rotate([-10, 0, 0])
  .fitExtent(
    [
      [10, 10],
      [W - 10, H - 10],
    ],
    { type: "FeatureCollection", features: countries }
  )
const path = geoPath(projection)

type Placed = { x: number; y: number; lx: number; ly: number; anchor: "start" | "end" | "middle"; always: boolean; leader?: boolean }

/**
 * Place labels right or left of each marker, skipping any that would collide
 * with one already placed. Skipped labels still appear on hover/focus.
 * Bigger hubs go first so they win the space.
 */
function placeLabels() {
  // Markers are obstacles too, so a label never runs over a neighbouring city's dot.
  const markers: { x0: number; y0: number; x1: number; y1: number }[] = DESTINATIONS.map((d) => {
    const [x, y] = projection([d.lon, d.lat]) as [number, number]
    return { x0: x - 5, y0: y - 5, x1: x + 5, y1: y + 5 }
  })
  const labelBoxes: typeof markers = []
  const hits = (box: (typeof markers)[number], against: typeof markers) =>
    against.some((b) => b.x0 < box.x1 && box.x0 < b.x1 && b.y0 < box.y1 && box.y0 < b.y1)
  const priority = ["lagos", "abuja", "london", "dubai", "new-york", "accra", "nairobi", "johannesburg", "paris", "toronto"]
  const order = [...DESTINATIONS].sort((a, b) => {
    const pa = priority.indexOf(a.id)
    const pb = priority.indexOf(b.id)
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb)
  })
  const out = new Map<string, Placed>()
  for (const d of order) {
    const [x, y] = projection([d.lon, d.lat]) as [number, number]
    const w = d.name.length * LABEL_SIZE * 0.58 + 4
    let placed: Placed | null = null
    // Try right, left, below, then above the marker; first spot that's clear wins.
    const half = LABEL_SIZE / 2
    const candidates = [
      { anchor: "start" as const, lx: x + 8, ly: y + half - 2, box: { x0: x + 9, x1: x + 8 + w, y0: y - half - 2, y1: y + half + 2 } },
      { anchor: "end" as const, lx: x - 8, ly: y + half - 2, box: { x0: x - 8 - w, x1: x - 9, y0: y - half - 2, y1: y + half + 2 } },
      { anchor: "middle" as const, lx: x, ly: y + 8 + LABEL_SIZE, box: { x0: x - w / 2, x1: x + w / 2, y0: y + 7, y1: y + 9 + LABEL_SIZE } },
      { anchor: "middle" as const, lx: x, ly: y - 9, box: { x0: x - w / 2, x1: x + w / 2, y0: y - 9 - LABEL_SIZE, y1: y - 7 } },
    ]
    // Key hubs (Lagos, London…) sit in dense clusters; if every close spot is taken, set their
    // label a little further out, only requiring it not to overlap other labels.
    const isHub = priority.indexOf(d.id) !== -1 && priority.indexOf(d.id) < 4
    // Left first: on this map that's usually open sea (Atlantic for London, Gulf of Guinea for Lagos).
    const far = [
      { anchor: "end" as const, lx: x - 22, ly: y + half - 2, box: { x0: x - 22 - w, x1: x - 23, y0: y - half - 2, y1: y + half + 2 } },
      { anchor: "middle" as const, lx: x, ly: y + 24 + LABEL_SIZE, box: { x0: x - w / 2, x1: x + w / 2, y0: y + 23, y1: y + 25 + LABEL_SIZE } },
      { anchor: "middle" as const, lx: x, ly: y - 22, box: { x0: x - w / 2, x1: x + w / 2, y0: y - 22 - LABEL_SIZE, y1: y - 20 } },
    ]
    const tries = [...candidates.map((c) => ({ ...c, strict: true })), ...(isHub ? far.map((c) => ({ ...c, strict: false })) : [])]
    for (const c of tries) {
      const box = c.box
      if (box.x1 > W || box.x0 < 0 || box.y0 < 0 || box.y1 > H) continue
      if (!hits(box, labelBoxes) && (!c.strict || !hits(box, markers))) {
        labelBoxes.push(box)
        placed = { x, y, lx: c.lx, ly: c.ly, anchor: c.anchor, always: true, leader: !c.strict }
        break
      }
    }
    out.set(d.id, placed ?? { x, y, lx: x + 8, ly: y + LABEL_SIZE / 2 - 2, anchor: "start", always: false })
  }
  return out
}
const labels = placeLabels()

export function DestinationsMap() {
  return (
    <section id="explore" className="scroll-mt-24 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Explore"
          title="Flights and Hotels across the world"
          description="Select your desired destinations and see all you need to know to get your vacation started."
        />

        <div className="mt-10 overflow-hidden rounded-[32px] bg-brand-mist p-2 sm:p-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="group" aria-label="World map of TravelBeta destinations">
            <g>
              {countries.map((c, i) => (
                <path
                  key={i}
                  d={path(c) ?? ""}
                  className="fill-[#8ab9ff] stroke-white transition-colors duration-150 hover:fill-brand-blue"
                  strokeWidth={0.6}
                >
                  <title>{c.properties.name}</title>
                </path>
              ))}
            </g>
            {DESTINATIONS.map((d) => {
              const p = labels.get(d.id)!
              return (
                <Link
                  key={d.id}
                  href={`/destinations/flights/${d.slug}`}
                  aria-label={`Flights and hotels in ${d.name}, ${d.country}`}
                  className="group outline-none"
                >
                  {/* labels set further out get a thin line back to their dot */}
                  {p.leader && (
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={p.anchor === "end" ? p.lx + 2 : p.lx}
                      y2={p.anchor === "end" ? p.y : p.ly + (p.ly > p.y ? -LABEL_SIZE + 1 : 3)}
                      className="stroke-brand-navy"
                      strokeWidth={1.2}
                    />
                  )}
                  {/* larger invisible hit area for touch */}
                  <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    className="fill-white stroke-brand-navy transition-[r] group-hover:fill-brand-amber group-focus-visible:fill-brand-amber"
                    strokeWidth={2.2}
                  />
                  <text
                    x={p.lx}
                    y={p.ly}
                    textAnchor={p.anchor}
                    className={
                      "fill-brand-navy font-extrabold transition-opacity " +
                      (p.always ? "" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")
                    }
                    style={{ fontSize: LABEL_SIZE, paintOrder: "stroke", stroke: "var(--brand-mist)", strokeWidth: 3 }}
                  >
                    {d.name}
                  </text>
                </Link>
              )
            })}
          </svg>
        </div>

        {/* The same destinations as a list: easier to tap on phones and to scan. */}
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {DESTINATIONS.map((d) => (
            <li key={d.id}>
              <Link
                href={`/destinations/flights/${d.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold transition hover:border-brand-blue hover:bg-accent"
              >
                <Icon icon={Airplane01Icon} size={14} className="text-brand-blue-strong" />
                {d.name}
                <span className="text-xs font-bold text-muted-foreground">{d.code}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
