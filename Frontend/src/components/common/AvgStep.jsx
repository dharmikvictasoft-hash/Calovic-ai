import { useMemo } from "react";

function AvgStep({ averageSteps = 8450, goalSteps = 10000 }) {
  const progress = Math.min((averageSteps / goalSteps) * 100, 100);
  const remaining = Math.max(goalSteps - averageSteps, 0);

  const statusText = useMemo(() => {
    if (averageSteps >= goalSteps)
      return "Goal achieved. Keep the streak going.";
    if (progress >= 85)
      return `Almost there. ${remaining.toLocaleString()} steps to goal.`;
    return `${remaining.toLocaleString()} steps left to reach your daily goal.`;
  }, [averageSteps, goalSteps, progress, remaining]);

  return (
    <section className="font-body w-full rounded-2xl border border-[#d9e1ef] bg-[#f8fafc] p-3 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-md sm:p-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-[#0f172a]">
            Average Steps
          </h3>
          <p className="text-xs text-[#64748b]">Average step count per day</p>
        </div>
        <span className="rounded-full border border-[#dbe4f2] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#334155]">
          Goal: {goalSteps.toLocaleString()}
        </span>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 transition-shadow duration-300 hover:shadow-sm sm:p-4">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="font-display text-2xl font-semibold text-[#0f172a]">
            {averageSteps.toLocaleString()}
          </p>
          <p className="text-sm font-semibold text-[#334155]">
            {Math.round(progress)}%
          </p>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
          <div
            className="avgstep-fill h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              backgroundImage: "linear-gradient(to right, #22c55e, #16a34a)",
            }}
          >
            <span className="avgstep-shine" />
          </div>
        </div>

        <p className="mt-2 text-xs font-medium text-[#64748b]">{statusText}</p>
      </div>
    </section>
  );
}

export default AvgStep;