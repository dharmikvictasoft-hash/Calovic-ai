import { useEffect, useMemo, useState } from "react";

const DEFAULT_MACROS = [
  { key: "protein", label: "Protein", value: 30, grams: 150, color: "#3b82f6", depth: "#2563eb" },
  { key: "carbs", label: "Carbs", value: 40, grams: 200, color: "#f59e0b", depth: "#d97706" },
  { key: "fat", label: "Fat", value: 30, grams: 67, color: "#10b981", depth: "#059669" },
];

const START_ANGLE = -90;

function polar(cx, cy, r, angle) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, start, end) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
}

function depthPath(cx, topY, bottomY, r, start, end) {
  const sTop = polar(cx, topY, r, start);
  const eTop = polar(cx, topY, r, end);
  const sBottom = polar(cx, bottomY, r, start);
  const eBottom = polar(cx, bottomY, r, end);
  const large = end - start > 180 ? 1 : 0;

  return `M ${sTop.x} ${sTop.y}
    A ${r} ${r} 0 ${large} 1 ${eTop.x} ${eTop.y}
    L ${eBottom.x} ${eBottom.y}
    A ${r} ${r} 0 ${large} 0 ${sBottom.x} ${sBottom.y}
    Z`;
}

function PieChart({ data = DEFAULT_MACROS }) {
  const [active, setActive] = useState(null);
  const [mounted, setMounted] = useState(false);
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const slices = useMemo(() => {
    const cx = 210;
    const topY = 132;
    const bottomY = 156;
    const radius = 96;
    let cursor = START_ANGLE;

    return data.map((item, index) => {
      const sweep = (item.value / total) * 360;
      const start = cursor;
      const end = cursor + sweep;
      cursor = end;

      const mid = (start + end) / 2;
      const lift = active === index ? 6 : 2;
      const dx = Math.cos((mid * Math.PI) / 180) * lift;
      const dy = Math.sin((mid * Math.PI) / 180) * lift * 0.7;

      const visibleStart = Math.max(start, 0);
      const visibleEnd = Math.min(end, 180);

      const labelStart = polar(cx + dx, topY + dy, radius + 6, mid);
      const labelMid = polar(cx + dx, topY + dy, radius + 24, mid);
      const labelEndX = labelMid.x + (labelMid.x >= cx ? 42 : -42);

      return {
        ...item,
        index,
        start,
        end,
        mid,
        percent: Math.round((item.value / total) * 100),
        cx,
        topY,
        bottomY,
        radius,
        dx,
        dy,
        showDepth: visibleEnd > visibleStart,
        visibleStart,
        visibleEnd,
        labelStart,
        labelMid,
        labelEndX,
      };
    });
  }, [active, data, total]);

  return (
    <section
      className={`font-body w-full rounded-2xl border border-[#d9e1ef] bg-[#f8fafc] p-3 shadow-sm transition-all duration-500 sm:p-4 ${
        mounted ? "translate-y-0 opacity-100 hover:-translate-y-0.5 hover:shadow-md" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#0f172a]">Macro Average</h3>
          <p className="text-xs text-[#64748b]">Protein, carbs and fat distribution</p>
        </div>
        <p className="rounded-full border border-[#dbe4f2] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#334155]">
          Daily split
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 transition-shadow duration-300 hover:shadow-sm sm:px-4 sm:py-3">
          <svg
            viewBox="-20 0 460 280"
            className={`h-[280px] w-full overflow-visible transition-all duration-700 sm:h-[300px] ${
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
            }`}
            onMouseLeave={() => setActive(null)}
          >
            <defs>
              <filter id="pieShadow" x="-25%" y="-30%" width="160%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.2" />
              </filter>
            </defs>

            <ellipse cx="210" cy="214" rx="114" ry="22" fill="#94a3b8" opacity="0.18" />

            <g transform="translate(0 28) scale(1 0.78)">
              {slices.map((slice) =>
                slice.showDepth ? (
                  <path
                    key={`${slice.key}-depth`}
                    d={depthPath(
                      slice.cx + slice.dx,
                      slice.topY + slice.dy,
                      slice.bottomY + slice.dy,
                      slice.radius,
                      slice.visibleStart,
                      slice.visibleEnd
                    )}
                    fill={slice.depth}
                  />
                ) : null
              )}

              {slices.map((slice) => (
                <path
                  key={`${slice.key}-top`}
                  d={arcPath(slice.cx + slice.dx, slice.topY + slice.dy, slice.radius, slice.start, slice.end)}
                  fill={slice.color}
                  filter="url(#pieShadow)"
                  className="cursor-pointer transition-all duration-500 hover:brightness-105"
                  onMouseEnter={() => setActive(slice.index)}
                  onClick={() => setActive((prev) => (prev === slice.index ? null : slice.index))}
                />
              ))}

              <ellipse cx="210" cy="98" rx="68" ry="16" fill="#ffffff" opacity="0.14" />
            </g>

            {slices.map((slice) => (
              <g key={`${slice.key}-label`}>
                <line x1={slice.labelStart.x} y1={slice.labelStart.y + 24} x2={slice.labelMid.x} y2={slice.labelMid.y + 24} stroke={slice.color} strokeWidth="1.75" />
                <line x1={slice.labelMid.x} y1={slice.labelMid.y + 24} x2={slice.labelEndX} y2={slice.labelMid.y + 24} stroke={slice.color} strokeWidth="1.75" />
                <text
                  x={slice.labelEndX + (slice.labelEndX >= 210 ? 6 : -6)}
                  y={slice.labelMid.y + 20}
                  textAnchor={slice.labelEndX >= 210 ? "start" : "end"}
                  fontSize="18"
                  fontWeight="700"
                  fill="#1e293b"
                >
                  {slice.label}
                </text>
                <text
                  x={slice.labelEndX + (slice.labelEndX >= 210 ? 6 : -6)}
                  y={slice.labelMid.y + 33}
                  textAnchor={slice.labelEndX >= 210 ? "start" : "end"}
                  fontSize="14"
                  fill="#64748b"
                >
                  {slice.percent}%
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {slices.map((slice) => (
            <article
              key={slice.key}
              className={`rounded-xl border px-3 py-2 transition-all ${
                active === slice.index
                  ? "border-[#bfdbfe] bg-[#f8fbff] shadow-sm"
                  : "border-[#e2e8f0] bg-white"
              }`}
              onMouseEnter={() => setActive(slice.index)}
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                  <p className="text-sm font-semibold text-[#1e293b]">{slice.label}</p>
                </div>
                <p className="text-sm font-bold text-[#0f172a]">{slice.percent}%</p>
              </div>
              <p className="text-xs text-[#64748b]">{slice.grams}g / day</p>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#e2e8f0]">
                <div className="h-full rounded-full" style={{ width: `${slice.percent}%`, backgroundColor: slice.color }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PieChart;
