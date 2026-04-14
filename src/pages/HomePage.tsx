import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useOOTDStore, useWardrobeStore } from '@/store'
import { fetchWeather, fetchFortune, generateOOTD } from '@/services/mockApi'
import type { Lang } from '@/services/mockApi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OOTDOutfit, ZodiacSign } from '@/types'

// 星座翻译
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

// 颜色名称翻译
const colorTranslations: Record<string, { zh: string; en: string }> = {
  '玫瑰粉': { zh: '玫瑰粉', en: 'Rose Pink' },
  '天空蓝': { zh: '天空蓝', en: 'Sky Blue' },
  '薄荷绿': { zh: '薄荷绿', en: 'Mint Green' },
  '奶油白': { zh: '奶油白', en: 'Cream White' },
  '珊瑚橙': { zh: '珊瑚橙', en: 'Coral Orange' },
  '紫罗兰': { zh: '紫罗兰', en: 'Violet' },
  '金色': { zh: '金色', en: 'Gold' },
  '米白': { zh: '米白', en: 'Beige' },
}

// 天气图标映射
const weatherIcons: Record<string, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  rainy: '🌧️',
  overcast: '☁️',
  windy: '🌬️',
}

// 星评组件
function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-xs ${star <= Math.round(score) ? 'text-amber-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  )
}

// 衣物卡片
function ClothingCard({ item, label }: { item: { imageUrl: string; name: string; color?: string }; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// OOTD方案卡片
function OutfitCard({ outfit, isActive, isEn }: { outfit: OOTDOutfit; isActive: boolean; isEn: boolean }) {
  const items = outfit.items
  
  // 分类翻译
  const categoryLabels: Record<string, string> = isEn 
    ? { '连衣裙': 'Dress', '上衣': 'Top', '外套': 'Outerwear', '下装': 'Bottom', '鞋子': 'Shoes', '配饰': 'Accessory' }
    : { '连衣裙': '连衣裙', '上衣': '上衣', '外套': '外套', '下装': '下装', '鞋子': '鞋子', '配饰': '配饰' }

  return (
    <div
      className={`rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
        isActive ? 'border-primary shadow-xl scale-100' : 'border-transparent shadow-md scale-95 opacity-70'
      }`}
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(168,85,247,0.05))'
          : undefined,
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-base">{outfit.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{outfit.style}</Badge>
              <Badge variant="outline" className="text-xs">{outfit.occasion}</Badge>
            </div>
          </div>
          <div className="text-right">
            <StarRating score={outfit.score} />
            <span className="text-xs text-muted-foreground mt-0.5 block">
              {outfit.score.toFixed(1)}{isEn ? '' : '分'}
            </span>
          </div>
        </div>

        {/* 衣物组合展示 */}
        <div className="flex gap-3 justify-center py-3 flex-wrap">
          {items.dress && <ClothingCard item={items.dress} label={categoryLabels['连衣裙']} />}
          {items.top && <ClothingCard item={items.top} label={categoryLabels['上衣']} />}
          {items.outerwear && <ClothingCard item={items.outerwear} label={categoryLabels['外套']} />}
          {items.bottom && <ClothingCard item={items.bottom} label={categoryLabels['下装']} />}
          {items.shoes && <ClothingCard item={items.shoes} label={categoryLabels['鞋子']} />}
          {items.accessories?.map((acc, i) => (
            <ClothingCard key={i} item={acc} label={categoryLabels['配饰']} />
          ))}
        </div>

        {/* AI点评 */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30">
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold text-primary">{isEn ? '✨ AI Comment:' : '✨ AI点评：'}</span>
            {outfit.aiComment}
          </p>
          {outfit.luckyReason && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
              <span>🍀</span>{outfit.luckyReason}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const { weather, fortune, outfits, status, error, activeOutfitIndex, setWeather, setFortune, setOutfits, setStatus, setError, setActiveOutfitIndex } = useOOTDStore()
  const { items: wardrobeItems } = useWardrobeStore()
  const [initialLoading, setInitialLoading] = useState(true)

  const isEn = i18n.language === 'en'

  // 初始化天气和运势
  useEffect(() => {
    const init = async () => {
      if (!user) return
      const lang: Lang = isEn ? 'en' : 'zh'
      try {
        const [weatherData, fortuneData] = await Promise.all([
          fetchWeather(user.city || '上海', lang),
          fetchFortune(user.zodiac || '天秤座', lang),
        ])
        setWeather(weatherData)
        setFortune(fortuneData)
      } catch {
        // silent fail
      } finally {
        setInitialLoading(false)
      }
    }
    init()
  }, [user, setWeather, setFortune, isEn])

  const handleGenerate = async () => {
    if (status === 'loading') return
    setStatus('loading')
    setError(null)
    const lang: Lang = isEn ? 'en' : 'zh'
    try {
      const results = await generateOOTD(wardrobeItems, weather!, fortune!, lang)
      setOutfits(results)
      setStatus('success')
      setActiveOutfitIndex(0)
    } catch {
      setError(isEn ? 'Generation failed, please retry' : '生成失败，请重试')
      setStatus('error')
    }
  }

  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? 'text-amber-400' : 'text-gray-300'}>★</span>
    ))

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* 现代简约背景 */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 顶部问候 */}
        <div className="animate-fade-in">
          <p className="text-muted-foreground text-sm">{t('home.greeting')}</p>
          <h1 className="text-2xl font-bold text-foreground">
            {t('home.title', { name: user?.name || (isEn ? 'Fashionista' : '时髦达人') })}
          </h1>
        </div>

        {/* 天气 + 运势卡片 */}
        {initialLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-slide-up">
            {/* 天气卡片 - 现代白色卡片 */}
            {weather && (
              <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{weatherIcons[weather.conditionCode] || '🌤️'}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{weather.city}</p>
                    <p className="font-medium text-sm">{weather.condition}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">{weather.temperature.current}°C</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {weather.temperature.min}° ~ {weather.temperature.max}° · {weather.windDirection}
                </p>
              </div>
            )}
            
            {/* 运势卡片 */}
            {fortune && (
              <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    {isEn && zodiacTranslations[fortune.zodiac as ZodiacSign] 
                      ? zodiacTranslations[fortune.zodiac as ZodiacSign].en 
                      : fortune.zodiac}
                  </span>
                  <div className="flex text-xs">{renderStars(fortune.overall)}</div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ background: colorNameToHex(fortune.luckyColor) }}
                  />
                  <p className="text-xs font-medium text-foreground/80">
                    {t('home.luckyColor')}: {isEn && colorTranslations[fortune.luckyColor] 
                      ? colorTranslations[fortune.luckyColor].en 
                      : fortune.luckyColor}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{fortune.todayTip}</p>
              </div>
            )}
          </div>
        )}

        {/* 核心 CTA 按钮 - 现代紫色渐变 */}
        <div className="flex flex-col items-center gap-3 py-4 animate-slide-up">
          <button
            onClick={handleGenerate}
            disabled={status === 'loading' || !weather || !fortune}
            className="w-full h-16 text-lg font-bold rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('home.generating')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                {t('home.generate')}
              </span>
            )}
          </button>
          
          {wardrobeItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              {t('home.tip')}
            </p>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-destructive/10 text-destructive rounded-2xl p-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* 穿搭结果展示 */}
        {status === 'success' && outfits.length > 0 && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{t('home.todayOutfit')}</h2>
              <span className="text-xs text-muted-foreground">
                {t('home.plans', { count: outfits.length })}
              </span>
            </div>

            {/* 方案切换标签 */}
            <div className="flex gap-2">
              {outfits.map((outfit, i) => (
                <button
                  key={outfit.id}
                  onClick={() => setActiveOutfitIndex(i)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeOutfitIndex === i
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {isEn ? 'Plan' : '方案'} {i + 1}
                </button>
              ))}
            </div>

            {/* 当前方案展示 */}
            {outfits.map((outfit, i) => (
              <div
                key={outfit.id}
                className={`transition-all duration-300 ${i === activeOutfitIndex ? 'block' : 'hidden'}`}
              >
                <OutfitCard outfit={outfit} isActive={true} isEn={isEn} />
              </div>
            ))}

            {/* 操作按钮 */}
            <div className="flex gap-3 pb-4">
              <Button variant="outline" className="flex-1 rounded-xl gap-2" onClick={handleGenerate}>
                <span>🔄</span> {t('home.regenerate')}
              </Button>
              <Button className="flex-1 rounded-xl gap-2">
                <span>📤</span> {t('home.share')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 将颜色名称转换为近似hex
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    '玫瑰粉': '#FF69B4',
    '天空蓝': '#87CEEB',
    '薄荷绿': '#98FF98',
    '奶油白': '#FFFDD0',
    '珊瑚橙': '#FF7F50',
    '紫罗兰': '#EE82EE',
    '金色': '#FFD700',
    '米白': '#F5F5DC',
  }
  return map[name] || '#EC4899'
}