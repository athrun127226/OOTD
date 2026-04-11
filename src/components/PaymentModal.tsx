import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import PayPalButton from './PayPalButton'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const { t } = useTranslation()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{t('payment.title')}</h2>
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
            <div className="text-2xl font-bold text-primary">$1.50</div>
            <div className="text-sm text-muted-foreground">
              {t('payment.monthlyDesc')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('payment.monthly')}
            </div>
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
              {t('payment.savePercent')}
            </span>
            <div className="text-2xl font-bold text-primary">$12</div>
            <div className="text-sm text-muted-foreground">
              {t('payment.yearlyDesc')}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {t('payment.yearly')}
            </div>
          </button>
        </div>

        {/* Features */}
        <div className="bg-muted/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium mb-2">{t('profile.proFeatures.title')}</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✓ {t('profile.proFeatures.unlimited')}</li>
            <li>✓ {t('profile.proFeatures.dailyUnlimited')}</li>
            <li>✓ {t('profile.proFeatures.aiCutout')}</li>
            <li>✓ {t('profile.proFeatures.styleCustomize')}</li>
            <li>✓ {t('profile.proFeatures.noWatermark')}</li>
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
          {t('payment.terms')}
        </p>
      </div>
    </div>
  )
}