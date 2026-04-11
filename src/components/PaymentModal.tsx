import { useState } from 'react'
import { X } from 'lucide-react'
import PayPalButton from './PayPalButton'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">升级 Pro 会员</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-2xl border-2 transition-all ${
              selectedPlan === 'monthly'
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-muted hover:border-muted/80'
            }`}
          >
            <div className="text-2xl font-bold text-primary">¥9.9</div>
            <div className="text-sm text-muted-foreground">/月</div>
            <div className="text-xs text-muted-foreground mt-1">月度订阅</div>
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`p-4 rounded-2xl border-2 transition-all relative ${
              selectedPlan === 'yearly'
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-muted hover:border-muted/80'
            }`}
          >
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
              省 ¥30
            </span>
            <div className="text-2xl font-bold text-primary">¥88</div>
            <div className="text-sm text-muted-foreground">/年</div>
            <div className="text-xs text-muted-foreground mt-1">年度订阅</div>
          </button>
        </div>

        {/* Features */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium mb-2">Pro 会员权益：</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✓ 无限衣橱容量</li>
            <li>✓ 每日无限次生成</li>
            <li>✓ AI智能抠图</li>
            <li>✓ 穿搭风格定制</li>
            <li>✓ 无水印分享海报</li>
          </ul>
        </div>

        {/* PayPal Button */}
        <div className="mb-4">
          <PayPalButton 
            plan={selectedPlan} 
            onSuccess={onClose}
          />
        </div>

        <p className="text-xs text-center text-muted-foreground">
          支付即表示同意我们的服务条款，可随时取消订阅
        </p>
      </div>
    </div>
  )
}