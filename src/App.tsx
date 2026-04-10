import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import { onAuthChange, handleRedirectResult } from '@/services/firebaseAuth'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage'
import WardrobePage from '@/pages/WardrobePage'
import ProfilePage from '@/pages/ProfilePage'
import BottomNav from '@/components/layout/BottomNav'

function AppContent() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const [initialized, setInitialized] = useState(false)

  // 初始化 Firebase 认证状态
  useEffect(() => {
    const initAuth = async () => {
      // 先处理重定向结果
      try {
        const result = await handleRedirectResult()
        if (result) {
          const { user, token } = result
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
            token
          )
        }
      } catch (err) {
        console.error('处理重定向结果失败:', err)
      }

      // 监听后续认证状态变化
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
            ''
          )
        }
      })

      setInitialized(true)
      return unsubscribe
    }

    const unsubscribe = initAuth()
    return () => {
      unsubscribe.then((unsub) => unsub?.())
    }
  }, [login])

  // 等待初始化完成
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

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