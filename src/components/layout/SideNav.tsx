import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import { 
  PersonOutline, 
  Checkroom, 
  AutoAwesome,
  AutoStories,
  SettingsOutline,
  HelpOutline,
  DiamondOutline,
  LanguageOutline
} from '@/components/icons'

export default function SideNav() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  
  const navItems = [
    { path: '/profile', icon: PersonOutline, labelKey: 'nav.profile' },
    { path: '/wardrobe', icon: Checkroom, labelKey: 'nav.wardrobe' },
    { path: '/lookbook', icon: AutoStories, labelKey: 'nav.lookbook' },
    { path: '/', icon: AutoAwesome, labelKey: 'nav.askAI' },
  ]
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')
  }

  return (
    <>
      {/* 桌面端左侧边栏 */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-72 bg-[#fcf9f2] dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 shadow-[32px_0_32px_rgba(0,0,0,0.03)] z-50">
        {/* Logo 区域 */}
        <div className="px-6 py-8">
          <h1 className="text-xl font-serif italic text-[#4d6328] dark:text-[#7D8F69]">
            {t('app.title')}
          </h1>
          <p className="text-stone-500 text-xs font-label uppercase tracking-widest mt-1">
            {t('app.subtitle')}
          </p>
        </div>
        
        {/* 导航菜单 */}
        <nav className="flex-grow px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 py-3 px-4 rounded-r-full transition-all ${
                      active
                        ? 'bg-[#657c3e]/10 text-[#4d6328] dark:text-[#7D8F69] font-bold translate-x-1'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${active ? 'text-[#4d6328]' : ''}`} />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        {/* 底部区域 */}
        <div className="mt-auto px-6 border-t border-stone-100 pt-6 pb-8">
          {/* 用户信息卡片 */}
          <div className="flex items-center gap-3 mb-6 bg-surface-container p-3 rounded-xl">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">
                {user?.name || t('user.defaultName')}
              </p>
              <p className="text-[10px] text-stone-500 uppercase tracking-tighter truncate">
                {user?.zodiac} • {user?.city}
              </p>
            </div>
          </div>
          
          {/* 设置菜单 */}
          <ul className="space-y-1 mb-6">
            {/* 会员入口 */}
            <li>
              <Link
                to="/membership"
                className="flex items-center gap-4 text-[#735c00] py-2 hover:text-[#4d6328] transition-colors"
              >
                <DiamondOutline className="w-5 h-5" />
                <span className="text-sm font-bold">{t('nav.membership')}</span>
              </Link>
            </li>
            {/* 语言切换 */}
            <li>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-4 text-stone-600 dark:text-stone-400 py-2 hover:text-[#4d6328] dark:hover:text-[#7D8F69] transition-colors w-full"
              >
                <LanguageOutline className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {i18n.language === 'en' ? '中文' : 'English'}
                </span>
              </button>
            </li>
            <li>
              <Link
                to="/settings"
                className="flex items-center gap-4 text-stone-600 dark:text-stone-400 py-2 hover:text-[#4d6328] dark:hover:text-[#7D8F69] transition-colors"
              >
                <SettingsOutline className="w-5 h-5" />
                <span className="text-sm font-medium">{t('nav.settings')}</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center gap-4 text-stone-600 dark:text-stone-400 py-2 hover:text-[#4d6328] dark:hover:text-[#7D8F69] transition-colors"
              >
                <HelpOutline className="w-5 h-5" />
                <span className="text-sm font-medium">{t('nav.support')}</span>
              </Link>
            </li>
          </ul>
          
          {/* Daily Insight 按钮 */}
          <Link
            to="/"
            className="block w-full py-3 bg-gradient-to-r from-[#4d6328] to-[#657c3e] text-white rounded-xl font-bold shadow-lg shadow-[#4d6328]/20 hover:shadow-xl hover:scale-[1.02] transition-all text-center"
          >
            {t('nav.dailyInsight')}
          </Link>
        </div>
      </aside>
      
      {/* 移动端底部导航 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fcf9f2]/90 dark:bg-stone-950/90 backdrop-blur-xl flex justify-around items-center px-4 pb-6 pt-2 z-50 shadow-[0_-4px_24px_0_rgba(0,0,0,0.06)] rounded-t-[2rem]">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center transition-all ${
                active 
                  ? 'bg-[#657c3e] dark:bg-[#4d6328] text-white rounded-full w-14 h-14 -translate-y-2 shadow-lg' 
                  : 'text-[#735c00] dark:text-stone-400 opacity-70 hover:opacity-100'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-white' : ''}`} />
              <span className={`text-[10px] uppercase tracking-widest font-medium mt-1 ${active ? 'text-white' : ''}`}>
                {t(item.labelKey)}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
