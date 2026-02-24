import { useEffect, useState } from "react";

const DEFAULT_DATA = [
  { day: "Mon", calories: 1820 },
  { day: "Tue", calories: 1980 },
  { day: "Wed", calories: 2075 },
  { day: "Thu", calories: 1940 },
  { day: "Fri", calories: 2160 },
  { day: "Sat", calories: 2050 },
  { day: "Sun", calories: 1885 },
];

function BarChart({ data = DEFAULT_DATA, goal = 2150 }) {
  const [mounted, setMounted] = useState(false);
  const peak = Math.max(...data.map((item) => item.calories), goal, 1);
  const average = Math.round(data.reduce((sum, item) => sum + item.calories, 0) / data.length);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`font-body w-full rounded-2xl border border-[#d9e1ef] bg-[#f8fafc] p-3 shadow-sm transition-all duration-500 sm:p-4 ${
        mounted ? "translate-y-0 opacity-100 hover:-translate-y-0.5 hover:shadow-md" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#0f172a]">Average Calorie</h3>
          <p className="text-xs text-[#64748b]">Day wise calories</p>
        </div>
        <p className="rounded-full border border-[#dbe4f2] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#334155]">
          Avg {average} cal
        </p>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 transition-shadow duration-300 hover:shadow-sm sm:p-4">
        <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
          {data.map((item, index) => {
            const height = Math.max((item.calories / peak) * 100, 8);
            const reachedGoal = item.calories >= goal;

            return (
              <div key={item.day} className="flex min-w-0 flex-1 flex-col items-center">
                <p className="mb-1 text-[10px] font-semibold text-[#475569] sm:text-xs">{item.calories}</p>
                <div className="group relative flex h-36 w-full max-w-10 items-end rounded-lg bg-[#eef2f7]">
                  <div
                    className={`w-full rounded-lg transition-all duration-700 group-hover:brightness-110 ${
                      reachedGoal
                        ? "bg-gradient-to-t from-[#2563eb] to-[#60a5fa]"
                        : "bg-gradient-to-t from-[#3b82f6] to-[#93c5fd]"
                    }`}
                    style={{ height: mounted ? `${height}%` : "0%", transitionDelay: `${80 + index * 45}ms` }}
                    title={`${item.day}: ${item.calories} cal`}
                  />
                </div>
                <p className="mt-1 text-[10px] font-semibold text-[#64748b] sm:text-xs">{item.day}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e8f0] pt-2">
          <p className="text-xs text-[#64748b]">
            Goal: <span className="font-semibold text-[#334155]">{goal} cal/day</span>
          </p>
          <p className="text-xs text-[#64748b]">
            Weekly Avg: <span className="font-semibold text-[#334155]">{average} cal/day</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default BarChart;
