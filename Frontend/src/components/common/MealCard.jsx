const meals = [
  { id: "breakfast", label: "Breakfast", calories: 420, color: "#f97316" },
  { id: "lunch", label: "Lunch", calories: 520, color: "#22c55e" },
  { id: "dinner", label: "Dinner", calories: 620, color: "#3b82f6" },
  { id: "snack", label: "Snack", calories: 320, color: "#a855f7" },
];

const GOAL_MEAL_CALORIES = 2200;

function MealCard() {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-3 shadow-md sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Today's Meals</h2>
        <p className="text-sm text-[#6b7280]">Today</p>
      </div>

      <div className="space-y-2 rounded-xl bg-white/70 p-2.5">
        {meals.map((meal) => {
          return (
            <article key={meal.id} className="rounded-lg bg-white px-3 py-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#1f2937] sm:text-sm">{meal.label}</p>
                <p className="font-display text-sm font-semibold text-[#111827] sm:text-base">
                  {meal.calories} kcal
                </p>
              </div>
            </article>
          );
        })}

        <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs sm:text-sm">
          <p className="rounded-lg bg-white px-2 py-1.5 text-[#374151]">
            Total: <span className="font-semibold">{totalCalories} kcal</span>
          </p>
          <p className="rounded-lg bg-white px-2 py-1.5 text-right text-[#374151]">
            Remaining: <span className="font-semibold">{Math.max(GOAL_MEAL_CALORIES - totalCalories, 0)} kcal</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default MealCard;
