import React from "react";
import Header from "../common/Header";
import CalorieCard from "../common/CalorieCard";
import NutritionCard from "../common/NutritionCard";
import StepCard from "../common/StepCard";
import WaterCard from "../common/WaterCard";
import MealCard from "../common/MealCard";
import AICard from "../common/AICard";
import StreakCalendar from "../common/StreakCalendar";
import { RiFireLine } from "react-icons/ri";

function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-gray-200 pb-24 sm:pb-28">
      <Header activeTab="Home" onTabChange={onNavigate} />
      <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
        <div className="streak-pill relative flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-50 px-4 py-3 shadow-sm">
          <span className="sparkle-star sparkle-star-1">✦</span>
          <span className="sparkle-star sparkle-star-2">✦</span>
          <span className="sparkle-star sparkle-star-3">✦</span>
          <span className="sparkle-star sparkle-star-4">✦</span>
          <span className="sparkle-star sparkle-star-5">✦</span>
          <span className="sparkle-star sparkle-star-6">✦</span>
          <RiFireLine className="text-xl text-orange-500 sm:text-2xl" />
          <p className="font-display text-base font-bold text-orange-700 sm:text-lg">30 Day Streak</p>
        </div>
        <StreakCalendar />
      </div>
      <div className="mx-auto mt-3 grid w-full max-w-[1400px] grid-cols-1 gap-3 px-2 md:px-3 lg:grid-cols-2 lg:items-stretch">
        <div className="w-full">
          <CalorieCard />
        </div>
        <div className="w-full">
          <NutritionCard />
        </div>
        <div className="w-full">
          <StepCard />
        </div>
        <div className="w-full">
          <WaterCard />
        </div>
        <div className="w-full lg:col-span-2">
          <MealCard />
        </div>
        <div className="w-full lg:col-span-2">
          <AICard />
        </div>
      </div>
    </div>
  );
}

export default Home;
