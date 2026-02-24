function Landing({ onGetStarted }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-center text-[clamp(1.75rem,6vw,3rem)] font-bold">Calories Tracking Made Easy</h1>

      <div className="mt-6 flex min-h-14 w-full items-center justify-center">
        <button
          onClick={onGetStarted}
          className="h-12 w-full max-w-[500px] rounded-full bg-[#6366F1] px-4 py-2 text-base font-bold text-white hover:bg-[#375280] sm:h-[55px] sm:text-lg"
        >
          Get Started
        </button>
      </div>

      <p className="mt-4 text-center text-sm sm:text-base md:text-lg">Purchase on the web? <a href="" className="underline">Sign in</a></p>
    </div>
  )
}

export default Landing
