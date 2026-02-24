import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Starting from './components/common/Starting'
import Landing from './components/common/Landing'
import Slider from './components/common/Slider'
import Home from './components/Page/Home'
import Progress from './components/Page/Progress'
import Add from './components/Page/Add'
import AI from './components/Page/AI'
import Settings from './components/Page/Settings'

function AppRoutes() {
  const navigate = useNavigate()

  const navigateToPath = (path) => navigate(path)

  const handleTabNavigation = (tab) => {
    if (tab === 'Home') navigate('/home')
    if (tab === 'Progress') navigate('/progress')
    if (tab === 'Add') navigate('/add')
    if (tab === 'AI') navigate('/ai')
    if (tab === 'Settings') navigate('/settings')
  }

  return (
    <Routes>
      <Route path="/" element={<Starting onGetStarted={() => navigateToPath('/landing')} />} />
      <Route path="/landing" element={<Landing onGetStarted={() => navigateToPath('/slider')} />} />
      <Route path="/slider" element={<Slider onComplete={() => navigateToPath('/home')} />} />
      <Route path="/home" element={<Home onNavigate={handleTabNavigation} />} />
      <Route path="/progress" element={<Progress onNavigate={handleTabNavigation} />} />
      <Route path="/add" element={<Add onNavigate={handleTabNavigation} />} />
      <Route path="/ai" element={<AI onNavigate={handleTabNavigation} />} />
      <Route path="/settings" element={<Settings onNavigate={handleTabNavigation} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return <AppRoutes />
}

export default App
