import { useState, useEffect, createContext, useContext, useCallback } from 'react'

interface ToastContextType {
  showToast: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  })

  const showToast = useCallback((message: string, duration = 1000) => {
    setToast({ message, visible: true })
    
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-toast-in">
          <div className="bg-on-surface text-surface px-6 py-3 rounded-xl font-label text-sm shadow-lg shadow-on-surface/20">
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}
