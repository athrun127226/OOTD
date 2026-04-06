import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/store'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage'
import WardrobePage from '@/pages/WardrobePage'
import ProfilePage from '@/pages/ProfilePage'
import BottomNav from '@/components/layout/BottomNav'

function AppContent() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
