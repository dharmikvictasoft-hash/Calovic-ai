import Header from "../common/Header";

function Add({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-200 pb-24 sm:pb-28">
      <Header activeTab="Add" onTabChange={onNavigate} />

      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-4 shadow-md sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Add Entry</h2>
            <p className="text-sm text-[#6b7280]">Quick Add</p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button type="button" className="rounded-xl bg-white px-3 py-4 text-left">
              <p className="text-xs text-[#6b7280]">Meal</p>
              <p className="font-display text-lg font-bold text-[#111827]">+ Add Meal</p>
            </button>
            <button type="button" className="rounded-xl bg-white px-3 py-4 text-left">
              <p className="text-xs text-[#6b7280]">Water</p>
              <p className="font-display text-lg font-bold text-[#111827]">+ Add Water</p>
            </button>
            <button type="button" className="rounded-xl bg-white px-3 py-4 text-left">
              <p className="text-xs text-[#6b7280]">Workout</p>
              <p className="font-display text-lg font-bold text-[#111827]">+ Add Workout</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Add;
