import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import PaymentModal from '@/components/PaymentModal'

const PLANS = [
  {
    id: 'free',
    tierKey: 'freePlan',
    priceKey: 'freePrice',
    period: '',
    subLabelKey: 'essentialElements',
    features: ['closetLimit15', 'dailyOneSet', 'lookbook5', 'askAi'],
    buttonTextKey: 'currentPlan',
    isCurrent: true,
    highlight: false,
    icon: 'check_circle',
  },
  {
    id: 'monthly',
    tierKey: 'monthlyPlan',
    priceKey: 'monthlyPrice',
    period: 'perMonth',
    subLabelKey: 'boundlessStyle',
    features: ['closetUnlimited', 'dailyThree', 'lookbookUnlimited', 'askAi'],
    buttonTextKey: 'upgradeMonthly',
    isCurrent: false,
    highlight: true,
    popularKey: 'mostPopular',
    icon: 'stars',
  },
  {
    id: 'yearly',
    tierKey: 'yearlyPlan',
    priceKey: 'yearlyPrice',
    period: 'perYear',
    approxKey: 'approxMonthly',
    subLabelKey: 'annualCommitment',
    features: ['closetUnlimited', 'dailyThree', 'lookbookUnlimited', 'askAi'],
    buttonTextKey: 'upgradeAnnually',
    isCurrent: false,
    highlight: false,
    saveKey: 'savePercent',
    icon: 'verified',
  },
]

export default function MembershipPage() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const [showPayment, setShowPayment] = useState(false)

  const isEn = i18n.language === 'en'

  return (
    <div className="min-h-screen text-on-surface">
      {/* Abstract Background Elements */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-secondary-fixed/20 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3 mix-blend-multiply pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-tertiary-fixed/30 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4 mix-blend-multiply pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col">
        {/* Editorial Header */}
        <header className="mb-16 md:mb-24 max-w-3xl relative">
          <h1 className="font-headline text-5xl md:text-7xl text-primary font-medium tracking-tight leading-tight mb-6 relative">
            {t('membership.title')}
            <span className="absolute -top-4 -left-4 text-secondary/30 material-symbols-outlined !text-6xl fill pointer-events-none select-none">
              star
            </span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant font-light leading-relaxed">
            {t('membership.subtitle')}
          </p>
        </header>

        {/* Pricing Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 z-10 mb-24">
          {PLANS.map((plan) => {
            const isHighlighted = plan.highlight
            return (
              <div
                key={plan.id}
                className={`rounded-[2rem] p-8 md:p-10 shadow-tonal relative overflow-hidden flex flex-col transition-all ${
                  isHighlighted
                    ? 'bg-secondary/5 transform md:-translate-y-4 ring-2 ring-secondary/20'
                    : 'bg-surface-container-lowest opacity-90 hover:opacity-100 border border-outline-variant/10'
                }`}
              >
                {/* Ambient glow for highlighted card */}
                {isHighlighted && (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary-fixed/20 to-transparent pointer-events-none" />
                )}

                <div className={`mb-8 ${isHighlighted ? 'relative z-10' : ''}`}>
                  <div className="flex justify-between items-start">
                    <h2 className={`font-headline ${isHighlighted ? 'text-3xl text-secondary' : 'text-2xl text-on-surface'} font-medium mb-2`}>
                      {t(`membership.${plan.tierKey}`)}
                      {!isEn && plan.id !== 'free' && (
                        <span className="text-on-surface-variant text-lg font-normal">
                          {plan.id === 'monthly' ? '(月订)' : '(年订)'}
                        </span>
                      )}
                    </h2>
                    {plan.popularKey && (
                      <span className="font-label text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm" style={{ backgroundColor: '#FFD54F', color: '#1C1C18' }}>
                        {t(`membership.${plan.popularKey}`)}
                      </span>
                    )}
                    {plan.saveKey && (
                      <span className="bg-primary text-on-primary font-label text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {t(`membership.${plan.saveKey}`)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mt-6 mb-2">
                    <span className="font-headline text-5xl text-on-surface font-medium">{t(`membership.${plan.priceKey}`)}</span>
                    {plan.period && (
                      <span className="font-label text-on-surface-variant text-sm uppercase tracking-wide">
                        {t(`membership.${plan.period}`)}
                      </span>
                    )}
                  </div>

                  {plan.approxKey && (
                    <p className="font-label text-xs text-on-surface-variant tracking-wider mt-1 mb-3">
                      {t(`membership.${plan.approxKey}`)}
                    </p>
                  )}

                  <p className={`font-label uppercase tracking-widest mt-4 pb-6 border-b ${
                    isHighlighted ? 'text-secondary text-sm border-secondary/20' : 'text-on-surface-variant text-sm border-outline-variant/15'
                  }`}>
                    {t(`membership.${plan.subLabelKey}`)}
                  </p>
                </div>

                {/* Features List */}
                <ul className={`flex flex-col gap-5 flex-grow mb-10 ${isHighlighted ? 'relative z-10' : ''}`}>
                  {[
                    { label: t('membership.closetLimit'), value: t(`membership.${plan.features[0]}`) },
                    { label: t('membership.dailyRecommendations'), value: t(`membership.${plan.features[1]}`) },
                    { label: t('membership.lookbookSaves'), value: t(`membership.${plan.features[2]}`) },
                    { label: t('membership.askAi'), value: t(`membership.${plan.features[3]}`) },
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className={`material-symbols-outlined mt-0.5 text-xl ${
                        isHighlighted ? 'text-secondary fill' : plan.id === 'yearly' ? 'text-primary fill' : 'text-primary/60'
                      }`}>
                        {plan.icon}
                      </span>
                      <div className="font-body text-[15px]">
                        {feat.label}{' '}
                        <span className={
                          isHighlighted ? 'font-bold text-secondary' :
                          plan.id === 'yearly' ? 'font-bold text-primary' :
                          'font-medium text-on-surface-variant'
                        }>
                          {feat.value}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    if (!user?.isPro && plan.id !== 'free') setShowPayment(true)
                  }}
                  className={`w-full py-4 rounded-full font-label font-medium tracking-wide shadow-tonal hover:opacity-90 transition-opacity mt-auto ${
                    isHighlighted
                      ? 'text-lg z-10 relative'
                      : plan.id === 'free'
                        ? 'border border-outline-variant text-on-surface-variant hover:bg-surface-variant/50'
                        : 'bg-primary text-white'
                  }`}
                  style={isHighlighted ? { backgroundColor: '#FFD54F', color: '#1C1C18', boxShadow: '0 4px 12px rgba(255, 213, 79, 0.3)' } : undefined}
                >
                  {t(`membership.${plan.buttonTextKey}`)}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer Quote */}
        <footer className="mt-auto pt-16 flex flex-col items-center text-center pb-8">
          <span className="material-symbols-outlined text-primary/20 text-4xl mb-4">format_quote</span>
          <p className="font-headline text-2xl md:text-3xl text-on-surface italic font-light max-w-2xl leading-relaxed">
            {t('membership.quote')}
          </p>
          <div className="mt-6 w-12 h-[1px] bg-outline-variant/40" />
          <p className="mt-8 font-body text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/50 max-w-lg">
            {t('membership.disclaimer')}
          </p>
        </footer>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  )
}
