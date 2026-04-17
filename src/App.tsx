import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import './i18n' // 导入 i18n 配置
import { useAuthStore } from '@/store'
import { onAuthChange } from '@/services/firebaseAuth'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage'
import WardrobePage from '@/pages/WardrobePage'
import ProfilePage from '@/pages/ProfilePage'
import LookbookPage from '@/pages/LookbookPage'
import MembershipPage from '@/pages/MembershipPage'
import SideNav from '@/components/layout/SideNav'
import TopNavBar from '@/components/layout/TopNavBar'

function AppContent() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const [initialized, setInitialized] = useState(false)

  // 初始化 Firebase 认证状态
  useEffect(() => {
    console.log('[App] 初始化认证监听...')
    
    // 检查 Firebase 是否已配置
    const isFirebaseReady = import.meta.env.VITE_FIREBASE_API_KEY
    
    if (!isFirebaseReady) {
      // Firebase 未配置，自动登录一个模拟用户
      console.log('[App] Firebase 未配置，使用模拟用户')
      login(
        {
          id: 'demo-user',
          name: '时尚达人',
          email: 'demo@example.com',
          avatar: '',
          city: '上海',
          zodiac: '天秤座',
          style: [],
          isPro: false,
          createdAt: new Date().toISOString(),
        },
        ''
      )
      setInitialized(true)
      return
    }
    
    // 设置超时，防止 Firebase 初始化卡住
    const timeout = setTimeout(() => {
      console.log('[App] Firebase 初始化超时，使用模拟用户')
      if (!useAuthStore.getState().isAuthenticated) {
        login(
          {
            id: 'demo-user',
            name: '时尚达人',
            email: 'demo@example.com',
            avatar: '',
            city: '上海',
            zodiac: '天秤座',
            style: [],
            isPro: false,
            createdAt: new Date().toISOString(),
          },
          ''
        )
      }
      setInitialized(true)
    }, 5000) // 5秒超时
    
    try {
      // 监听 Firebase 认证状态变化
      const unsubscribe = onAuthChange((user) => {
        console.log('[App] 认证状态变化:', user ? `用户 ${user.email}` : '未登录')
        
        clearTimeout(timeout) // 清除超时
        
        if (user) {
          // 获取当前已有的用户数据
          const currentUser = useAuthStore.getState().user
          const updateProfile = useAuthStore.getState().updateProfile
          
          if (!currentUser || currentUser.id !== user.uid) {
            // 首次登录：创建新用户
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
          } else if (!currentUser.createdAt) {
            // 旧用户缺少注册时间：补充注册时间
            updateProfile({ createdAt: new Date().toISOString() })
          }
        }
        setInitialized(true)
      })

      return () => {
        console.log('[App] 清理认证监听')
        clearTimeout(timeout)
        unsubscribe()
      }
    } catch (error) {
      console.error('[App] Firebase 初始化错误:', error)
      clearTimeout(timeout)
      // Firebase 出错，使用模拟用户
      login(
        {
          id: 'demo-user',
          name: '时尚达人',
          email: 'demo@example.com',
          avatar: '',
          city: '上海',
          zodiac: '天秤座',
          style: [],
          isPro: false,
          createdAt: new Date().toISOString(),
        },
        ''
      )
      setInitialized(true)
      return
    }
  }, [login])

  console.log('[App] 渲染状态:', { initialized, isAuthenticated })

  // 等待初始化完成
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf9f2]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#4d6328] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500 font-label">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  // 判断当前路由是否使用 TopAppBar 模式（Wardrobe / AskAI）
  // Profile / Lookbook / Membership 使用 SideNav 左侧边栏模式
  const useTopNav = location.pathname === '/wardrobe' || location.pathname === '/'

  return (
    <div className="relative min-h-screen bg-[#fcf9f2]">
      {/* 条件导航：TopNavBar 或 SideNav */}
      {useTopNav ? <TopNavBar /> : <SideNav />}
      
      {/* 主内容区域 */}
      <main className={useTopNav ? 'min-h-screen' : 'md:ml-72 min-h-screen'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/lookbook" element={<LookbookPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''
  
  // Debug: 检查 Client ID 是否正确加载
  console.log('[App] PayPal Client ID:', paypalClientId ? '已加载' : '未加载')
  
  // 如果没有配置 PayPal，直接渲染应用（不包装 PayPalScriptProvider）
  if (!paypalClientId) {
    console.log('[App] PayPal 未配置，跳过 PayPalScriptProvider')
    return (
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    )
  }
  
  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PayPalScriptProvider>
  )
}