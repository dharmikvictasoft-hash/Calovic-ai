import { useState } from "react";

const insightTips = [
  "You are closest to your step goal after 6 PM. Plan a 20-minute walk in the evening to close the gap faster.",
  "Your water intake improves when paired with meals. Add one glass before each meal to hit your daily target.",
  "Protein is lower than target on most days. Add one protein-rich snack in the afternoon to improve consistency.",
];

function AICard() {
  const [isVisible, setIsVisible] = useState(true);
  const tipOfTheDay = insightTips[new Date().getDate() % insightTips.length];

  if (!isVisible) return null;

  return (
    <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">AI Assistant</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#6b7280]">Today</p>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d1d5db] bg-white text-sm text-[#6b7280] transition hover:bg-[#f3f4f6]"
            aria-label="Dismiss AI card"
          >
            ×
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-white/70 p-2.5">
        <div className="rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#374151] sm:text-base">
          {tipOfTheDay}
        </div>
      </div>
    </section>
  );
}

export default AICard;
