import { useEffect, useState } from "react";
import { IoWater } from "react-icons/io5";

const ANIMATION_MS = 1250;
const GOAL_WATER_ML = 3000;
const INITIAL_WATER_ML = 1250;
const WATER_STEP_ML = 250;

const ring = {
  radius: 45,
  color: "#06b6d4",
  width: 11,
};

function WaterCard() {
  const [waterMl, setWaterMl] = useState(0);

  useEffect(() => {
    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setWaterMl(Math.round(INITIAL_WATER_ML * eased));
      if (t < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const increaseWater = () => {
    setWaterMl((prev) => Math.min(prev + WATER_STEP_ML, GOAL_WATER_ML));
  };

  const decreaseWater = () => {
    setWaterMl((prev) => Math.max(prev - WATER_STEP_ML, 0));
  };

  const remaining = Math.max(GOAL_WATER_ML - waterMl, 0);
  const progress = Math.min(waterMl / GOAL_WATER_ML, 1);
  const circumference = 2 * Math.PI * ring.radius;
  const dash = circumference * progress;
  const gap = circumference - dash;

  return (
    <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Water</h2>
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
              style={{ transition: "stroke-dasharray 220ms linear" }}
            />
          </svg>

          <div className="absolute grid place-items-center text-center text-[#0891b2]">
            <IoWater className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        </div>

        <div className="w-full max-w-[250px] space-y-1 rounded-xl bg-white/70 p-2.5">
          <p className="text-xs font-medium text-[#6b7280] sm:text-sm">Drank / Goal</p>
          <p className="font-display text-lg font-bold text-[#111827] sm:text-xl">
            {waterMl} <span className="text-sm font-semibold text-[#6b7280] sm:text-base">/ {GOAL_WATER_ML} ml</span>
          </p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-[#06b6d4] transition-all duration-300"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm">
            <p className="rounded-lg bg-white px-2 py-1.5 text-[#374151]">
              Remaining: <span className="font-semibold">{remaining} ml</span>
            </p>
            <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5 text-[#374151]">
              <button
                type="button"
                onClick={decreaseWater}
                className="h-6 w-6 rounded-full border border-[#cbd5e1] bg-white text-sm font-bold leading-none text-[#0f172a] transition hover:bg-[#f1f5f9]"
                aria-label="Remove water"
              >
                -
              </button>
              <span className="text-[11px] font-semibold">{WATER_STEP_ML} ml</span>
              <button
                type="button"
                onClick={increaseWater}
                className="h-6 w-6 rounded-full border border-[#67e8f9] bg-[#06b6d4] text-sm font-bold leading-none text-white transition hover:bg-[#0891b2]"
                aria-label="Add water"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WaterCard;
