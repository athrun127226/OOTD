import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import PaymentModal from '@/components/PaymentModal'
import type { ZodiacSign } from '@/types'

// 真实城市图片映射
const CITY_IMAGE_MAP: Record<string, string> = {
  '上海': 'https://images.unsplash.com/photo-1545893835-abaa50cbe628?w=800&q=80', // 上海外滩
  '北京': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80', // 北京故宫
  '深圳': 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=800&q=80', // 深圳
  '广州': 'https://images.unsplash.com/photo-1583859028040-6d26a06e9e5a?w=800&q=80', // 广州塔
  '杭州': 'https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800&q=80', // 西湖
  '成都': 'https://images.unsplash.com/photo-1590103514966-5e2a11c13e21?w=800&q=80', // 成都
  '南京': 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80', // 南京
  '武汉': 'https://images.unsplash.com/photo-1576506295286-5cda18df43eb?w=800&q=80', // 武汉
  '西安': 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80', // 西安
  '重庆': 'https://images.unsplash.com/photo-1590559899731-a382839e5549?w=800&q=80', // 重庆
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // 伦敦
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // 纽约
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // 东京
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // 巴黎
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', // 悉尼
}

// 默认城市图片（随机使用）
const DEFAULT_CITY_IMAGES = [
  'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80', // 城市夜景
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80', // 城市天际线
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', // 城市街道
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80', // 城市黄昏
]

// 全局存储选中的默认图片（只在首次加载时随机）
let selectedDefaultImage: string | null = null

// 星座符号映射
const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}

const zodiacTranslations: Record<ZodiacSign, { zh: string; en: string }> = {
  '白羊座': { zh: '白羊座', en: 'Aries' }, '金牛座': { zh: '金牛座', en: 'Taurus' },
  '双子座': { zh: '双子座', en: 'Gemini' }, '巨蟹座': { zh: '巨蟹座', en: 'Cancer' },
  '狮子座': { zh: '狮子座', en: 'Leo' }, '处女座': { zh: '处女座', en: 'Virgo' },
  '天秤座': { zh: '天秤座', en: 'Libra' }, '天蝎座': { zh: '天蝎座', en: 'Scorpio' },
  '射手座': { zh: '射手座', en: 'Sagittarius' }, '摩羯座': { zh: '摩羯座', en: 'Capricorn' },
  '水瓶座': { zh: '水瓶座', en: 'Aquarius' }, '双鱼座': { zh: '双鱼座', en: 'Pisces' },
}

export default function ProfilePage() {
  const { i18n } = useTranslation()
  const { user } = useAuthStore()
  const [showPayment, setShowPayment] = useState(false)

  const isEn = i18n.language === 'en'

  // 获取城市图片：优先使用真实城市图片，否则使用默认图片
  const cityImage = useMemo(() => {
    const userCity = user?.city || '上海'
    
    // 如果有真实城市图片，使用它
    if (CITY_IMAGE_MAP[userCity]) {
      return CITY_IMAGE_MAP[userCity]
    }
    
    // 否则使用默认图片（只在首次加载时随机）
    if (!selectedDefaultImage) {
      const randomIndex = Math.floor(Math.random() * DEFAULT_CITY_IMAGES.length)
      selectedDefaultImage = DEFAULT_CITY_IMAGES[randomIndex]
    }
    return selectedDefaultImage
  }, [user?.city])

  if (!user) return null

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-surface">
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-8 md:pt-12 space-y-8">
        {/* Header - Editorial Style */}
        <section className="mb-12 max-w-3xl">
          <p className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant mb-3">
            {isEn ? 'Identity & Intent' : '身份与意向'}
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-light text-on-surface tracking-tight">
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
          <div className="bg-surface-container rounded-[2rem] p-8 editorial-shadow animate-slide-up">
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-primary text-3xl font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
                    {isEn ? 'Display Name' : '显示名称'}
                  </p>
                  <p className="text-xl font-headline text-on-surface">{user.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
                    {isEn ? 'Email Connection' : '邮箱关联'}
                  </p>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm text-on-surface-variant font-body italic leading-relaxed">
              {isEn ? 'Manage how the stars perceive you.' : '管理星象对你的认知方式。'}
            </p>
            <p className="mt-3 text-xs text-primary underline cursor-pointer font-label" onClick={() => window.location.href = '/settings'}>
              {isEn ? 'Edit name & avatar in Settings →' : '在设置中编辑名称和头像 →'}
            </p>
          </div>

          {/* Card 2: Zodiac - 星座星象图（深色宇宙背景） */}
          <div className="bg-[#1c1c24] rounded-[2rem] p-8 relative overflow-hidden editorial-shadow animate-slide-up min-h-[320px]">
            {/* 星座符号背景 */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-[320px] font-light text-white">{ZODIAC_SYMBOLS[user.zodiac]}</span>
            </div>
            
            {/* 装饰性星点 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              ))}
            </div>
            
            {/* 星座连线图 */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 320">
              {Array.from({ length: 6 }).map((_, i) => (
                <line
                  key={i}
                  x1={40 + Math.random() * 320}
                  y1={40 + Math.random() * 240}
                  x2={40 + Math.random() * 320}
                  y2={40 + Math.random() * 240}
                  stroke="#f0dbff"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <circle
                  key={`star-${i}`}
                  cx={40 + Math.random() * 320}
                  cy={40 + Math.random() * 240}
                  r={2}
                  fill="#f0dbff"
                  opacity={0.8}
                />
              ))}
            </svg>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <span className="inline-block bg-tertiary-fixed/20 backdrop-blur-sm text-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label mb-4">
                  {isEn ? 'The Sign' : '星座'}
                </span>
                <h2 className="font-headline text-5xl text-white mb-2 flex items-center gap-4">
                  <span className="text-tertiary-fixed text-6xl">{ZODIAC_SYMBOLS[user.zodiac]}</span>
                  <div>
                    <p className="text-3xl">{isEn ? zodiacTranslations[user.zodiac].en : user.zodiac}</p>
                  </div>
                </h2>
              </div>
              
              <div className="mt-auto">
                <p className="text-sm text-white/60 font-body italic leading-relaxed">
                  {isEn ? 'Your celestial energy radiates through the cosmos.' : '你的天体能量在宇宙中闪耀。'}
                </p>
                <p className="mt-3 text-xs text-tertiary-fixed underline cursor-pointer font-label" onClick={() => window.location.href = '/settings'}>
                  {isEn ? 'Adjust alignment in Settings →' : '在设置中调整对齐 →'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Primary City - 城市背景图 */}
          <div className="relative rounded-[2rem] overflow-hidden editorial-shadow animate-slide-up min-h-[320px]">
            {/* 城市背景图 */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
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
              <p className="text-sm text-white/70 font-body italic leading-relaxed mb-6">
                {isEn 
                  ? 'Your atmospheric coordinates influence daily styling advice.'
                  : '你的大气坐标影响每日穿搭建议。'}
              </p>

              {/* Weather Preview */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <span className="material-symbols-outlined text-4xl text-white">cloud</span>
                <div>
                  <p className="text-3xl font-headline font-light text-white">18°C</p>
                  <p className="text-[10px] font-label uppercase tracking-wider text-white/70">
                    {isEn ? 'Misted Rain' : '细雨'}
                  </p>
                </div>
              </div>
              
              <p className="mt-4 text-xs text-white/60 underline cursor-pointer font-label" onClick={() => window.location.href = '/settings'}>
                {isEn ? 'Change city in Settings →' : '在设置中更改城市 →'}
              </p>
            </div>
          </div>

          {/* Card 4: Style Goals Preview */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 editorial-shadow animate-slide-up min-h-[320px] flex flex-col">
            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Style Goals' : '风格目标'}</h3>
            <p className="text-sm text-on-surface-variant font-body italic leading-relaxed mb-6">
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
                      className="px-4 py-2 bg-primary-fixed/20 text-primary rounded-full text-sm font-label font-bold tracking-wide"
                    >
                      {isEn ? style?.en : style?.zh}
                    </span>
                  )
                })
              ) : (
                <span className="text-sm text-on-surface-variant/60 font-body italic">
                  {isEn ? 'No style goals set' : '未设置风格目标'}
                </span>
              )}
            </div>
            
            <p className="mt-6 text-xs text-primary underline cursor-pointer font-label" onClick={() => window.location.href = '/settings'}>
              {isEn ? 'Edit style goals in Settings →' : '在设置中编辑风格目标 →'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container rounded-[2rem] p-6 editorial-shadow animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Closet Size' : '衣橱规模'}
            </p>
            <p className="text-4xl font-headline font-light text-on-surface">42</p>
            <p className="text-xs text-on-surface-variant mt-1 font-body">{isEn ? 'items curated' : '件精选单品'}</p>
          </div>
          <div className="bg-surface-container rounded-[2rem] p-6 editorial-shadow animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Outfits Created' : '已创建搭配'}
            </p>
            <p className="text-4xl font-headline font-light text-on-surface">18</p>
            <p className="text-xs text-on-surface-variant mt-1 font-body">{isEn ? 'looks saved' : '套造型已保存'}</p>
          </div>
          <div className="bg-tertiary-fixed/30 rounded-[2rem] p-6 editorial-shadow animate-slide-up">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-2">
              {isEn ? 'Membership' : '会员状态'}
            </p>
            <p className="text-4xl font-headline font-light text-primary">{user.isPro ? 'PRO' : 'FREE'}</p>
            <button 
              onClick={() => setShowPayment(true)}
              className="text-xs text-primary underline mt-1 font-label"
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
