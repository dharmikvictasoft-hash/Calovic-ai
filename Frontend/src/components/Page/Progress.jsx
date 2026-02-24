import Header from "../common/Header";
import ProgressChart from "../common/ProgressChart";
import PieChart from "../common/PieChart";
import BarChart from "../common/BarChart";
import AvgStep from "../common/AvgStep";

function Progress({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-200 pb-24 sm:pb-28">
      <Header activeTab="Progress" onTabChange={onNavigate} />

      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <ProgressChart />
      </div>
      <div className="mx-auto mt-3 grid w-full max-w-[1400px] grid-cols-1 gap-3 px-2 md:px-3 lg:grid-cols-2">
        <BarChart />
        <PieChart />
      </div>
      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <AvgStep />
      </div>
    </div>
  );
}

export default Progress;
