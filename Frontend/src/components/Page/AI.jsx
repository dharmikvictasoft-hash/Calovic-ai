import Header from "../common/Header";
import AIChat from "../common/AIChat";
import FoodAnalyzer from "../common/foodUpload";

function AI({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-200 pb-24 sm:pb-28">
      <Header activeTab="AI" onTabChange={onNavigate} />
      <FoodAnalyzer />
      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <AIChat />
      </div>
    </div>
  );
}

export default AI;
