import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/PaymentModal'
import type { ZodiacSign } from '@/types'

const ZODIACS_ZH: ZodiacSign[] = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座',
]

const zodiacTranslations: Record<ZodiacSign, { zh: string; en: string }> = {
  '白羊座': { zh: '白羊座', en: 'Aries' },
  '金牛座': { zh: '金牛座', en: 'Taurus' },
  '双子座': { zh: '双子座', en: 'Gemini' },
  '巨蟹座': { zh: '巨蟹座', en: 'Cancer' },
  '狮子座': { zh: '狮子座', en: 'Leo' },
  '处女座': { zh: '处女座', en: 'Virgo' },
  '天秤座': { zh: '天秤座', en: 'Libra' },
  '天蝎座': { zh: '天蝎座', en: 'Scorpio' },
  '射手座': { zh: '射手座', en: 'Sagittarius' },
  '摩羯座': { zh: '摩羯座', en: 'Capricorn' },
  '水瓶座': { zh: '水瓶座', en: 'Aquarius' },
  '双鱼座': { zh: '双鱼座', en: 'Pisces' },
}

const zodiacDescriptions: Record<ZodiacSign, string> = {
  '白羊座': 'Intense, bold, and naturally magnetic.',
  '金牛座': 'Grounded, sensual, and deeply loyal.',
  '双子座': 'Curious, adaptive, and brilliantly expressive.',
  '巨蟹座': 'Nurturing, intuitive, and fiercely protective.',
  '狮子座': 'Charismatic, warm, and radiantly creative.',
  '处女座': 'Analytical, refined, and endlessly helpful.',
  '天秤座': 'Charming, balanced, and aesthetically gifted.',
  '天蝎座': 'Intense, stylish, and naturally magnetic.',
  '射手座': 'Adventurous, philosophical, and free-spirited.',
  '摩羯座': 'Ambitious, disciplined, and quietly powerful.',
  '水瓶座': 'Innovative, independent, and visionary.',
  '双鱼座': 'Dreamy, compassionate, and artistically inspired',
}

const STYLE_OPTIONS = [
  { id: 'minimalist', en: 'Minimalist', zh: '极简主义' },
  { id: 'professional', en: 'Professional', zh: '职业风' },
  { id: 'avantgarde', en: 'Avant-Garde', zh: '先锋前卫' },
  { id: 'vintage', en: 'Vintage', zh: '复古风' },
  { id: 'bohemian', en: 'Bohemian', zh: '波西米亚' },
]

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user, updateProfile } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [city, setCity] = useState(user?.city || '上海')
  const [zodiac, setZodiac] = useState<ZodiacSign>(user?.zodiac || '天秤座')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(user?.style || ['minimalist'])
  const [showPayment, setShowPayment] = useState(false)

  const isEn = i18n.language === 'en'

  if (!user) return null

  const handleSave = () => {
    updateProfile({ name, city, zodiac, style: selectedStyles })
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    )
  }

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-8 md:pt-12 space-y-8">
        {/* Header - 编辑风格 */}
        <section className="mb-12 max-w-3xl">
          <p className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant mb-3">
            {isEn ? 'Identity & Intent' : '身份与意向'}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-foreground tracking-tight editorial-title">
            {isEn ? (
              <>{name || user.name}'s <span className="text-primary italic">Aura</span> Profile</>
            ) : (
              <>{user.name}的<span className="text-primary italic">光环</span>档案</>
            )}
          </h1>
        </section>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Personal Essence */}
          <div className="bg-surface-container rounded-[2rem] p-8 animate-slide-up">
            <div className="flex gap-6">
              {/* Avatar with edit pencil overlay */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md border-2 border-[#fcf9f2] opacity-90 hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                    {isEn ? 'Display Name' : '显示名称'}
                  </label>
                  <input
                    className="w-full h-11 rounded-xl bg-surface-container-highest px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 border-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                    {isEn ? 'Email Connection' : '邮箱关联'}
                  </label>
                  <input
                    className="w-full h-11 rounded-xl bg-surface-container-low px-4 text-sm text-on-surface-variant focus:outline-none border-0"
                    value={user.email}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-on-surface-italic opacity-70 font-serif leading-relaxed">
              {isEn ? 'Manage how the stars perceive you.' : '管理星象对你的认知方式。'}
            </p>
          </div>

          {/* Card 2: Zodiac */}
          <div className="bg-tertiary-fixed/40 rounded-[2rem] p-8 relative overflow-hidden animate-slide-up">
            {/* Decorative star */}
            <span className="material-symbols-outlined absolute top-4 right-4 text-tertiary/20 text-[120px] pointer-events-none select-none">
              star
            </span>
            <div className="relative z-10">
              <span className="inline-block bg-tertiary-fixed/60 backdrop-blur-sm text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label mb-4">
                {isEn ? 'The Sign' : '星座'}
              </span>
              <h2 className="font-headline text-3xl text-on-surface mb-2">
                {isEn ? zodiacTranslations[zodiac].en : zodiac}
              </h2>
              <p className="text-sm text-on-surface-variant/80 italic font-serif leading-relaxed max-w-xs mb-6">
                {zodiacDescriptions[zodiac]}
              </p>

              <div>
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-3">
                  {isEn ? 'Adjust Celestial Alignment' : '调整天体对齐'}
                </label>
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value as ZodiacSign)}
                  className="w-full h-11 rounded-xl bg-white/60 backdrop-blur-sm px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-tertiary/30 border border-outline-variant/20"
                >
                  {ZODIACS_ZH.map((z) => (
                    <option key={z} value={z}>
                      {isEn ? zodiacTranslations[z].en : z}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Primary City */}
          <div className="bg-surface-container rounded-[2rem] p-8 animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  {isEn ? 'Timezone' : '时区'}
                </p>
                <p className="text-xs text-on-surface-variant">GMT+{city === '上海' ? '8' : '0'} ({city === '上海' ? 'Shanghai/CST' : city})</p>
              </div>
            </div>

            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Primary City' : '主要城市'}</h3>
            <p className="text-sm text-on-surface-variant/80 font-serif leading-relaxed mb-6">
              {isEn 
                ? 'Your location dictates the atmospheric metadata we use to refine your daily wardrobe advice.'
                : '你的位置决定了我们用于优化每日穿搭建议的大气元数据。'}
            </p>

            <div className="relative">
              <input
                className="w-full h-12 rounded-xl bg-surface-container-highest px-4 pl-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 border-0"
                placeholder={isEn ? 'London' : '上海'}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
            </div>

            {/* Atmospheric Pulse */}
            <div className="mt-6 pt-6 border-t border-outline-variant/10">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-3">
                {isEn ? 'Atmospheric Pulse' : '大气脉搏'}
              </p>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-primary">cloud</span>
                <div>
                  <p className="text-3xl font-headline font-light text-on-surface">18°C</p>
                  <p className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                    {isEn ? 'Misted Rain · Current Conditions' : '细雨·当前状况'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-on-surface-variant/60 italic font-serif leading-relaxed">
                "{isEn ? 'The soft humidity today suggests natural fibers and structured silhouettes to maintain form.' : '今日柔和的湿度暗示使用天然纤维和结构化轮廓以保持形态。'}"
              </p>
            </div>
          </div>

          {/* Card 4: Style Goals */}
          <div className="bg-surface-container rounded-[2rem] p-8 animate-slide-up">
            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Style Goals' : '风格目标'}</h3>
            <p className="text-sm text-on-surface-variant/80 font-serif leading-relaxed mb-6">
              {isEn ? 'Choose the aesthetic rhythm of your closet.' : '选择你衣橱的美学节奏。'}
            </p>

            <p className="text-[10px] font-label text-right text-on-surface-variant mb-3">
              {selectedStyles.length} {isEn ? 'selected' : '已选'}
            </p>

            {/* Style Grid */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {STYLE_OPTIONS.slice(0, 5).map((style) => {
                const isSelected = selectedStyles.includes(style.id)
                return (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`rounded-xl aspect-square flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {!isSelected && <span className="w-5 h-5 rounded-full bg-on-surface-variant/20 mb-1" />}
                    <span className="text-[11px] font-label font-semibold tracking-wide text-center px-1">
                      {isEn ? style.en : style.zh}
                    </span>
                  </button>
                )
              })}
              {/* Custom add button */}
              <button className="rounded-xl aspect-square flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all border border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-lg mb-0.5">add</span>
                <span className="text-[10px] font-label">{isEn ? 'Custom...' : '自定义...'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label">
            <span className="material-symbols-outlined text-base">sync</span>
            {isEn ? `Last sync with the stars · Today ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : `上次与星辰同步 · 今天 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => window.location.reload()} className="rounded-xl font-label text-sm tracking-wide text-on-surface-variant hover:bg-surface-container">
              {isEn ? 'Discard Changes' : '放弃更改'}
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary text-white font-label text-sm tracking-wide shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              {isEn ? 'Preserve Settings' : '保存设置'}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  )
}
