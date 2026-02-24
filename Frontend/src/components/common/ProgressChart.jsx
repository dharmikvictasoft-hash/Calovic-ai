import { useEffect, useMemo, useState } from "react";
import { FiCalendar } from "react-icons/fi";

const CHART_DATA = {
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    primary: [78, 80, 76, 74, 77, 75, 76, 82, 86, 84, 88, 87],
    secondary: [58, 56, 60, 58, 61, 58, 63, 68, 70, 72, 76, 74],
  },
  Quarterly: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    primary: [80, 76, 84, 87],
    secondary: [58, 60, 68, 74],
  },
  Annually: {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    primary: [72, 76, 80, 84, 88],
    secondary: [54, 58, 62, 68, 73],
  },
};

const RANGE_TABS = ["Monthly", "Quarterly", "Annually"];

function ProgressChart() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [mounted, setMounted] = useState(false);

  const current = CHART_DATA[activeTab];
  const maxY = 100;
  const yTicks = isMobile ? [0, 50, 100] : [0, 20, 40, 60, 80, 100];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(timer);
  }, []);

  const chart = useMemo(() => {
    const left = isMobile ? 36 : 52;
    const right = isMobile ? 12 : 18;
    const top = isMobile ? 14 : 16;
    const bottom = isMobile ? 30 : 40;
    const width = 820;
    const height = isMobile ? 250 : 290;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const xStep = plotWidth / Math.max(current.labels.length - 1, 1);

    const toPoint = (value, index) => {
      const x = left + index * xStep;
      const y = top + ((maxY - value) / maxY) * plotHeight;
      return { x, y, value, label: current.labels[index] };
    };

    const primaryPoints = current.primary.map(toPoint);
    const secondaryPoints = current.secondary.map(toPoint);
    const primaryLine = primaryPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const secondaryLine = secondaryPoints.map((p) => `${p.x},${p.y}`).join(" ");
    const areaPath = `M ${left},${top + plotHeight} L ${primaryLine} L ${left + plotWidth},${top + plotHeight} Z`;

    return { left, top, plotWidth, plotHeight, primaryPoints, secondaryPoints, primaryLine, secondaryLine, areaPath, height };
  }, [current, isMobile]);

  return (
    <section
      className={`font-body w-full rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3 shadow-sm transition-all duration-500 sm:p-4 ${
        mounted ? "translate-y-0 opacity-100 hover:-translate-y-0.5 hover:shadow-md" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-[#0f172a] ">Statistics</h2>
          <p className="text-[11px] text-[#64748b] sm:text-xs">Target you've set for each month</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="flex rounded-xl border border-[#e2e8f0] bg-white p-1">
            {RANGE_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setHoveredIndex(null);
                }}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] transition sm:text-xs ${
                  activeTab === tab
                    ? "font-display bg-[#f1f5f9] text-[#0f172a]"
                    : "font-medium text-[#64748b] hover:bg-[#f8fafc]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-[11px] font-semibold text-[#334155] sm:text-xs"
          >
            <FiCalendar className="h-4 w-4 text-[#64748b]" />
            Feb 14 to Feb 20
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-2 transition-shadow duration-300 hover:shadow-sm sm:p-3">
        <svg viewBox={`0 0 820 ${chart.height}`} className={`w-full transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <defs>
            <linearGradient id="progressArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f74ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4f74ff" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = chart.top + ((maxY - tick) / maxY) * chart.plotHeight;
            return (
              <g key={tick}>
                <line x1={chart.left} y1={y} x2={chart.left + chart.plotWidth} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                <text x="8" y={y + 4} fontSize={isMobile ? "8" : "10"} fill="#64748b">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={chart.areaPath} fill="url(#progressArea)" />
          <polyline points={chart.primaryLine} fill="none" stroke="#3b5bff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={chart.secondaryLine} fill="none" stroke="#8fb0ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {chart.primaryPoints.map((point, idx) => (
            <g
              key={`${point.label}-${idx}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => setHoveredIndex((prev) => (prev === idx ? null : idx))}
            >
              <circle cx={point.x} cy={point.y} r={isMobile ? "12" : "10"} fill="transparent" />
              {isMobile && idx % 2 !== 0 && activeTab === "Monthly" ? null : (
                <text
                  x={point.x}
                  y={chart.top + chart.plotHeight + (isMobile ? 20 : 26)}
                  fontSize={isMobile ? "8" : "10"}
                  textAnchor="middle"
                  fill="#334155"
                >
                  {point.label}
                </text>
              )}
            </g>
          ))}

          {hoveredIndex !== null ? (
            <g>
              <rect
                x={Math.min(Math.max(chart.primaryPoints[hoveredIndex].x + 10, 8), isMobile ? 740 : 710)}
                y={Math.max(chart.primaryPoints[hoveredIndex].y - (isMobile ? 28 : 32), 6)}
                width={isMobile ? "78" : "92"}
                height={isMobile ? "28" : "34"}
                rx="10"
                fill="#0f172a"
              />
              <text
                x={Math.min(Math.max(chart.primaryPoints[hoveredIndex].x + 10, 8), isMobile ? 740 : 710) + (isMobile ? 39 : 46)}
                y={Math.max(chart.primaryPoints[hoveredIndex].y - (isMobile ? 11 : 11), 16)}
                fontSize={isMobile ? "9" : "10"}
                textAnchor="middle"
                fill="#ffffff"
              >
                {chart.primaryPoints[hoveredIndex].value.toFixed(1)} kg
              </text>
            </g>
          ) : null}

          {isMobile ? (
            <rect
              x={chart.left}
              y={chart.top}
              width={chart.plotWidth}
              height={chart.plotHeight}
              fill="transparent"
              onClick={() => setHoveredIndex(null)}
            />
          ) : null}
        </svg>
      </div>
    </section>
  );
}

export default ProgressChart;
