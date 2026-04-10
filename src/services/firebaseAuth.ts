import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { getAuth } from 'firebase/auth'

// Firebase 配置 - 请在 Firebase Console 中获取并填入
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// 初始化 Firebase（如果已配置）
let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
  }
} catch (error) {
  console.warn('Firebase 未配置，将使用演示模式')
}

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

/** Google 登录（使用重定向方式，避免弹窗被拦截） */
export async function signInWithGoogle(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase 未配置，请先在 Firebase Console 中设置项目配置')
  }

  // 使用重定向方式登录，不会被浏览器拦截
  await signInWithRedirect(auth, googleProvider)
}

/** 处理重定向登录结果（在页面加载时调用） */
export async function handleRedirectResult(): Promise<{ user: User; token: string } | null> {
  if (!auth) return null

  const result = await getRedirectResult(auth)
  if (!result) return null

  const credential = GoogleAuthProvider.credentialFromResult(result)
  const token = credential?.idToken || ''

  return { user: result.user, token }
}

/** 登出 */
export async function logout(): Promise<void> {
  if (!auth) return
  await signOut(auth)
}

/** 监听认证状态变化 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    // 演示模式：无 Firebase，返回空函数
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

/** 检查 Firebase 是否已配置 */
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey
}

export type { User }
