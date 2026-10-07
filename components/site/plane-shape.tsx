type PlaneShapeProps = {
  body?: string
  accent?: string
  window?: string
  scale?: number
}

/**
 * Side-view airliner drawn nose-right and centred on (0, 0), so it can ride an
 * SVG <animateMotion rotate="auto"> path and bank naturally with the curve.
 */
export function PlaneShape({
  body = "#ffffff",
  accent = "var(--brand-amber)",
  window = "var(--brand-navy)",
  scale = 1,
}: PlaneShapeProps) {
  return (
    <g transform={`scale(${scale}) translate(-60 -22)`}>
      {/* tail fin */}
      <path d="M10 17 L3 3 Q2 1 5 1 L11 1 L28 17 Z" fill={accent} />
      {/* rear stabiliser */}
      <path d="M8 22 L22 22 L14 27 L6 27 Z" fill={body} opacity={0.85} />
      {/* fuselage */}
      <path
        d="M6 22 C6 18.5 11 16.5 20 16.5 L94 16.5 C105 16.5 114 18.6 118 22 C114 25.4 105 27.5 94 27.5 L20 27.5 C11 27.5 6 25.5 6 22 Z"
        fill={body}
      />
      {/* belly line */}
      <path d="M20 24.6 L106 24.6" stroke={accent} strokeWidth={1.2} opacity={0.9} />
      {/* windows */}
      {Array.from({ length: 11 }, (_, i) => (
        <circle key={i} cx={34 + i * 6} cy={20.4} r={1.15} fill={window} />
      ))}
      {/* cockpit */}
      <path d="M104 18.4 L111 19.6 L109.5 21 L103.5 20.4 Z" fill={window} />
      {/* wing */}
      <path d="M50 23 L70 23 L56 36.5 Q55 38 53 38 L48 38 Z" fill={body} opacity={0.92} />
      {/* engine */}
      <rect x={52} y={27.5} width={13} height={5} rx={2.5} fill={body} stroke={window} strokeOpacity={0.2} />
    </g>
  )
}
