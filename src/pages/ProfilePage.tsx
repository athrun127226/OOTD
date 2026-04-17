import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import PaymentModal from '@/components/PaymentModal'
import type { ZodiacSign } from '@/types'

// 城市背景图片（使用 Unsplash）
const CITY_IMAGES = [
  'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80', // 城市夜景
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', // 城市天际线
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // 城市街道
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', // 城市建筑
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // 城市黄昏
]

// 星座符号映射
const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  '白羊座': '♈',
  '金牛座': '♉',
  '双子座': '♊',
  '巨蟹座': '♋',
  '狮子座': '♌',
  '处女座': '♍',
  '天秤座': '♎',
  '天蝎座': '♏',
  '射手座': '♐',
  '摩羯座': '♑',
  '水瓶座': '♒',
  '双鱼座': '♓',
}

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

export default function ProfilePage() {
  const { i18n } = useTranslation()
  const { user } = useAuthStore()
  const [showPayment, setShowPayment] = useState(false)

  const isEn = i18n.language === 'en'

  // 随机选择城市图片
  const cityImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * CITY_IMAGES.length)
    return CITY_IMAGES[randomIndex]
  }, [])

  if (!user) return null

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-8 md:pt-12 space-y-8">
        {/* Header */}
        <section className="mb-12 max-w-3xl">
          <p className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant mb-3">
            {isEn ? 'Identity & Intent' : '身份与意向'}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-light text-foreground tracking-tight editorial-title">
            {isEn ? (
              <>{user.name}'s <span className="text-primary italic">Aura</span> Profile</>
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
              {/* Avatar */}
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
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                    {isEn ? 'Display Name' : '显示名称'}
                  </label>
                  <p className="text-lg font-bold text-on-surface">{user.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                    {isEn ? 'Email Connection' : '邮箱关联'}
                  </label>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-on-surface-italic opacity-70 font-serif leading-relaxed">
              {isEn ? 'Manage how the stars perceive you.' : '管理星象对你的认知方式。'}
            </p>
            <p className="mt-2 text-xs text-primary underline cursor-pointer" onClick={() => window.location.href = '/settings'}>
              {isEn ? 'Edit name & avatar in Settings →' : '在设置中编辑名称和头像 →'}
            </p>
          </div>

          {/* Card 2: Zodiac - 星座星象图 */}
          <div className="bg-[#0a0a12] rounded-[2rem] p-8 relative overflow-hidden animate-slide-up min-h-[320px]">
            {/* 星座符号背景 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="text-[280px] font-light text-white/20">{ZODIAC_SYMBOLS[user.zodiac]}</span>
            </div>
            
            {/* 装饰性星点 */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: Math.random() * 0.8 + 0.2,
                  }}
                />
              ))}
            </div>
            
            {/* 星座连线图 */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 320">
              {/* 随机生成星座连线 */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1={50 + Math.random() * 300}
                  y1={50 + Math.random() * 220}
                  x2={50 + Math.random() * 300}
                  y2={50 + Math.random() * 220}
                  stroke="white"
                  strokeWidth="1"
                  opacity={0.3}
                />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <circle
                  key={`star-${i}`}
                  cx={50 + Math.random() * 300}
                  cy={50 + Math.random() * 220}
                  r={3}
                  fill="white"
                  opacity={0.6}
                />
              ))}
            </svg>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label mb-4">
                  {isEn ? 'The Sign' : '星座'}
                </span>
                <h2 className="font-headline text-5xl text-white mb-2 flex items-center gap-4">
                  <span className="text-tertiary">{ZODIAC_SYMBOLS[user.zodiac]}</span>
                  {isEn ? zodiacTranslations[user.zodiac].en : user.zodiac}
                </h2>
              </div>
              
              <div className="mt-auto">
                <p className="text-sm text-white/60 font-serif italic leading-relaxed">
                  {isEn ? 'Your celestial energy radiates through the cosmos.' : '你的天体能量在宇宙中闪耀。'}
                </p>
                <p className="mt-2 text-xs text-tertiary underline cursor-pointer" onClick={() => window.location.href = '/settings'}>
                  {isEn ? 'Adjust alignment in Settings →' : '在设置中调整对齐 →'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Primary City - 城市背景图 */}
          <div className="relative rounded-[2rem] overflow-hidden animate-slide-up min-h-[320px]">
            {/* 城市背景图 */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cityImage})` }}
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-label uppercase tracking-widest text-white/70">
                    {isEn ? 'Timezone' : '时区'}
                  </p>
                  <p className="text-xs text-white/80">GMT+{user.city === '上海' ? '8' : '0'}</p>
                </div>
              </div>

              <h3 className="font-headline text-4xl text-white mb-2">{user.city}</h3>
              <p className="text-sm text-white/70 font-serif leading-relaxed mb-6">
                {isEn 
                  ? 'Your atmospheric coordinates influence daily styling advice.'
                  : '你的大气坐标影响每日穿搭建议。'}
              </p>

              {/* Weather Preview */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <span className="material-symbols-outlined text-4xl text-white">cloud</span>
                <div>
                  <p className="text-3xl font-headline font-light text-white">18°C</p>
                  <p className="text-[10px] font-label uppercase tracking-wider text-white/70">
                    {isEn ? 'Misted Rain' : '细雨'}
                  </p>
                </div>
              </div>
              
              <p className="mt-4 text-xs text-white/60 underline cursor-pointer" onClick={() => window.location.href = '/settings'}>
                {isEn ? 'Change city in Settings →' : '在设置中更改城市 →'}
              </p>
            </div>
          </div>

          {/* Card 4: Style Goals Preview */}
          <div className="bg-surface-container rounded-[2rem] p-8 animate-slide-up min-h-[320px] flex flex-col">
            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Style Goals' : '风格目标'}</h3>
            <p className="text-sm text-on-surface-variant/80 font-serif leading-relaxed mb-6">
              {isEn ? 'Your aesthetic rhythm.' : '你的美学节奏。'}
            </p>

            {/* Style Tags */}
            <div className="flex flex-wrap gap-2 flex-grow">
              {user.style && user.style.length > 0 ? (
                user.style.map((styleId) => {
                  const styleMap: Record<string, { en: string; zh: string }> = {
                    minimalist: { en: 'Minimalist', zh: '极简主义' },
                    professional: { en: 'Professional', zh: '职业风' },
                    avantgarde: { en: 'Avant-Garde', zh: '先锋前卫' },
                    vintage: { en: 'Vintage', zh: '复古风' },
                    bohemian: { en: 'Bohemian', zh: '波西米亚' },
                  }
                  const style = styleMap[styleId]
                  return (
                    <span
                      key={styleId}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-label font-bold tracking-wide"
                    >
                      {isEn ? style?.en : style?.zh}
                    </span>
                  )
                })
              ) : (
                <span className="text-sm text-on-surface-variant/60 italic">
                  {isEn ? 'No style goals set' : '未设置风格目标'}
                </span>
              )}
            </div>
            
            <p className="mt-4 text-xs text-primary underline cursor-pointer" onClick={() => window.location.href = '/settings'}>
              {isEn ? 'Edit style goals in Settings →' : '在设置中编辑风格目标 →'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container rounded-[2rem] p-6 animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Closet Size' : '衣橱规模'}
            </p>
            <p className="text-4xl font-headline font-light text-on-surface">42</p>
            <p className="text-xs text-on-surface-variant mt-1">{isEn ? 'items curated' : '件精选单品'}</p>
          </div>
          <div className="bg-surface-container rounded-[2rem] p-6 animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Outfits Created' : '已创建搭配'}
            </p>
            <p className="text-4xl font-headline font-light text-on-surface">18</p>
            <p className="text-xs text-on-surface-variant mt-1">{isEn ? 'looks saved' : '套造型已保存'}</p>
          </div>
          <div className="bg-tertiary-fixed/40 rounded-[2rem] p-6 animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Membership' : '会员状态'}
            </p>
            <p className="text-4xl font-headline font-light text-primary">{user.isPro ? 'PRO' : 'FREE'}</p>
            <button 
              onClick={() => setShowPayment(true)}
              className="text-xs text-primary underline mt-1"
            >
              {user.isPro ? (isEn ? 'Manage subscription' : '管理订阅') : (isEn ? 'Upgrade now' : '立即升级')}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  )
}
