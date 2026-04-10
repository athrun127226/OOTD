import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@/store'
import { onAuthChange } from '@/services/firebaseAuth'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage'
import WardrobePage from '@/pages/WardrobePage'
import ProfilePage from '@/pages/ProfilePage'
import BottomNav from '@/components/layout/BottomNav'

function AppContent() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)

  // 监听 Firebase 认证状态变化
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        login(
          {
            id: user.uid,
            name: user.displayName || 'OOTD用户',
            email: user.email || '',
            avatar: user.photoURL || '',
            city: '北京市',
            zodiac: '双子座',
            style: [],
            isPro: false,
          },
          '' // Firebase 用户不需要 token
        )
      }
    })
    return () => unsubscribe()
  }, [login])

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