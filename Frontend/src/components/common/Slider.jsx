import { useEffect, useMemo, useRef, useState } from 'react'

const slides = [
  { id: 'gender', title: 'Choose your gender', subtitle: 'This helps personalize your plan.' },
  { id: 'height-weight', title: 'Height & weight', subtitle: 'This will be used to calibrate your custom plan.' },
  { id: 'birth', title: 'When were you born?', subtitle: 'We use your age for accurate daily targets.' },
  { id: 'goal', title: 'What is your goal?', subtitle: 'This helps us generate your calorie intake.' },
  { id: 'desired-weight', title: 'What is your desired weight?', subtitle: 'Set your target so we can build your timeline.' },
  { id: 'realistic', title: 'Realistic target', subtitle: 'This goal is achievable with a steady approach.' },
  { id: 'speed', title: 'How fast do you want to reach your goal?', subtitle: 'Pick a weekly pace that feels sustainable.' },
  { id: 'comparison', title: 'Gain twice as much with CaloVic AI vs on your own', subtitle: 'Guided plans improve consistency.' },
  { id: 'stopping', title: "What's stopping you from reaching your goals?", subtitle: 'Choose your biggest blocker.' },
  { id: 'diet', title: 'Do you follow a specific diet?', subtitle: 'Select the option that best fits you.' },
  { id: 'accomplish', title: 'What would you like to accomplish?', subtitle: 'Pick the outcome you care about most.' },
  { id: 'potential', title: 'You have great potential to crush your goal', subtitle: 'Your transition looks promising.' },
  { id: 'trust', title: 'Thank you for trusting us', subtitle: 'Now let us personalize CaloVic AI for you.' },
  { id: 'apple-health', title: 'Connect to Apple Health', subtitle: 'Sync your activity for better recommendations.' },
  { id: 'burned', title: 'Add calories burned back to your daily goal?', subtitle: 'Running, walking, and workouts included.' },
  { id: 'rollover', title: 'Rollover extra calories to the next day?', subtitle: 'Rollover up to 200 calories.' },
  { id: 'rating', title: 'Give us a rating', subtitle: 'CaloVic AI was made for people like you.' },
  { id: 'referral', title: 'Do you have a referral code?', subtitle: 'You can skip this step.' },
  { id: 'all-done', title: 'Time to generate your custom plan!', subtitle: 'All done!' },
  { id: 'setting-up', title: "We're setting everything up for you", subtitle: 'Finalizing results...' },
  { id: 'plan-ready', title: 'Congratulations your custom plan is ready!', subtitle: 'Let\'s get started.' },
  { id: 'trial-intro', title: 'We want you to try CaloVic AI for free.', subtitle: 'No payment due now.' },
  { id: 'trial-reminder', title: "We'll send you a reminder before your free trial ends", subtitle: 'No payment due now.' },
  { id: 'trial-plan', title: 'Start your 3-day FREE trial to continue.', subtitle: 'Choose your plan.' },
  { id: 'one-time-offer', title: 'One Time Offer', subtitle: 'You will never see this again' },
  { id: 'create-account', title: 'Create an account', subtitle: 'Sign in to continue' },
]

const planReadyIndex = slides.findIndex((slide) => slide.id === 'plan-ready')
const SLIDER_STEP_STORAGE_KEY = 'calovic-slider-step'

function isReloadNavigation() {
  const navEntries = performance.getEntriesByType('navigation')
  if (navEntries.length > 0) return navEntries[0].type === 'reload'
  // Fallback for older browser navigation API
  // eslint-disable-next-line deprecation/deprecation
  return performance.navigation?.type === 1
}

function ChoiceButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border-2 px-3 py-3 text-left text-sm font-semibold transition-colors sm:px-4 sm:py-4 sm:text-base ${
        selected
          ? 'border-black bg-black text-white'
          : 'border-[#E5E5EA] bg-[#F2F2F7] text-[#1C1C25] hover:border-black hover:bg-black hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function Slider({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(() => {
    if (!isReloadNavigation()) return 0
    const savedStep = Number(sessionStorage.getItem(SLIDER_STEP_STORAGE_KEY))
    if (Number.isNaN(savedStep)) return 0
    return Math.min(Math.max(savedStep, 0), slides.length - 1)
  })
  const [selectedGender, setSelectedGender] = useState('')
  const [unitSystem, setUnitSystem] = useState('Imperial')
  const [height, setHeight] = useState(69)
  const [weight, setWeight] = useState(155)
  const [month, setMonth] = useState('January')
  const [day, setDay] = useState('1')
  const [year, setYear] = useState('2024')
  const [selectedGoal, setSelectedGoal] = useState('Gain weight')
  const [desiredWeight, setDesiredWeight] = useState(165)
  const [speed, setSpeed] = useState(1.5)
  const [selectedObstacle, setSelectedObstacle] = useState('Lack of consistency')
  const [selectedDiet, setSelectedDiet] = useState('Classic')
  const [selectedAccomplish, setSelectedAccomplish] = useState('Feel better about my body')
  const [connectChoice, setConnectChoice] = useState('')
  const [burnedChoice, setBurnedChoice] = useState('')
  const [rolloverChoice, setRolloverChoice] = useState('')
  const [rating, setRating] = useState(0)
  const [referralCode, setReferralCode] = useState('')
  const [setupPercent, setSetupPercent] = useState(92)
  const [billingPlan, setBillingPlan] = useState('yearly')
  const hasAutoAdvancedFromSetupRef = useRef(false)

  const step = slides[currentStep]
  const progress = useMemo(() => ((currentStep + 1) / slides.length) * 100, [currentStep])
  const visibleDotCount = 6
  const dotWindowStart = useMemo(() => {
    const maxStart = Math.max(slides.length - visibleDotCount, 0)
    const centeredStart = currentStep - Math.floor(visibleDotCount / 2)
    return Math.min(Math.max(centeredStart, 0), maxStart)
  }, [currentStep])
  const dotWindowEnd = Math.min(dotWindowStart + visibleDotCount, slides.length)
  const dotSizePx = 6
  const dotGapPx = 6
  const dotStepPx = dotSizePx + dotGapPx
  const dotTrackTranslatePx = dotWindowStart * dotStepPx
  const dotViewportWidthPx = (visibleDotCount * dotStepPx) - dotGapPx
  const hasHiddenDotsOnLeft = dotWindowStart > 0
  const hasHiddenDotsOnRight = dotWindowEnd < slides.length

  useEffect(() => {
    sessionStorage.setItem(SLIDER_STEP_STORAGE_KEY, String(currentStep))
  }, [currentStep])

  useEffect(() => {
    if (step.id !== 'setting-up') return

    const timer = setInterval(() => {
      setSetupPercent((prev) => {
        if (prev >= 100) {
          if (hasAutoAdvancedFromSetupRef.current) return 100
          hasAutoAdvancedFromSetupRef.current = true
          clearInterval(timer)
          setCurrentStep(planReadyIndex >= 0 ? planReadyIndex : Math.min(currentStep + 1, slides.length - 1))
          return 100
        }
        return prev + 2
      })
    }, 120)

    return () => clearInterval(timer)
  }, [currentStep, step.id])

  const canProceed = () => {
    if (step.id === 'gender') return Boolean(selectedGender)
    if (step.id === 'goal') return Boolean(selectedGoal)
    if (step.id === 'stopping') return Boolean(selectedObstacle)
    if (step.id === 'diet') return Boolean(selectedDiet)
    if (step.id === 'accomplish') return Boolean(selectedAccomplish)
    if (step.id === 'apple-health') return Boolean(connectChoice)
    if (step.id === 'burned') return Boolean(burnedChoice)
    if (step.id === 'rollover') return Boolean(rolloverChoice)
    if (step.id === 'rating') return rating > 0
    if (step.id === 'setting-up') return false
    return true
  }

  const actionLabel = () => {
    if (step.id === 'trial-intro') return 'Try for $0.00'
    if (step.id === 'trial-reminder') return 'Continue for FREE'
    if (step.id === 'trial-plan') return 'Start My 3-Day Free Trial'
    if (step.id === 'one-time-offer') return 'Claim your limited offer now!'
    return 'Continue'
  }

  const goNext = () => {
    if (!canProceed()) return
    if (currentStep === slides.length - 1) {
      if (typeof onComplete === 'function') onComplete()
      return
    }
    const nextStep = Math.min(currentStep + 1, slides.length - 1)
    if (slides[nextStep].id === 'setting-up') {
      hasAutoAdvancedFromSetupRef.current = false
      setSetupPercent(92)
    }
    setCurrentStep(nextStep)
  }

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const renderContent = () => {
    switch (step.id) {
      case 'gender':
        return (
          <div className="mt-6 space-y-3">
            {['Male', 'Female', 'Other'].map((gender) => (
              <ChoiceButton key={gender} label={gender} selected={selectedGender === gender} onClick={() => setSelectedGender(gender)} />
            ))}
          </div>
        )
      case 'height-weight':
        return (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setUnitSystem('Imperial')}
                className={`rounded-full px-3 py-1 text-sm font-semibold sm:px-4 sm:text-base ${unitSystem === 'Imperial' ? 'bg-black text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}
              >
                Imperial
              </button>
              <button
                onClick={() => setUnitSystem('Metric')}
                className={`rounded-full px-3 py-1 text-sm font-semibold sm:px-4 sm:text-base ${unitSystem === 'Metric' ? 'bg-black text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}
              >
                Metric
              </button>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-[#8E8E93]">
                <span>Height</span>
                <span>{height} {unitSystem === 'Imperial' ? 'in' : 'cm'}</span>
              </div>
              <input type="range" min="55" max="84" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm text-[#8E8E93]">
                <span>Weight</span>
                <span>{weight} {unitSystem === 'Imperial' ? 'lb' : 'kg'}</span>
              </div>
              <input type="range" min="90" max="260" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        )
      case 'birth':
        return (
          <div className="mt-6 grid grid-cols-3 gap-2">
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-xl bg-[#F2F2F7] p-3">
              {['January', 'February', 'March', 'April', 'May', 'June'].map((m) => <option key={m}>{m}</option>)}
            </select>
            <select value={day} onChange={(e) => setDay(e.target.value)} className="rounded-xl bg-[#F2F2F7] p-3">
              {Array.from({ length: 31 }).map((_, i) => <option key={i + 1}>{i + 1}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-xl bg-[#F2F2F7] p-3">
              {['2024', '2023', '2022', '2021', '2020'].map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
        )
      case 'goal':
        return (
          <div className="mt-6 space-y-3">
            {['Lose weight', 'Maintain', 'Gain weight'].map((goal) => (
              <ChoiceButton key={goal} label={goal} selected={selectedGoal === goal} onClick={() => setSelectedGoal(goal)} />
            ))}
          </div>
        )
      case 'desired-weight':
        return (
          <div className="mt-8 text-center">
            <p className="text-lg">{selectedGoal}</p>
            <p className="text-[clamp(2rem,8vw,3rem)] font-bold">{desiredWeight.toFixed(1)} lbs</p>
            <input type="range" min="90" max="260" value={desiredWeight} onChange={(e) => setDesiredWeight(Number(e.target.value))} className="mt-8 w-full" />
          </div>
        )
      case 'realistic':
        return (
          <div className="mt-12 text-center">
            <p className="text-[clamp(1.75rem,6vw,3rem)] font-bold leading-tight">Gaining <span className="text-[#D2915D]">10 lbs</span> is a realistic target.</p>
            <p className="mt-5 text-lg text-[#4A4A55]">90% of users say this change is obvious and sustainable.</p>
          </div>
        )
      case 'speed':
        return (
          <div className="mt-8 text-center">
            <p className="text-lg text-[#4A4A55]">Gain weight speed per week</p>
            <p className="mt-2 text-[clamp(2rem,8vw,3rem)] font-bold">{speed.toFixed(1)} lbs</p>
            <input type="range" min="0.2" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="mt-8 w-full" />
            <div className="mt-2 flex justify-between text-sm text-[#4A4A55]"><span>0.2 lbs</span><span>1.5 lbs</span><span>3.0 lbs</span></div>
            <div className="mt-6 rounded-xl bg-[#F2F2F7] py-2 font-medium">Recommended</div>
          </div>
        )
      case 'comparison':
        return (
          <div className="mt-8 rounded-2xl bg-[#F2F2F7] p-6 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Without CaloVic AI</p>
                <div className="mt-4 h-20 rounded-xl bg-white" />
                <p className="mt-2 text-2xl font-bold">20%</p>
              </div>
              <div>
                <p className="font-semibold">With CaloVic AI</p>
                <div className="mt-4 h-36 rounded-xl bg-black" />
                <p className="mt-2 text-2xl font-bold text-black">2X</p>
              </div>
            </div>
            <p className="mt-6 text-[#4A4A55]">CaloVic AI makes it easy and holds you accountable.</p>
          </div>
        )
      case 'stopping':
        return (
          <div className="mt-6 space-y-3">
            {['Lack of consistency', 'Unhealthy eating habits', 'Lack of support', 'Busy schedule', 'Lack of meal inspiration'].map((item) => (
              <ChoiceButton key={item} label={item} selected={selectedObstacle === item} onClick={() => setSelectedObstacle(item)} />
            ))}
          </div>
        )
      case 'diet':
        return (
          <div className="mt-6 space-y-3">
            {['Classic', 'Pescatarian', 'Vegetarian', 'Vegan'].map((item) => (
              <ChoiceButton key={item} label={item} selected={selectedDiet === item} onClick={() => setSelectedDiet(item)} />
            ))}
          </div>
        )
      case 'accomplish':
        return (
          <div className="mt-6 space-y-3">
            {['Eat and live healthier', 'Boost my energy and mood', 'Stay motivated and consistent', 'Feel better about my body'].map((item) => (
              <ChoiceButton key={item} label={item} selected={selectedAccomplish === item} onClick={() => setSelectedAccomplish(item)} />
            ))}
          </div>
        )
      case 'potential':
        return (
          <div className="mt-8 rounded-2xl bg-[#F2F2F7] p-5">
            <p className="text-[clamp(1.25rem,4vw,1.875rem)] font-bold">Your weight transition</p>
            <div className="mt-8 h-36 rounded-xl bg-white p-3">
              <div className="h-[2px] w-full bg-[#D8D8DE]" />
              <div className="mt-8 h-[2px] w-full bg-[#D8D8DE]" />
              <div className="mt-8 h-[2px] w-full bg-[#D8D8DE]" />
            </div>
            <p className="mt-6 text-sm text-[#4A4A55]">Based on historical data, progress accelerates after week one.</p>
          </div>
        )
      case 'trust':
        return (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-blue-100 text-4xl sm:h-40 sm:w-40 sm:text-5xl">🤝</div>
            <p className="mt-6 text-[clamp(1.5rem,5vw,2.25rem)] font-bold">Thank you for trusting us</p>
            <div className="mt-6 rounded-xl bg-[#F2F2F7] p-4 text-sm text-[#4A4A55]">Your privacy and security matter to us.</div>
          </div>
        )
      case 'apple-health':
        return (
          <div className="mt-10 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#F2F2F7] text-4xl sm:h-40 sm:w-40 sm:text-5xl">🍎</div>
            <p className="mt-6 text-[clamp(1.5rem,5vw,2.25rem)] font-bold">Connect to Apple Health</p>
            <p className="mt-3 text-[#4A4A55]">Sync your daily activity for better recommendations.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConnectChoice('not-now')} className={`flex-1 rounded-full py-3 font-semibold ${connectChoice === 'not-now' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>Not now</button>
              <button onClick={() => setConnectChoice('continue')} className={`flex-1 rounded-full py-3 font-semibold ${connectChoice === 'continue' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>Continue</button>
            </div>
          </div>
        )
      case 'burned':
        return (
          <div className="mt-8">
            <div className="rounded-2xl bg-[#F2F2F7] p-4 text-center">Today's Goal: <span className="font-bold">500 Cals</span> + Running <span className="font-bold">100</span></div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setBurnedChoice('no')} className={`flex-1 rounded-full py-3 font-semibold ${burnedChoice === 'no' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>No</button>
              <button onClick={() => setBurnedChoice('yes')} className={`flex-1 rounded-full py-3 font-semibold ${burnedChoice === 'yes' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>Yes</button>
            </div>
          </div>
        )
      case 'rollover':
        return (
          <div className="mt-8">
            <div className="rounded-2xl bg-[#F2F2F7] p-4 text-center">Rollover up to <span className="font-bold text-[#5B8DD8]">200 cals</span></div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setRolloverChoice('no')} className={`flex-1 rounded-full py-3 font-semibold ${rolloverChoice === 'no' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>No</button>
              <button onClick={() => setRolloverChoice('yes')} className={`flex-1 rounded-full py-3 font-semibold ${rolloverChoice === 'yes' ? 'bg-black text-white' : 'bg-[#F2F2F7]'}`}>Yes</button>
            </div>
          </div>
        )
      case 'rating':
        return (
          <div className="mt-8">
            <div className="rounded-2xl border border-[#E5E5EA] p-5 text-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="px-1 text-3xl sm:text-4xl">
                  {rating >= star ? '⭐' : '☆'}
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-[#8A8A93] p-4 text-white">
              <p className="font-semibold">"I lost 15 lbs in 2 months!"</p>
              <p className="mt-2 text-sm">Marley Bryle • 5.0</p>
            </div>
          </div>
        )
      case 'referral':
        return (
          <div className="mt-8">
            <input
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Referral Code"
              className="w-full rounded-xl bg-[#F2F2F7] px-4 py-4 outline-none"
            />
          </div>
        )
      case 'all-done':
        return (
          <div className="mt-12 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-blue-100 text-4xl sm:h-40 sm:w-40 sm:text-5xl">🫶</div>
            <p className="mt-6 text-[clamp(1.75rem,6vw,3rem)] font-bold">Time to generate your custom plan!</p>
          </div>
        )
      case 'setting-up':
        return (
          <div className="mt-12 text-center">
            <p className="text-[clamp(2.75rem,12vw,5rem)] font-bold">{setupPercent}%</p>
            <p className="mt-4 text-[clamp(1.5rem,6vw,3rem)] font-bold leading-tight">We're setting everything up for you</p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#D9D9D9]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#E06B6B] via-[#A58AC6] to-[#5B8DD8] transition-all" style={{ width: `${setupPercent}%` }} />
            </div>
            <p className="mt-4 text-[clamp(1rem,3vw,1.5rem)] text-[#4A4A55]">Finalizing results...</p>
            <div className="mt-8 rounded-3xl bg-black p-5 text-left text-white">
              <p className="text-lg sm:text-2xl">Daily recommendation for</p>
              <ul className="mt-2 space-y-1 text-xl sm:text-3xl">
                <li>• Calories</li>
                <li>• Carbs</li>
                <li>• Protein</li>
                <li>• Fats</li>
                <li>• Health Score</li>
              </ul>
            </div>
          </div>
        )
      case 'plan-ready':
        return (
          <div className="mt-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white sm:h-14 sm:w-14 sm:text-3xl">✓</div>
            <p className="text-center text-[clamp(1.5rem,6vw,3rem)] font-bold leading-tight">Congratulations your custom plan is ready!</p>
            <p className="mt-6 text-center text-[clamp(1.25rem,4vw,2.25rem)] font-semibold">You should gain:</p>
            <div className="mx-auto mt-3 w-fit rounded-full bg-[#F2F2F7] px-5 py-2 text-[clamp(1rem,3.5vw,1.875rem)]">10 lbs by September 28</div>
            <div className="mt-6 rounded-2xl bg-[#F2F2F7] p-4">
              <p className="text-[clamp(1.25rem,4vw,1.875rem)] font-bold">Daily recommendation</p>
              <p className="text-sm text-[#8E8E93] sm:text-xl">You can edit this anytime</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ['Calories', '2465'],
                  ['Carbs', '295g'],
                  ['Protein', '166g'],
                  ['Fats', '68g'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-white p-3">
                    <p className="font-semibold">{label}</p>
                    <p className="mt-2 text-[clamp(1.25rem,4vw,1.875rem)] font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'trial-intro':
        return (
          <div className="mt-6 text-center">
            <div className="mx-auto h-64 w-48 rounded-[26px] border-8 border-black bg-gradient-to-b from-[#2f2f35] to-[#111114] p-3 text-left text-white sm:h-72 sm:w-56 sm:rounded-[30px]">
              <div className="h-full w-full rounded-2xl border border-white/20 bg-[url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=687&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
            <p className="mt-5 text-[clamp(1.125rem,3.2vw,1.5rem)] font-semibold">✓ No Payment Due Now</p>
            <p className="mt-4 text-sm text-[#4A4A55] sm:text-lg">Just HK$228.00 per year (HK$19.00/mo)</p>
          </div>
        )
      case 'trial-reminder':
        return (
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#EFF3F3] text-5xl sm:h-44 sm:w-44 sm:text-7xl">🔔</div>
            <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E53935] text-2xl font-bold text-white sm:h-14 sm:w-14 sm:text-4xl">1</div>
            <p className="mt-5 text-[clamp(1.125rem,3.2vw,1.5rem)] font-semibold">✓ No Payment Due Now</p>
            <p className="mt-4 text-sm text-[#4A4A55] sm:text-lg">Just HK$228.00 per year (HK$19.00/mo)</p>
          </div>
        )
      case 'trial-plan':
        return (
          <div className="mt-6">
            <div className="space-y-5 rounded-2xl bg-[#F7F7FA] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-2xl">🔒</div>
                <div>
                  <p className="text-lg font-semibold sm:text-2xl">Today</p>
                  <p className="text-sm text-[#6A6A73] sm:text-lg">Unlock all the app features like AI calorie scanning and more.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-2xl">🔔</div>
                <div>
                  <p className="text-lg font-semibold sm:text-2xl">In 2 Days - Reminder</p>
                  <p className="text-sm text-[#6A6A73] sm:text-lg">We'll send a reminder that your trial is ending soon.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 text-2xl">👑</div>
                <div>
                  <p className="text-lg font-semibold sm:text-2xl">In 3 Days - Billing Starts</p>
                  <p className="text-sm text-[#6A6A73] sm:text-lg">You'll be charged unless you cancel before.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setBillingPlan('monthly')}
                className={`rounded-2xl border-2 p-4 text-left ${billingPlan === 'monthly' ? 'border-black bg-black text-white' : 'border-[#D5D5DC] bg-white'}`}
              >
                <p className="text-base font-semibold sm:text-xl">Monthly</p>
                <p className="text-lg font-bold sm:text-2xl">HK$88.00/mo</p>
              </button>
              <button
                onClick={() => setBillingPlan('yearly')}
                className={`rounded-2xl border-2 p-4 text-left ${billingPlan === 'yearly' ? 'border-black bg-black text-white' : 'border-[#D5D5DC] bg-white'}`}
              >
                <p className="text-base font-semibold sm:text-xl">Yearly</p>
                <p className="text-lg font-bold sm:text-2xl">HK$19.00/mo</p>
              </button>
            </div>
            <p className="mt-4 text-center text-[clamp(1.125rem,3.2vw,1.5rem)] font-semibold">✓ No Payment Due Now</p>
            <p className="mt-3 text-center text-sm text-[#4A4A55] sm:text-lg">3 days free, then HK$228.00 per year</p>
          </div>
        )
      case 'one-time-offer':
        return (
          <div className="mt-8 text-center">
            <div className="mx-auto rounded-3xl bg-[#F2F2F7] p-6">
              <p className="text-[clamp(1.125rem,3.2vw,1.5rem)]">Here's a <span className="rounded-full bg-[#1C1B2A] px-3 py-1 text-white">80% off</span> discount</p>
              <div className="mt-5 rounded-2xl bg-white py-4 text-[clamp(1.5rem,5vw,3rem)] font-bold">Only $1.66 / month</div>
              <p className="mt-3 text-sm text-[#6A6A73] sm:text-lg">Lowest price ever</p>
            </div>
          </div>
        )
      case 'create-account':
        return (
          <div className="mt-14 space-y-4 sm:mt-20 sm:space-y-6">
            <button className="w-full rounded-full bg-black py-4 text-[clamp(1.125rem,3.3vw,2.25rem)] font-semibold text-white sm:py-5"> Sign in with Apple</button>
            <button className="w-full rounded-full border-2 border-black py-4 text-[clamp(1.125rem,3.3vw,2.25rem)] font-semibold sm:py-5">G Sign in with Google</button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-[#ECECF1] bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[clamp(320px,92vw,760px)] px-3 py-4 sm:px-5 lg:px-8 2xl:max-w-[900px]">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={goBack}
              disabled={currentStep === 0}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#F2F2F7] text-lg disabled:opacity-50 sm:h-10 sm:w-10 sm:text-xl"
            >
              ←
            </button>
            <div className="h-1 flex-1 rounded-full bg-[#E6E6EB]">
              <div className="h-full rounded-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h1 className="text-[clamp(1.6rem,6vw,3rem)] font-bold leading-tight text-[#1C1C25]">{step.title}</h1>
          <p className="mt-2 text-[clamp(0.95rem,2.4vw,1.25rem)] text-[#4A4A55]">{step.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-[clamp(320px,92vw,760px)] flex-col px-3 pb-[170px] pt-[180px] sm:px-5 sm:pb-[185px] sm:pt-[195px] lg:px-8 lg:pt-[230px] 2xl:max-w-[900px]">
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[680px]">
            {renderContent()}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#ECECF1] bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[clamp(320px,92vw,760px)] px-3 py-3 sm:px-5 sm:py-4 lg:px-8 2xl:max-w-[900px]">
          <div className="relative mx-auto mb-3 w-fit">
            <div className="overflow-hidden px-3" style={{ width: `${dotViewportWidthPx}px` }}>
              <div
                className="flex items-center gap-1.5 transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${dotTrackTranslatePx}px)` }}
              >
                {slides.map((slide, index) => (
                  <span key={slide.id} className={`h-1.5 w-1.5 shrink-0 rounded-full ${index === currentStep ? 'bg-black' : 'bg-[#D6D6DC]'}`} />
                ))}
              </div>
            </div>
            {hasHiddenDotsOnLeft && (
              <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white/95 to-transparent" />
            )}
            {hasHiddenDotsOnRight && (
              <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white/95 to-transparent" />
            )}
          </div>

          <button
            onClick={goNext}
            disabled={!canProceed() || step.id === 'setting-up'}
            className="h-12 w-full rounded-full bg-[#1C1B2A] text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:text-xl"
          >
            {actionLabel()}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Slider
