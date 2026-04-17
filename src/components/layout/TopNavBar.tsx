import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import { AutoAwesome } from '@/components/icons'

const navLinks = [
  { path: '/profile', labelKey: 'nav.profile' },
  { path: '/wardrobe', labelKey: 'nav.wardrobe' },
  { path: '/lookbook', labelKey: 'nav.lookbook' },
  { path: '/', labelKey: 'nav.askAI' },
]

export default function TopNavBar() {
  const { t } = useTranslation()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-40 bg-[#fcf9f2]/95 backdrop-blur-sm border-b border-outline-variant/15">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-serif italic text-primary font-headline">
          Celestial Advisor
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-label text-sm uppercase tracking-widest px-2 py-1 transition-colors ${
                isActive(link.path)
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-secondary hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg'
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-primary p-2 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer">
            wb_sunny
          </button>
          <button className="material-symbols-outlined text-primary p-2 hover:bg-stone-200/50 rounded-full transition-colors cursor-pointer">
            auto_awesome
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
