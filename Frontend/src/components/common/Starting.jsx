import { useEffect, useState } from 'react'

function Starting({ onGetStarted }) {
  const [showButton, setShowButton] = useState(false)
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    const intro = requestAnimationFrame(() => {
      setShowTitle(true)
    })

    const timer = setTimeout(() => {
      setShowButton(true)
    }, 2000)

    return () => {
      cancelAnimationFrame(intro)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1
        className={`text-center text-[clamp(2rem,7vw,3.25rem)] font-bold transition-all duration-700 ease-in-out${
          showTitle ? 'opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        CaloVic AI
      </h1>

      <div className="flex min-h-14 w-full items-center justify-center">
        {showButton && (
          <button
            onClick={onGetStarted}
            className="h-12 w-full max-w-[500px] rounded-full bg-[#6366F1] px-4 py-2 text-base font-bold text-white hover:bg-[#375280] sm:h-[55px] sm:text-lg"
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  )
}

export default Starting
