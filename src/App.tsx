import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  const [initialized, setInitialized] = useState(false)

  // 初始化 Firebase 认证状态
  useEffect(() => {
    console.log('[App] 初始化认证监听...')
    
    // 监听 Firebase 认证状态变化
    const unsubscribe = onAuthChange((user) => {
      console.log('[App] 认证状态变化:', user ? `用户 ${user.email}` : '未登录')
      
      if (user) {
        // 获取当前已有的用户数据，避免覆盖用户的个性化设置
        const currentUser = useAuthStore.getState().user
        
        // 只有在用户不存在时才创建新用户（首次登录）
        if (!currentUser || currentUser.id !== user.uid) {
          login(
            {
              id: user.uid,
              name: user.displayName || 'OOTD用户',
              email: user.email || '',
              avatar: user.photoURL || '',
              city: '上海',
              zodiac: '天秤座',
              style: [],
              isPro: false,
              createdAt: new Date().toISOString(),
            },
            ''
          )
        }
      }
      setInitialized(true)
    })

    return () => {
      console.log('[App] 清理认证监听')
      unsubscribe()
    }
  }, [login])

  console.log('[App] 渲染状态:', { initialized, isAuthenticated })

  // 等待初始化完成
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
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