import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Favorite, Thermostat } from '@/components/icons'

// Mock outfit data for lookbook
const MOCK_OUTFITS = [
  {
    id: '1',
    name: 'Gallery Opening',
    date: 'Oct 12',
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=533&fit=crop',
    isAIRecommended: true,
    temperature: '18°C - 22°C',
    occasion: 'Evening',
  },
  {
    id: '2',
    name: 'Weekend Brunch',
    date: 'Sep 28',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-68f1c9e9d134?w=400&h=533&fit=crop',
    isAIRecommended: false,
    temperature: '20°C - 24°C',
    occasion: 'Daytime',
  },
  {
    id: '3',
    name: 'Forest Retreat',
    date: 'Nov 04',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop',
    isAIRecommended: true,
    temperature: '8°C - 12°C',
    occasion: 'Outdoor',
  },
  {
    id: '4',
    name: 'Studio Morning',
    date: 'Oct 30',
    imageUrl: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=400&h=533&fit=crop',
    isAIRecommended: false,
    temperature: '15°C - 19°C',
    occasion: 'Creative',
  },
  {
    id: '5',
    name: 'Client Meeting',
    date: 'Oct 24',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=533&fit=crop',
    isAIRecommended: false,
    temperature: '16°C - 20°C',
    occasion: 'Professional',
  },
]

function OutfitCard({ outfit, isEn }: { outfit: typeof MOCK_OUTFITS[0]; isEn: boolean }) {
  const [liked, setLiked] = useState(false)

  return (
    <article className="group space-y-5">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-container transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <img
          src={outfit.imageUrl}
          alt={outfit.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* AI Recommendation Tag */}
        {outfit.isAIRecommended && (
          <div className="absolute top-4 left-4">
            <span className="bg-surface/80 backdrop-blur-xl px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-primary uppercase border border-primary/10 font-label">
              {isEn ? 'AI Recommendation' : 'AI推荐'}
            </span>
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all ${
            liked ? 'bg-primary text-white' : 'bg-surface/90 backdrop-blur-md text-on-surface hover:bg-white'
          }`}
        >
          <Favorite className={liked ? 'w-5 h-5' : 'w-5 h-5'} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="px-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif italic text-on-surface">{outfit.name}</h3>
          <span className="text-secondary font-serif text-sm">{outfit.date}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-md bg-surface-container-low text-on-surface-variant text-[11px] font-label tracking-wide flex items-center gap-1.5">
            <Thermostat className="w-3.5 h-3.5" />
            {isEn ? `Best for ${outfit.temperature}` : `适合 ${outfit.temperature}`}
          </span>
          <span className="px-3 py-1 rounded-md bg-surface-container-low text-on-surface-variant text-[11px] font-label tracking-wide">
            {outfit.occasion}
          </span>
        </div>
      </div>
    </article>
  )
}

function PromotionalCard({ isEn }: { isEn: boolean }) {
  return (
    <article className="group space-y-5 min-h-[420px]">
      <div className="aspect-[3/4] rounded-xl bg-primary-fixed/15 border border-dashed border-outline-variant/30 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden transition-all duration-500 hover:bg-primary-fixed/20">
        {/* Decorative sparkles */}
        <span className="material-symbols-outlined text-primary/30 text-6xl mb-4">auto_awesome</span>
        <h3 className="font-headline text-2xl text-primary italic mb-3">
          {isEn ? 'New Inspiration?' : '寻找新灵感？'}
        </h3>
        <p className="text-sm text-on-surface-variant/70 font-serif leading-relaxed max-w-xs mb-6">
          {isEn
            ? 'Let the Celestial Muse curate a new ensemble for your next journey.'
            : '让天体缪斯为你下一次旅程策划一套全新穿搭。'}
        </p>
        <button className="px-6 py-2.5 rounded-full border border-primary/40 text-primary font-label text-sm tracking-widest hover:bg-primary hover:text-white transition-all">
          {isEn ? 'Consult ASK AI' : '咨询 ASK AI'}
        </button>
      </div>
    </article>
  )
}

export default function LookbookPage() {
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('autumn')
  const [favorites] = useState(new Set(['1', '3']))

  const isEn = i18n.language === 'en'

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-12 py-12 lg:py-16">
        {/* Header */}
        <header className="mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-serif text-on-surface mb-6 tracking-tight">
            {t('lookbook.title')}
          </h1>
          <p className="text-on-surface-variant font-serif italic text-xl leading-relaxed opacity-80">
            {t('lookbook.description')}
          </p>
        </header>

        {/* Filters */}
        <section className="mb-12 flex flex-wrap items-center gap-3">
          <span className="text-label text-stone-400 mr-2 tracking-widest uppercase text-[10px] font-label">
            {t('lookbook.filterBy')}
          </span>
          <button
            onClick={() => setActiveFilter('autumn')}
            className={`px-6 py-2 rounded-full font-label text-sm transition-all ${
              activeFilter === 'autumn'
                ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm hover:opacity-80'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {t('lookbook.seasonAutumn')}
          </button>
          <button
            onClick={() => setActiveFilter('occasion')}
            className={`px-6 py-2 rounded-full font-label text-sm transition-all ${
              activeFilter === 'occasion'
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {t('lookbook.occasion')}
          </button>
          <button
            onClick={() => setActiveFilter('weather')}
            className={`px-6 py-2 rounded-full font-label text-sm transition-all ${
              activeFilter === 'weather'
                ? 'bg-secondary-fixed text-on-secondary-fixed'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {t('lookbook.weather')}
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-2 text-primary font-label text-sm font-semibold">
            <span className="material-symbols-outlined text-lg">tune</span>
            {t('lookbook.preferences')}
          </button>
        </section>

        {/* Outfit Grid (3 columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
          {MOCK_OUTFITS.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} isEn={isEn} />
          ))}
          <PromotionalCard isEn={isEn} />
        </div>

        {/* Footer */}
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="font-headline text-lg text-on-surface-variant/60 italic">
            {t('lookbook.discoveryCompleted', { count: MOCK_OUTFITS.length })}
          </p>
          <button className="mt-6 px-8 py-3 rounded-full bg-surface-container-high text-on-surface-variant font-label text-sm tracking-widest hover:bg-surface-variant transition-colors border border-outline-variant/20">
            {t('lookbook.loadArchive')}
          </button>
        </div>
      </div>
    </div>
  )
}
