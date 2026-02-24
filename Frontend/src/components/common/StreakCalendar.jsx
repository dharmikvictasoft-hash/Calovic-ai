function toYmd(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function StreakCalendar() {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayKey = toYmd(today);

  let streakHistory = new Set([todayKey]);
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("calovic-streak-history");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          streakHistory = new Set([...parsed.filter((item) => typeof item === "string"), todayKey]);
        }
      }
    } catch {
      streakHistory = new Set([todayKey]);
    }
  }

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index - 3);
    return date;
  });

  return (
    <section className="font-body mt-3 w-full overflow-hidden rounded-2xl border border-[#e5e7eb] bg-gradient-to-r from-[#fff7ed] via-[#f8fafc] to-[#ecfeff] p-3 shadow-md sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold text-[#1f2937] sm:text-base">Streak Path</h3>
          <p className="text-[11px] text-[#6b7280] sm:text-xs">Past, today, and upcoming</p>
        </div>
        <p className="rounded-full border border-[#fed7aa] bg-white px-2 py-1 text-[11px] font-semibold text-[#c2410c] sm:px-2.5 sm:text-xs">
          7 Days
        </p>
      </div>

      <div>
        <div className="grid grid-cols-7 gap-1 rounded-2xl bg-white/70 p-1.5 sm:gap-2 sm:p-2">
        {weekDates.map((date) => {
          const isToday = isSameDay(date, today);
          const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dayDiff = Math.round((dateStart - todayStart) / 86400000);
          const isPast = dayDiff < 0;
          const isFuture = dayDiff > 0;
          const isCompletedPastDay = isPast && streakHistory.has(toYmd(date));
          const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });

          return (
            <div
              key={date.toISOString()}
              className={`relative rounded-xl border px-0.5 py-1.5 text-center transition sm:px-1 sm:py-2 ${
                isToday
                  ? "border-indigo-300 bg-indigo-100 text-indigo-800 shadow-sm"
                  : isCompletedPastDay
                    ? "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm"
                    : isPast
                      ? "border-[#d1d5db] bg-white text-[#94a3b8] opacity-70 blur-[1px]"
                    : isFuture
                      ? "border-dashed border-indigo-200 bg-indigo-50 text-indigo-500"
                      : "border-[#d1d5db] bg-white text-[#6b7280]"
              }`}
            >
              <p className="text-[8px] font-semibold uppercase tracking-tight sm:text-xs">{dayLabel}</p>
              <div
                className={`mx-auto mt-1 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold sm:h-8 sm:w-8 sm:text-base ${
                  isToday
                    ? "bg-indigo-200 text-indigo-900"
                    : isCompletedPastDay
                      ? "bg-emerald-200 text-emerald-900"
                      : isPast
                        ? "bg-slate-200 text-slate-500"
                        : "bg-indigo-100 text-indigo-500"
                }`}
              >
                <span className="font-display">{date.getDate()}</span>
              </div>
              {isCompletedPastDay ? (
                <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  ✓
                </span>
              ) : null}
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

export default StreakCalendar;
