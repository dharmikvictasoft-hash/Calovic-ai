import { useEffect, useState } from "react";

const ANIMATION_MS = 1800;
const GOAL_CALORIES = 2465;
const TARGET_CONSUMED = 1840;

const rings = [
  { radius: 96, progress: 0.84, color: "#f43f8f", width: 10 },
  { radius: 78, progress: 0.72, color: "#f97316", width: 10 },
  { radius: 60, progress: 0.66, color: "#84cc16", width: 10 },
  { radius: 42, progress: 0.58, color: "#5eead4", width: 10 },
];

function CalorieCard() {
  const [progressScale, setProgressScale] = useState(0);
  const [consumed, setConsumed] = useState(0);

  useEffect(() => {
    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setProgressScale(eased);
      setConsumed(Math.round(TARGET_CONSUMED * eased));

      if (t < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const remaining = Math.max(GOAL_CALORIES - consumed, 0);

  return (
    <section className="font-body h-full w-full rounded-3xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Calories</h2>
        <p className="text-sm text-[#6b7280]">Today</p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative mx-auto grid h-[195px] w-[195px] place-items-center sm:h-[225px] sm:w-[225px] md:h-[255px] md:w-[255px] lg:mx-0 xl:h-[240px] xl:w-[240px]">
          <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
            {rings.map((ring, idx) => {
              const circumference = 2 * Math.PI * ring.radius;
              const dash = circumference * ring.progress * progressScale;
              const gap = circumference - dash;

              return (
                <g key={ring.radius}>
                  <circle
                    cx="130"
                    cy="130"
                    r={ring.radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={ring.width}
                  />
                  <circle
                    cx="130"
                    cy="130"
                    r={ring.radius}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={ring.width}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${gap}`}
                    style={{ transition: `stroke-dasharray ${280 + idx * 100}ms linear` }}
                  />
                </g>
              );
            })}
          </svg>

          <div className="absolute grid place-items-center text-center">
            <p className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl">🔥</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[290px] space-y-2 rounded-2xl bg-white/70 p-3 lg:mx-0 xl:max-w-[290px]">
          <p className="text-xs font-medium text-[#6b7280] sm:text-sm">Consumed / Goal</p>
          <p className="font-display text-lg font-bold text-[#111827] sm:text-xl md:text-2xl">
            {consumed} <span className="text-sm font-semibold text-[#6b7280]">/ {GOAL_CALORIES} kcal</span>
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-[#f97316] transition-all duration-300"
              style={{ width: `${Math.min((consumed / GOAL_CALORIES) * 100, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            <p className="rounded-lg bg-white px-2 py-2 text-[#374151]">Remaining: <span className="font-semibold">{remaining}</span></p>
            <p className="rounded-lg bg-white px-2 py-2 text-[#374151]">Burned: <span className="font-semibold">320</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CalorieCard;
