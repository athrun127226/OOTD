/// <reference types="vite/client" />

// 扩展 ImportMeta 接口
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_PAYPAL_CLIENT_ID: string
}

// 使用类型合并而不是覆盖
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}