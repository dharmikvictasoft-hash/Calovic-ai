import { useEffect, useState } from "react";

const ANIMATION_MS = 1800;

const nutritionTargets = [
  { key: "protein", label: "Protein", value: 112, goal: 166, color: "#22c55e", unit: "g" },
  { key: "carbs", label: "Carbs", value: 210, goal: 295, color: "#f59e0b", unit: "g" },
  { key: "fat", label: "Fat", value: 52, goal: 68, color: "#ef4444", unit: "g" },
];

function NutritionCard() {
  const [progressScale, setProgressScale] = useState(0);

  useEffect(() => {
    let frameId;
    const start = performance.now();

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / ANIMATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgressScale(eased);

      if (t < 1) frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <section className="font-body flex h-full w-full flex-col gap-2 sm:gap-3">
        {nutritionTargets.map((item) => {
          const animatedValue = Math.round(item.value * progressScale);
          const progressPercent = Math.min((animatedValue / item.goal) * 100, 100);
          const remaining = Math.max(item.goal - animatedValue, 0);

          return (
            <article
              key={item.key}
              className="flex-1 rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold text-[#111827] sm:text-base">{item.label}</p>
                <p className="text-right text-[11px] font-medium leading-tight text-[#4b5563] sm:text-sm">
                  Total: {animatedValue}{item.unit} / Goal: {item.goal}{item.unit}
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb] sm:h-2.5">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%`, backgroundColor: item.color }}
                />
              </div>
              <p className="mt-2 text-xs text-[#6b7280] sm:text-sm">
                Remaining: <span className="font-semibold text-[#374151]">{remaining}{item.unit}</span>
              </p>
            </article>
          );
        })}
    </section>
  );
}

export default NutritionCard;
