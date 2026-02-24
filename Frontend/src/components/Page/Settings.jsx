import Header from "../common/Header";

function Settings({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-200 pb-24 sm:pb-28">
      <Header activeTab="Settings" onTabChange={onNavigate} />

      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <section className="font-body w-full rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f4f4f5] to-[#eceff3] p-4 shadow-md sm:p-5">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#1f2937] sm:text-lg">Settings</h2>
            <p className="text-sm text-[#6b7280]">Preferences</p>
          </div>

          <div className="space-y-2">
            <div className="rounded-xl bg-white px-3 py-3 flex items-center justify-between">
              <p className="text-sm text-[#374151]">Daily reminders</p>
              <span className="text-xs font-semibold text-[#6b7280]">On</span>
            </div>
            <div className="rounded-xl bg-white px-3 py-3 flex items-center justify-between">
              <p className="text-sm text-[#374151]">Units</p>
              <span className="text-xs font-semibold text-[#6b7280]">Metric</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;
