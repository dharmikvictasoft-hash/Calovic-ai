import { useEffect, useState } from "react";
import { RiFootprintFill } from "react-icons/ri";

const ANIMATION_MS = 1800;
const GOAL_STEPS = 10000;
const TARGET_STEPS = 7420;

const ring = {
  radius: 45,
  progress: TARGET_STEPS / GOAL_STEPS,
  color: "#3b82f6",
  width: 11,
};

function StepCard() {
  const [progressScale, setProgressScale] = useState(0);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      setProgressScale(eased);
      setSteps(Math.round(TARGET_STEPS * eased));

      if (t < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const remaining = Math.max(GOAL_STEPS - steps, 0);
  const distanceKm = (steps * 0.0008).toFixed(1);
  const circumference = 2 * Math.PI * ring.radius;
  const dash = circumference * ring.progress * progressScale;
  const gap = circumference - dash;

  return (
    <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Steps</h2>
        <p className="text-sm text-[#6b7280]">Today</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="relative mr-2 grid h-[100px] w-[100px] place-items-center sm:mr-3 sm:h-[112px] sm:w-[112px]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle
              cx="60"
              cy="60"
              r={ring.radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={ring.width}
            />
            <circle
              cx="60"
              cy="60"
              r={ring.radius}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.width}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              style={{ transition: "stroke-dasharray 320ms linear" }}
            />
          </svg>

          <div className="absolute grid place-items-center text-center text-[#2563eb]">
            <RiFootprintFill className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        </div>

        <div className="w-full max-w-[250px] space-y-1 rounded-xl bg-white/70 p-2.5">
          <p className="text-xs font-medium text-[#6b7280] sm:text-sm">Walked / Goal</p>
          <p className="font-display text-lg font-bold text-[#111827] sm:text-xl">
            {steps} <span className="text-sm font-semibold text-[#6b7280] sm:text-base">/ {GOAL_STEPS} steps</span>
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-[#3b82f6] transition-all duration-300"
              style={{ width: `${Math.min((steps / GOAL_STEPS) * 100, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm">
            <p className="rounded-lg bg-white px-2 py-1.5 text-[#374151]">Remaining: <span className="font-semibold">{remaining}</span></p>
            <p className="rounded-lg bg-white px-2 py-1.5 text-[#374151]">Distance: <span className="font-semibold">{distanceKm} km</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StepCard;
