import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  signInWithPopup,
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

console.log('[Firebase] 配置检查:', {
  hasApiKey: !!firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
})

// 初始化 Firebase（如果已配置）
let app: ReturnType<typeof initializeApp> | null = null
let auth: ReturnType<typeof getAuth> | null = null

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    console.log('[Firebase] 初始化成功')
  } else {
    console.warn('[Firebase] 未配置 API Key')
  }
} catch (error) {
  console.error('[Firebase] 初始化失败:', error)
}

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

/** Google 登录（使用弹窗方式） */
export async function signInWithGoogle(): Promise<{ user: User; token: string }> {
  if (!auth) {
    throw new Error('Firebase 未配置，请先在 Firebase Console 中设置项目配置')
  }

  console.log('[Firebase] 开始弹窗登录...')
  const result = await signInWithPopup(auth, googleProvider)
  console.log('[Firebase] 弹窗登录成功:', result.user.email)
  
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
    console.warn('[Firebase] auth 未初始化，返回空监听函数')
    // 立即调用回调，表示未登录
    setTimeout(() => callback(null), 0)
    return () => {}
  }
  
  console.log('[Firebase] 设置认证状态监听')
  return onAuthStateChanged(auth, callback)
}

/** 检查 Firebase 是否已配置 */
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey
}

export type { User }