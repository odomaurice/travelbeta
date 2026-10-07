"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoMercator, geoPath, type GeoPermissibleObjects } from "d3-geo"
import { feature, mesh } from "topojson-client"
import type { Topology, GeometryCollection } from "topojson-specification"
import type { FeatureCollection, MultiLineString } from "geojson"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { Airplane01Icon, Bus01Icon, Car01Icon, Train01Icon } from "@hugeicons/core-free-icons"
import type { City, TravelMode } from "@/components/trip/trips"

const W = 800
const H = 440
const PAD = 70

export const MODE_STYLE: Record<TravelMode, { icon: IconSvgElement; color: string }> = {
  flight: { icon: Airplane01Icon, color: "var(--brand-amber)" },
  train: { icon: Train01Icon, color: "#5fb042" },
  bus: { icon: Bus01Icon, color: "var(--brand-blue)" },
  car: { icon: Car01Icon, color: "#ff7a59" },
}

type WorldShapes = { land: FeatureCollection; borders: MultiLineString }
let worldCache: Promise<WorldShapes> | null = null

function loadWorld() {
  // The atlas is ~100KB, so it's split out and only fetched once the map mounts.
  worldCache ??= import("world-atlas/countries-110m.json").then((mod) => {
    const topo = (mod.default ?? mod) as unknown as Topology<{ countries: GeometryCollection }>
    return {
      land: feature(topo, topo.objects.countries) as FeatureCollection,
      borders: mesh(topo, topo.objects.countries, (a, b) => a !== b) as MultiLineString,
    }
  })
  return worldCache
}

/** Bounding box around the cities, padded so short hops don't zoom in absurdly. */
function framing(cities: City[]): GeoPermissibleObjects {
  if (cities.length === 0) return bbox(-100, -35, 60, 58)
  const lons = cities.map((c) => c.lon)
  const lats = cities.map((c) => c.lat)
  let [minLon, maxLon, minLat, maxLat] = [Math.min(...lons), Math.max(...lons), Math.min(...lats), Math.max(...lats)]
  const minSpan = 3.5
  if (maxLon - minLon < minSpan) {
    const mid = (minLon + maxLon) / 2
    ;[minLon, maxLon] = [mid - minSpan / 2, mid + minSpan / 2]
  }
  if (maxLat - minLat < minSpan * 0.55) {
    const mid = (minLat + maxLat) / 2
    ;[minLat, maxLat] = [mid - minSpan * 0.275, mid + minSpan * 0.275]
  }
  return bbox(minLon, minLat, maxLon, maxLat)
}

const bbox = (x0: number, y0: number, x1: number, y1: number): GeoPermissibleObjects => ({
  type: "MultiPoint",
  coordinates: [
    [x0, y0],
    [x1, y1],
  ],
})

/** Flights arc high like a great circle on a flat map; ground routes bow gently. */
function routePath(a: [number, number], b: [number, number], mode: TravelMode) {
  const [x0, y0] = a
  const [x1, y1] = b
  const dx = x1 - x0
  const dy = y1 - y0
  const len = Math.hypot(dx, dy) || 1
  const bend = mode === "flight" ? 0.28 : 0.1
  // Perpendicular, flipped so the curve always bows "up" the screen.
  let nx = -dy / len
  let ny = dx / len
  if (ny > 0) {
    nx = -nx
    ny = -ny
  }
  const cx = (x0 + x1) / 2 + nx * len * bend
  const cy = (y0 + y1) / 2 + ny * len * bend
  const r = (v: number) => Math.round(v * 100) / 100
  return `M${x0},${y0} Q${r(cx)},${r(cy)} ${x1},${y1}`
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export type AnimLeg = { from?: City; to?: City; mode: TravelMode | null }

type TripAnimProps = {
  legs: AnimLeg[]
  /** Changing this restarts the animation (e.g. a Replay button). */
  replayKey?: number
}

export function TripAnim({ legs, replayKey = 0 }: TripAnimProps) {
  const [world, setWorld] = useState<WorldShapes | null>(null)
  const routeRefs = useRef<(SVGPathElement | null)[]>([])
  const drawnRefs = useRef<(SVGPathElement | null)[]>([])
  const vehicleRefs = useRef<(SVGGElement | null)[]>([])

  useEffect(() => {
    let alive = true
    loadWorld().then((w) => alive && setWorld(w))
    return () => {
      alive = false
    }
  }, [])

  // Ordered unique stops along the itinerary.
  const stops = useMemo(() => {
    const out: City[] = []
    for (const l of legs) {
      for (const c of [l.from, l.to]) if (c && !out.some((o) => o.id === c.id)) out.push(c)
    }
    return out
  }, [legs])

  const { path, project, routes } = useMemo(() => {
    const projection = geoMercator().fitExtent(
      [
        [PAD, PAD],
        [W - PAD, H - PAD],
      ],
      framing(stops)
    )
    // Rounded so server and browser produce identical markup: their Math.tan/log
    // differ in the last few bits, which would otherwise break hydration.
    const proj = (c: City) => (projection([c.lon, c.lat]) as [number, number]).map((v) => Math.round(v * 100) / 100) as [number, number]
    return {
      path: geoPath(projection),
      project: proj,
      routes: legs.flatMap((l, i) =>
        l.from && l.to && l.mode && l.from.id !== l.to.id
          ? [{ i, mode: l.mode, d: routePath(proj(l.from), proj(l.to), l.mode), start: proj(l.from) }]
          : []
      ),
    }
  }, [stops, legs])

  const routeKey = routes.map((r) => `${r.d}|${r.mode}`).join(";")

  // Draw each leg in turn and move its vehicle, imperatively, so the map doesn't re-render per frame.
  useEffect(() => {
    if (routes.length === 0) return
    const parts = routes.map((r, k) => {
      const routeEl = routeRefs.current[k]
      const drawnEl = drawnRefs.current[k]
      const vehicleEl = vehicleRefs.current[k]
      const total = routeEl?.getTotalLength() ?? 0
      if (drawnEl) drawnEl.style.strokeDasharray = `${total}`
      const duration = (r.mode === "flight" ? 3200 : 3800) * (routes.length > 1 ? 0.75 : 1)
      return { routeEl, drawnEl, vehicleEl, total, duration }
    })

    const render = (k: number, t: number) => {
      const { routeEl, drawnEl, vehicleEl, total } = parts[k]
      if (!routeEl || !drawnEl || !vehicleEl) return
      const p = easeInOut(t)
      drawnEl.style.strokeDashoffset = `${total * (1 - p)}`
      const pt = routeEl.getPointAtLength(total * p)
      vehicleEl.setAttribute("transform", `translate(${pt.x} ${pt.y})`)
      // One vehicle at a time: the first waits at the start, each shows while its leg
      // is in progress, and the last one stays parked at the destination.
      const visible = t === 0 ? k === 0 : t < 1 || k === parts.length - 1
      vehicleEl.style.opacity = visible ? "1" : "0"
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      parts.forEach((_, k) => render(k, 1))
      return
    }

    parts.forEach((_, k) => render(k, 0))
    let frame = 0
    let leg = 0
    let start: number | null = null
    const tick = (now: number) => {
      start ??= now
      const t = Math.min(1, (now - start) / parts[leg].duration)
      render(leg, t)
      if (t < 1) {
        frame = requestAnimationFrame(tick)
      } else if (leg < parts.length - 1) {
        // This leg is done; start the next one on the following frame.
        leg += 1
        start = null
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // routeKey captures every geometry/mode change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey, replayKey])

  const points = stops.map(project)
  const cx = points.reduce((s, p) => s + p[0], 0) / (points.length || 1)
  const cy = points.reduce((s, p) => s + p[1], 0) / (points.length || 1)

  const described = routes.length > 0
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-full w-full"
      role="img"
      aria-label={
        described
          ? `Map of your route: ${stops.map((s) => s.name).join(" to ")}`
          : "World map. Choose your departure and destination to see your route."
      }
    >
      <defs>
        <radialGradient id="ta-ocean" cx="50%" cy="40%" r="75%">
          <stop offset="0" stopColor="#0b17a8" />
          <stop offset="1" stopColor="var(--brand-navy-deep)" />
        </radialGradient>
        <pattern id="ta-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.05)" />
        </pattern>
        <filter id="ta-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#ta-ocean)" />
      <rect width={W} height={H} fill="url(#ta-grid)" />

      {world && (
        <g className="animate-in fade-in duration-700">
          <path d={path(world.land) ?? ""} fill="#1e2fb8" fillOpacity={0.9} />
          <path d={path(world.borders) ?? ""} fill="none" stroke="rgba(215,231,255,0.22)" strokeWidth={0.7} />
        </g>
      )}

      <g key={`${routeKey}-${replayKey}`}>
        {routes.map((r, k) => {
          const style = MODE_STYLE[r.mode]
          return (
            <g key={r.i}>
              {/* full route, faint, so people see where it's heading */}
              <path
                ref={(el) => {
                  routeRefs.current[k] = el
                }}
                d={r.d}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={2}
                strokeDasharray="3 7"
                strokeLinecap="round"
              />
              {r.mode === "train" && <path d={r.d} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={8} strokeDasharray="1.5 6" />}
              <path
                ref={(el) => {
                  drawnRefs.current[k] = el
                }}
                d={r.d}
                fill="none"
                stroke={style.color}
                strokeWidth={r.mode === "flight" ? 3 : 4}
                strokeLinecap="round"
              />
              <path d={r.d} fill="none" stroke={style.color} strokeWidth={8} opacity={0.25} filter="url(#ta-glow)" />
            </g>
          )
        })}
        {/* vehicles drawn after all routes so they sit on top */}
        {routes.map((r, k) => {
          const style = MODE_STYLE[r.mode]
          return (
            <g
              key={`v${r.i}`}
              ref={(el) => {
                vehicleRefs.current[k] = el
              }}
              transform={`translate(${r.start[0]} ${r.start[1]})`}
              style={{ opacity: k === 0 ? 1 : 0, transition: "opacity 150ms" }}
            >
              <circle r={22} fill={style.color} opacity={0.25}>
                <animate attributeName="r" values="18;26;18" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle r={17} fill={style.color} stroke="#fff" strokeWidth={2.5} />
              <g transform="translate(-10 -10)" color="var(--brand-navy-deep)">
                <HugeiconsIcon icon={style.icon} size={20} strokeWidth={2} />
              </g>
            </g>
          )
        })}
      </g>

      {stops.map((c, i) => {
        const [x, y] = points[i]
        const isFirst = i === 0
        const isLast = i === stops.length - 1 && stops.length > 1
        const color = isFirst ? "var(--brand-amber)" : isLast ? "var(--brand-blue)" : "#ffffff"
        // Push each label away from its nearest stop so close neighbours (Lagos/Ibadan) don't collide.
        let lx = 0
        let ly = -18
        if (stops.length > 1) {
          const [nx, ny] = points
            .filter((_, j) => j !== i)
            .reduce((best, p) => (Math.hypot(p[0] - x, p[1] - y) < Math.hypot(best[0] - x, best[1] - y) ? p : best))
          // Points that coincide on screen fall back to "away from the centre".
          const [ox, oy] = Math.hypot(x - nx, y - ny) < 1 ? [cx, cy] : [nx, ny]
          const d = Math.hypot(x - ox, y - oy) || 1
          lx = ((x - ox) / d) * 34
          ly = ((y - oy) / d) * 26 + 5
        }
        // Keep the label inside the frame: flip to the other side if it would overflow
        // (cities near the edge after fitting, e.g. Lagos and Dubai on one map).
        const labelWidth = (c.name.length + c.code.length + 1) * 8.6
        const anchor: "start" | "end" | "middle" = lx > 12 ? "start" : lx < -12 ? "end" : "middle"
        if (anchor === "start" && x + lx + labelWidth > W - 6) lx = -Math.abs(lx)
        else if (anchor === "end" && x + lx - labelWidth < 6) lx = Math.abs(lx)
        else if (anchor === "middle" && (x - labelWidth / 2 < 6 || x + labelWidth / 2 > W - 6)) lx = x < W / 2 ? 14 : -14
        if (y + ly < 18) ly = 26
        else if (y + ly > H - 8) ly = -18
        return (
          <g key={c.id} transform={`translate(${x} ${y})`}>
            <circle r={12} fill={color} opacity={0.3}>
              <animate attributeName="r" values="6;16" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle r={6} fill={color} stroke={isFirst || isLast ? "#fff" : "var(--brand-navy)"} strokeWidth={2} />
            <text
              x={lx}
              y={ly}
              textAnchor={lx > 12 ? "start" : lx < -12 ? "end" : "middle"}
              className="fill-white text-[15px] font-bold"
              style={{ paintOrder: "stroke", stroke: "var(--brand-navy-deep)", strokeWidth: 4 }}
            >
              {c.name}
              <tspan className="fill-white/60 font-semibold"> {c.code}</tspan>
            </text>
          </g>
        )
      })}
    </svg>
  )
}
