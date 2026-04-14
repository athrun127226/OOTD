import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/PaymentModal'
import { changeLanguage, getCurrentLanguage } from '@/i18n'
import type { ZodiacSign } from '@/types'

// 星座（内部使用中文）
const ZODIACS_ZH: ZodiacSign[] = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座',
]

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

const zodiacEmojis: Record<ZodiacSign, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user, updateProfile, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [city, setCity] = useState(user?.city || '上海')
  const [zodiac, setZodiac] = useState<ZodiacSign>(user?.zodiac || '天秤座')
  const [saved, setSaved] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [currentLang, setCurrentLang] = useState<'zh' | 'en'>(getCurrentLanguage())

  const isEn = i18n.language === 'en'

  if (!user) return null

  const handleSave = () => {
    updateProfile({ name, city, zodiac })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    changeLanguage(lang)
    setCurrentLang(lang)
  }

  return (
    <div className="min-h-screen pb-28 bg-background">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 顶部标题 */}
        <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>

        {/* 用户信息卡 - 现代白色卡片 */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm animate-slide-up">
          <div className="flex items-center gap-4 mb-5">
            {/* 头像 - 紫色渐变 */}
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary/30">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user.isPro ? (
                  <span className="text-xs bg-primary text-white px-2.5 py-1 rounded-full font-medium">
                    {t('profile.proMember')}
                  </span>
                ) : (
                  <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
                    {t('profile.freeMember')}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">💎 {user.credits} {t('profile.credits')}</span>
              </div>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span className="text-muted-foreground">{t('profile.city')}</span>
                </div>
                <span className="text-sm font-medium">{user.city}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span>⭐</span>
                  <span className="text-muted-foreground">{t('profile.zodiac')}</span>
                </div>
                <span className="text-sm font-medium">
                  {zodiacEmojis[user.zodiac]} {isEn ? zodiacTranslations[user.zodiac].en : user.zodiac}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>📅</span>
                  <span className="text-muted-foreground">{t('profile.registerDate')}</span>
                </div>
                <span className="text-sm font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : t('common.unknown')}
                </span>
              </div>
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="w-full rounded-xl mt-2"
              >
                {t('profile.editButton')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('profile.nickname')}</label>
                <input
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('profile.city')}</label>
                <input
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={isEn ? 'e.g., New York, Tokyo, Shanghai...' : '如：上海、北京、纽约...'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">{t('profile.zodiac')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {ZODIACS_ZH.map((z) => (
                    <button
                      key={z}
                      onClick={() => setZodiac(z)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        zodiac === z
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {zodiacEmojis[z]} {isEn ? zodiacTranslations[z].en.replace('座', '') : z.replace('座', '')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 rounded-xl">
                  {t('common.cancel')}
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-3 text-center text-sm text-green-600 bg-green-50 dark:bg-green-950/30 rounded-xl py-2">
              ✓ {t('profile.saved')}
            </div>
          )}
        </div>

        {/* Pro升级卡 */}
        {!user.isPro && (
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl animate-slide-up">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative">
              <p className="text-xs font-medium opacity-80 mb-1">{t('profile.proFeatures.title')}</p>
              <h3 className="text-xl font-bold mb-3">{t('profile.upgradePro')} ✨</h3>
              <ul className="space-y-1.5 mb-4">
                {[
                  t('profile.proFeatures.unlimited'),
                  t('profile.proFeatures.dailyUnlimited'),
                  t('profile.proFeatures.aiCutout'),
                  t('profile.proFeatures.styleCustomize'),
                  t('profile.proFeatures.noWatermark'),
                ].map((feat) => (
                  <li key={feat} className="text-sm flex items-center gap-2">
                    <span className="text-white/70">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setShowPayment(true)}
                  className="bg-white text-pink-600 hover:bg-white/90 rounded-xl font-bold shadow-lg"
                >
                  {t('profile.monthlyPrice')} {t('profile.upgradeNow')}
                </Button>
                <span className="text-xs opacity-70">{t('profile.yearlyPrice')}</span>
              </div>
            </div>
          </div>
        )}

        {/* 功能列表 */}
        <div className="glass rounded-3xl overflow-hidden shadow-md animate-slide-up">
          {[
            { icon: '🎨', label: t('profile.history'), desc: t('profile.historyDesc') },
            { icon: '🔔', label: t('profile.notifications'), desc: t('profile.notificationsDesc') },
            { icon: '🔒', label: t('profile.security'), desc: t('profile.securityDesc') },
            { icon: '📋', label: t('profile.about'), desc: t('profile.aboutDesc') },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-muted-foreground text-sm">›</span>
            </button>
          ))}
          
          {/* 语言切换 */}
          <div className="w-full flex items-center gap-4 p-4 border-b border-border last:border-0">
            <span className="text-xl">🌐</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{t('profile.language')}</p>
              <p className="text-xs text-muted-foreground">{t('profile.languageDesc')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentLang === 'zh'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentLang === 'en'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* 退出登录 */}
        <Button
          variant="outline"
          className="w-full rounded-2xl text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={logout}
        >
          {t('auth.logout')}
        </Button>
      </div>

      {/* 支付弹窗 */}
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
      />
    </div>
  )
}