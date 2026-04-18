import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useOOTDStore, useWardrobeStore } from '@/store'
import { fetchWeather, fetchFortune, generateOOTD } from '@/services/mockApi'
import type { Lang, FortuneData, WeatherData } from '@/services/mockApi'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { OOTDOutfit, ZodiacSign, ClothingItem } from '@/types'

const zodiacTranslations: Record<ZodiacSign, { zh: string; en: string }> = {
  '白羊座': { zh: '白羊座', en: 'Aries' }, '金牛座': { zh: '金牛座', en: 'Taurus' },
  '双子座': { zh: '双子座', en: 'Gemini' }, '巨蟹座': { zh: '巨蟹座', en: 'Cancer' },
  '狮子座': { zh: '狮子座', en: 'Leo' }, '处女座': { zh: '处女座', en: 'Virgo' },
  '天秤座': { zh: '天秤座', en: 'Libra' }, '天蝎座': { zh: '天蝎座', en: 'Scorpio' },
  '射手座': { zh: '射手座', en: 'Sagittarius' }, '摩羯座': { zh: '摩羯座', en: 'Capricorn' },
  '水瓶座': { zh: '水瓶座', en: 'Aquarius' }, '双鱼座': { zh: '双鱼座', en: 'Pisces' },
}

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}

// 幸运色统一映射：每个星座对应一个固定的幸运色（名称 + hex色值）
const ZODIAC_LUCKY_COLORS: Record<ZodiacSign, { nameZh: string; nameEn: string; hex: string }> = {
  '白羊座':   { nameZh: '热情红',   nameEn: 'Fiery Red',    hex: '#E53935' },
  '金牛座':   { nameZh: '翡翠绿',   nameEn: 'Emerald Green', hex: '#43A047' },
  '双子座':   { nameZh: '明黄色',   nameEn: 'Bright Yellow', hex: '#FDD835' },
  '巨蟹座':   { nameZh: '银白色',   nameEn: 'Silver White',  hex: '#CFD8DC' },
  '狮子座':   { nameZh: '辉煌金',   nameEn: 'Radiant Gold',  hex: '#FFB300' },
  '处女座':   { nameZh: '大地棕',   nameEn: 'Earth Brown',   hex: '#8D6E63' },
  '天秤座':   { nameZh: '玫瑰粉',   nameEn: 'Rose Pink',     hex: '#EC407A' },
  '天蝎座':   { nameZh: '深邃紫',   nameEn: 'Deep Purple',   hex: '#7B1FA2' },
  '射手座':   { nameZh: '天空蓝',   nameEn: 'Sky Blue',      hex: '#1E88E5' },
  '摩羯座':   { nameZh: '墨黑色',   nameEn: 'Jet Black',      hex: '#37474F' },
  '水瓶座':   { nameZh: '电光蓝',   nameEn: 'Electric Blue',  hex: '#00ACC1' },
  '双鱼座':   { nameZh: '海蓝色',   nameEn: 'Sea Blue',       hex: '#26C6DA' },
}

// 色彩对齐匹配数据 - 根据幸运色动态生成
function getColorMatches(luckyColorHex: string, isEn: boolean) {
  // 基于幸运色的同色系匹配项
  return [
    { name: isEn ? 'Silk Scarf' : '丝巾', percent: 98, hex: luckyColorHex },
    { name: isEn ? 'Linen Trousers' : '亚麻长裤', percent: 82, hex: adjustBrightness(luckyColorHex, -30) },
    { name: isEn ? 'Wool Coat' : '羊毛大衣', percent: 75, hex: adjustBrightness(luckyColorHex, -60) },
    { name: isEn ? 'Cotton Tee' : '棉质T恤', percent: null, hex: adjustBrightness(luckyColorHex, 40), recommended: true },
  ]
}

// 简单的亮度调整工具
function adjustBrightness(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// 星座运势数据（中英文）
const ZODIAC_FORTUNES_ZH: Record<ZodiacSign, {
  overall: string
  love: string
  career: string
  health: string
  tip: string
}> = {
  '白羊座':   { overall: '★★★★☆', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: '今日行动力旺盛，适合尝试大胆的穿搭风格。红色系单品能为你注入更多能量。' },
  '金牛座':   { overall: '★★★☆☆', love: '★★★★☆', career: '★★★★★', health: '★★★★☆', tip: '今天宜选择舒适质感的面料，大地色调会让你感到踏实安心，有助于做出明智决定。' },
  '双子座':   { overall: '★★★★☆', love: '★★★★★', career: '★★★★☆', health: '★★★☆☆', tip: '社交能量高涨的一天！明亮配色和层次感搭配能让你成为人群焦点。' },
  '巨蟹座':   { overall: '★★★☆☆', love: '★★★★☆', career: '★★★☆☆', health: '★★★★★', tip: '情绪敏感期，柔软的面料和柔和的浅色调能给你带来安全感与舒适感。' },
  '狮子座':   { overall: '★★★★★', love: '★★★★☆', career: '★★★★★', health: '★★★★☆', tip: '今天是你的高光时刻！金色或暖色调配饰能为你的气场加分，自信穿搭出街。' },
  '处女座':   { overall: '★★★★☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★☆', tip: '注重细节的一天，整洁利落的剪裁和简约配色会带来好运。避免过于繁复的设计。' },
  '天秤座':   { overall: '★★★★★', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: '和谐美感是你今天的主题。粉紫色调和优雅曲线设计能提升你的人缘运势。' },
  '天蝎座':   { overall: '★★★★☆', love: '★★★★★', career: '★★★★☆', health: '★★★☆☆', tip: '神秘感是你的魅力武器。深紫色或黑色系单品能增强你的气场，适合重要场合。' },
  '射手座':   { overall: '★★★★☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★★', tip: '自由奔放的好日子！蓝色系和宽松廓形让你活力满满，适合户外活动或旅行穿搭。' },
  '摩羯座':   { overall: '★★★☆☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★☆', tip: '稳扎稳打的日子，深色正装或极简风格能展现你的专业度，事业运势强劲。' },
  '水瓶座':   { overall: '★★★★☆', love: '★★★★☆', career: '★★★★★', health: '★★★☆☆', tip: '创意灵感迸发！电光蓝或未来感的金属色元素能让你的穿搭脱颖而出，引人注目。' },
  '双鱼座':   { overall: '★★★★★', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: '直觉敏锐的一天。海蓝色、渐变色或梦幻面料能与你的内在能量产生共鸣。' },
}

const ZODIAC_FORTUNES_EN: Record<ZodiacSign, {
  overall: string
  love: string
  career: string
  health: string
  tip: string
}> = {
  'Aries':     { overall: '★★★★☆', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: 'High energy today — bold styles and red accents will amplify your power.' },
  'Taurus':    { overall: '★★★☆☆', love: '★★★★☆', career: '★★★★★', health: '★★★★☆', tip: 'Choose comfort and earthy tones for grounded confidence. Quality fabrics matter most.' },
  'Gemini':    { overall: '★★★★☆', love: '★★★★★', career: '★★★★☆', health: '★★★☆☆', tip: 'Social energy peaks! Bright colors and layered looks make you the center of attention.' },
  'Cancer':    { overall: '★★★☆☆', love: '★★★★☆', career: '★★★☆☆', health: '★★★★★', tip: 'Emotional sensitivity calls for soft textures and gentle pastels that nurture your spirit.' },
  'Leo':       { overall: '★★★★★', love: '★★★★☆', career: '★★★★★', health: '★★★★☆', tip: 'Your spotlight day! Gold or warm accents boost your aura — wear confidence proudly.' },
  'Virgo':     { overall: '★★★★☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★☆', tip: 'Details matter. Clean lines and minimal palettes bring order and good fortune.' },
  'Libra':     { overall: '★★★★★', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: 'Harmony & beauty rule today. Pink-purple tones and elegant curves enhance your charm.' },
  'Scorpio':   { overall: '★★★★☆', love: '★★★★★', career: '★★★★☆', health: '★★★☆☆', tip: 'Mystery is your weapon. Deep purples or black tones amplify your presence for key moments.' },
  'Sagittarius':{ overall: '★★★★☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★★', tip: 'Freedom calls! Blue tones and relaxed silhouettes fuel your adventurous spirit.' },
  'Capricorn': { overall: '★★★☆☆', love: '★★★☆☆', career: '★★★★★', health: '★★★★☆', tip: 'Steady progress. Dark neutrals and sharp tailoring project professionalism and authority.' },
  'Aquarius':  { overall: '★★★★☆', love: '★★★★☆', career: '★★★★★', health: '★★★☆☆', tip: 'Creative breakthrough! Electric blue or futuristic metallic elements set you apart.' },
  'Pisces':    { overall: '★★★★★', love: '★★★★★', career: '★★★☆☆', health: '★★★★☆', tip: 'Intuition flows strong. Ocean blues, gradients, and dreamy textures align with your inner energy.' },
}

const weatherIcons: Record<string, string> = { sunny: '☀️', cloudy: '⛅', rainy: '🌧️', overcast: '☁️', windy: '🌬️' }

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (<span key={s} className={`text-xs ${s <= Math.round(score) ? 'text-amber-400' : 'text-gray-300'}`}>★</span>))}
    </div>
  )
}

function ClothingCard({ item, label }: { item: { imageUrl: string; name: string }; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-surface-container shadow-sm">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground font-label uppercase tracking-wider">{label}</span>
    </div>
  )
}

function OutfitCard({ outfit, isActive, isEn }: { outfit: OOTDOutfit; isActive: boolean; isEn: boolean }) {
  const items = outfit.items
  const labels: Record<string,string> = isEn 
    ? {'连衣裙':'Dress','上衣':'Top','外套':'Outerwear','下装':'Bottom','鞋子':'Shoes','配饰':'Accessory'}
    : {'连衣裙':'连衣裙','上衣':'上衣','外套':'外套','下装':'下装','鞋子':'鞋子','配饰':'配饰'}
  return (
    <div className={`rounded-3xl transition-all duration-300 overflow-hidden ${isActive ? 'shadow-xl scale-100 bg-surface-container' : 'shadow-md scale-95 opacity-70 bg-surface-container-low'}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-serif text-lg font-light editorial-title">{outfit.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs rounded-full px-3 py-1 bg-primary/10 text-primary">{outfit.style}</span>
              <span className="text-xs rounded-full px-3 py-1 bg-surface-container-high text-on-surface-variant">{outfit.occasion}</span>
            </div>
          </div>
          <div className="text-right">
            <StarRating score={outfit.score}/>
            <span className="text-xs text-muted-foreground mt-1 block">{outfit.score.toFixed(1)}{isEn?'':'分'}</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center py-4 flex-wrap">
          {items.dress && <ClothingCard item={items.dress} label={labels['连衣裙']}/>}
          {items.top && <ClothingCard item={items.top} label={labels['上衣']}/>}
          {items.outerwear && <ClothingCard item={items.outerwear} label={labels['外套']}/>}
          {items.bottom && <ClothingCard item={items.bottom} label={labels['下装']}/>}
          {items.shoes && <ClothingCard item={items.shoes} label={labels['鞋子']}/>}
          {items.accessories?.map((a,i)=><ClothingCard key={i} item={a} label={labels['配饰']}/>)}
        </div>
        <div className="mt-5 p-4 rounded-2xl bg-surface-container-low">
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-semibold text-primary">✨ {isEn ? 'AI Comment' : 'AI点评'}:</span> {outfit.aiComment}
          </p>
          {outfit.luckyReason && <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">🍀{outfit.luckyReason}</p>}
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
  const { showToast } = useToast()
  const [initialLoading, setInitialLoading] = useState(true)
  const [showEmptyWardrobeTip, setShowEmptyWardrobeTip] = useState(false)
  
  // 引入灵感 - 拖拽/上传状态
  const [museImage, setMuseImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEn = i18n.language === 'en'
  
  // 获取用户当前星座
  const userZodiac: ZodiacSign = user?.zodiac || '天秤座'
  // 获取统一的幸运色信息
  const luckyColorInfo = ZODIAC_LUCKY_COLORS[userZodiac]
  // 获取运势信息
  const fortuneInfo = isEn 
    ? ZODIAC_FORTUNES_EN[userZodiac as keyof typeof ZODIAC_FORTUNES_EN] || ZODIAC_FORTUNES_EN['Libra']
    : ZODIAC_FORTUNES_ZH[userZodiac] || ZODIAC_FORTUNES_ZH['天秤座']

  useEffect(() => {
    if (!user) return
    const lang: Lang = isEn ? 'en' : 'zh'
    ;(async () => {
      try { const [w,f] = await Promise.all([fetchWeather(user.city||'上海',lang),fetchFortune(user.zodiac||'天秤座',lang)]); setWeather(w); setFortune(f) }
      catch {/*silent*/}
      finally { setInitialLoading(false) }
    })()
  },[user,setWeather,setFortune,isEn])

  // 处理图片上传/拖拽
  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast(isEn ? 'Please upload an image file' : '请上传图片文件')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setMuseImage(reader.result as string)
      showToast(isEn ? 'Muse image uploaded! AI will generate around this piece' : '灵感图片已上传！AI将围绕此单品生成穿搭方案')
    }
    reader.readAsDataURL(file)
  }, [isEn, showToast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }, [handleImageUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageUpload(file)
  }, [handleImageUpload])

  const handleGenerate = async () => {
    if (wardrobeItems.length===0){setShowEmptyWardrobeTip(true);return}
    if(status==='loading')return
    setStatus('loading'); setError(null)
    const lang: Lang=isEn?'en':'zh'
    try { const r=await generateOOTD(wardrobeItems,weather!,fortune!,lang); setOutfits(r); setStatus('success'); setActiveOutfitIndex(0) }
    catch { setError(isEn?'Generation failed':'生成失败'); setStatus('error') }
  }

  // 根据幸运色生成色彩匹配数据
  const colorMatches = getColorMatches(luckyColorInfo.hex, isEn)

  // 从衣橱中筛选幸运色单品（基于颜色名近似匹配）
  const luckyColorName = isEn ? luckyColorInfo.nameEn : luckyColorInfo.nameZh
  const luckyWardrobeItems = wardrobeItems.filter(item => {
    // 简单的颜色关键词匹配
    const colorLower = item.color.toLowerCase()
    const keywords = getLuckyColorKeywords(luckyColorInfo.hex)
    return keywords.some(kw => colorLower.includes(kw.toLowerCase()))
  }).slice(0, 4)

  // 如果没有匹配到，随机推荐几件作为占位
  const displayLuckyItems = luckyWardrobeItems.length > 0 
    ? luckyWardrobeItems 
    : wardrobeItems.slice(0, Math.min(4, wardrobeItems.length))

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-background">
      <div className="relative max-w-screen-xl mx-auto px-6 md:px-16 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content - 8 cols */}
          <div className="lg:col-span-8 space-y-12">
            <section className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-headline text-on-surface mb-4 tracking-tight">
                {isEn ? "The Oracle's Eye" : '神谕之眼'}
              </h1>
              <p className="font-body text-on-surface-variant max-w-xl leading-relaxed italic opacity-80">
                {isEn 
                  ? 'Consult the celestial alignment for your next silhouette. Upload a garment or let the cosmos browse your curated collection.'
                  : '咨询天体对齐，为你的下一个造型寻找灵感。上传一件单品，或让宇宙浏览你的精选收藏。'}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
              {/* 引入灵感 - 支持拖拽和点击上传 */}
              <div
                className={`bg-surface-container-low group cursor-pointer relative overflow-hidden rounded-[2rem] min-h-[340px] flex flex-col items-center justify-center text-center transition-all duration-300 border-2 ${
                  isDragOver 
                    ? 'border-primary bg-primary/5 scale-[1.02]' 
                    : museImage 
                      ? 'border-solid border-outline-variant/30 p-2'
                      : 'border-dashed border-outline-variant/50 hover:border-primary/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !museImage && fileInputRef.current?.click()}
              >
                {museImage ? (
                  /* 已上传图片预览 */
                  <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden">
                    <img src={museImage} alt="Muse" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-0 right-0 px-6">
                      <p className="font-headline text-lg text-white mb-1">
                        {isEn ? 'Inspiration Loaded' : '灵感已加载'}
                      </p>
                      <p className="font-label text-xs text-white/80 uppercase tracking-widest">
                        {isEn ? 'AI will generate around this garment' : 'AI将围绕此单品生成穿搭方案'}
                      </p>
                    </div>
                    {/* 替换按钮 */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setMuseImage(null) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                      title={isEn ? 'Replace image' : '更换图片'}
                    >
                      <svg className="w-4 h-4 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* 上传提示区 */
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                    <div className="relative z-10 p-8">
                      <span className={`material-symbols-outlined text-5xl mb-4 block transition-colors ${isDragOver ? 'text-primary' : 'text-primary'}`}>
                        add_photo_alternate
                      </span>
                      <h3 className="font-headline text-2xl mb-2 text-primary">
                        {isEn ? 'Introduce a Muse' : '引入灵感'}
                      </h3>
                      <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                        {isDragOver
                          ? (isEn ? 'Release to upload' : '松手上传')
                          : (isEn ? 'Drag or tap to upload garment' : '拖拽或点击上传单品')
                        }
                      </p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="bg-surface-container-highest rounded-[2rem] p-8 flex flex-col justify-between items-start min-h-[340px] relative overflow-hidden group">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"/>
                <div>
                  <span className="material-symbols-outlined text-3xl text-primary mb-4">checkroom</span>
                  <h3 className="font-headline text-3xl text-on-surface leading-tight">
                    {isEn ? (
                      <>Generate from your<br/>current collection</>
                    ) : (
                      <>从你的<br/>当前收藏生成</>
                    )}
                  </h3>
                </div>
                <button onClick={handleGenerate} disabled={status==='loading'||!weather||!fortune}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-label text-sm uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95 flex items-center gap-3 disabled:opacity-50">
                  {status==='loading'?<><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>{t('home.generating')}</span></>:<><span>{t('home.generate')}</span><span className="material-symbols-outlined text-sm">auto_awesome</span></>}
                </button>
              </div>
            </div>

            {/* Chromatic Alignment Section - 统一使用星座幸运色 */}
            <section className="bg-surface-container rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative animate-slide-up">
              <div className="absolute top-0 right-0 p-8"><span className="material-symbols-outlined text-secondary opacity-30 text-8xl" style={{fontWeight:100}}>star_half</span></div>
              <div className="relative z-10">
                <h2 className="font-headline text-3xl mb-8">
                  {isEn ? 'Chromatic Alignment' : '色彩对齐'}
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  {/* 左侧：幸运色大圆 - 使用统一的星座幸运色 */}
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-full flex items-center justify-center editorial-shadow p-2 mx-auto max-w-[240px]" style={{ backgroundColor: luckyColorInfo.hex + '30' }}>
                      <div className="w-full h-full rounded-full flex flex-col items-center justify-center text-center" style={{ backgroundColor: luckyColorInfo.hex }}>
                        <span className="font-label text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: '#fff', opacity: 0.85 }}>
                          {isEn ? 'Lucky Transit' : '幸运过境'}
                        </span>
                        <span className="font-headline text-4xl text-white">
                          {isEn ? luckyColorInfo.nameEn : luckyColorInfo.nameZh}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 右侧：匹配衣物卡片（展示用户衣橱中的幸运色单品） */}
                  <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                    {displayLuckyItems.length > 0 ? displayLuckyItems.map((item, i) => (
                      <div key={item.id} className="bg-surface p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant truncate">{item.name}</div>
                          <div className="font-body text-sm font-bold truncate">
                            {item.color}
                            {i === 0 && <span className="ml-2 text-[10px] font-label text-primary">{isEn ? 'Best Match' : '最佳匹配'}</span>}
                          </div>
                        </div>
                      </div>
                    )) : colorMatches.map((m, i) => (
                      <div key={i} className="bg-surface p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{backgroundColor:m.hex}}/>
                        <div>
                          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{m.name}</div>
                          <div className="font-body text-sm font-bold">
                            {m.percent ? `${m.percent}% ${isEn ? 'Match' : '匹配'}` : (isEn ? 'Recommended' : '推荐')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Active Analysis 4 cols */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-low rounded-[2rem] p-8 editorial-shadow">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"/>
                <h3 className="font-label text-xs uppercase tracking-[0.25em] text-primary font-bold">
                  {isEn ? 'Active Analysis' : '活跃分析'}
                </h3>
              </div>
              
              {/* 今日星座运势 - 替代原来的面料检测 */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h4 className="font-headline text-xl">{isEn ? 'Daily Horoscope' : '今日星象'}</h4>
                  <span className="text-xl">{ZODIAC_SYMBOLS[userZodiac]}</span>
                </div>
                
                {/* 运势评分 */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-label text-on-surface-variant">{isEn ? 'Overall' : '整体运势'}</span>
                    <span className="text-xs font-medium text-on-surface">{fortuneInfo.overall}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-label text-on-surface-variant">{isEn ? 'Love 💕' : '爱情 💕'}</span>
                    <span className="text-xs font-medium text-pink-500">{fortuneInfo.love}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-label text-on-surface-variant">{isEn ? 'Career 💼' : '事业 💼'}</span>
                    <span className="text-xs font-medium text-blue-500">{fortuneInfo.career}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-label text-on-surface-variant">{isEn ? 'Health 🌿' : '健康 🌿'}</span>
                    <span className="text-xs font-medium text-green-500">{fortuneInfo.health}</span>
                  </div>
                </div>

                {/* 今日建议 */}
                <div className="mt-4 p-4 rounded-2xl bg-surface italic text-sm text-on-surface-variant leading-relaxed">
                  "{fortuneInfo.tip}"
                </div>
              </div>

              {/* Style DNA */}
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h4 className="font-headline text-xl">{isEn ? 'Style DNA' : '风格基因'}</h4>
                  <span className="material-symbols-outlined text-on-surface-variant">biotech</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[10px] font-label uppercase tracking-widest font-bold">
                    {isEn ? 'Ethereal Minimalist' : '空灵极简'}
                  </span>
                  <span className="px-4 py-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-label uppercase tracking-widest font-bold">
                    {isEn ? 'Earth Core' : '大地核心'}
                  </span>
                  <span className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-full text-[10px] font-label uppercase tracking-widest font-bold">
                    {isEn ? 'Structural Softness' : '结构柔和'}
                  </span>
                </div>
                <div className="mt-8 p-6 bg-surface rounded-2xl italic text-sm text-on-surface-variant leading-relaxed">
                  {isEn 
                    ? '"Your current wardrobe trajectory suggests a \'Lunar Transition\' phase. We recommend prioritizing high-contrast textures over saturated colors."'
                    : '"你当前的衣橱轨迹显示正处于\'月相过渡\'阶段。我们建议优先选择高对比度质感而非饱和色彩。"'}

                </div>
              </div>
            </div>

            {!initialLoading && (
              <>
                {weather && (
                  <div className="bg-surface-container-low rounded-[2rem] p-8 editorial-shadow">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="material-symbols-outlined text-primary">wb_sunny</span>
                      <h3 className="font-label text-xs uppercase tracking-[0.25em] text-primary font-bold">
                        {isEn ? 'Weather' : '天气'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl">{weatherIcons[weather.conditionCode]||'🌤️'}</span>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase tracking-wider">{weather.city}</p>
                        <p className="font-serif text-3xl text-primary">{weather.temperature.current}°</p>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant">{weather.temperature.min}° ~ {weather.temperature.max}°</p>
                  </div>
                )}
                
                {/* 星座卡片 - 统一幸运色信息 */}
                {fortune && (
                  <div className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-8 relative overflow-hidden group">
                    <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400"/>
                    <div className="relative z-10">
                      <span className="material-symbols-outlined text-tertiary-fixed mb-4">auto_awesome</span>
                      <h4 className="font-serif text-2xl mb-2">{isEn&&zodiacTranslations[fortune.zodiac as ZodiacSign]?zodiacTranslations[fortune.zodiac as ZodiacSign].en:fortune.zodiac}</h4>
                      
                      {/* 统一的幸运色显示 - 色块和文字一致 */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white/30 shadow-sm flex-shrink-0" style={{backgroundColor: luckyColorInfo.hex}}/>
                        <p className="text-sm font-bold">
                          {isEn ? luckyColorInfo.nameEn : luckyColorInfo.nameZh}
                        </p>
                      </div>
                      
                      <p className="text-sm opacity-90 leading-relaxed">
                        {isEn 
                          ? `Today's lucky color is ${luckyColorInfo.nameEn}. Wearing ${luckyColorInfo.nameEn.toLowerCase()} items can enhance your fortune ✨`
                          : `今日幸运色为${luckyColorInfo.nameZh}，穿着${luckyColorInfo.nameZh}单品可提升运势 ✨`
                        }
                      </p>
                    </div>
                  </div>
                )}

                {/* 宇宙指引 - 保留 */}
                <div className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-8 relative overflow-hidden group">
                  <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400"/>
                  <div className="relative z-10">
                    <span className="material-symbols-outlined text-tertiary-fixed mb-4">lightbulb</span>
                    <h4 className="font-headline text-2xl mb-2">{isEn ? 'Cosmic Guidance' : '宇宙指引'}</h4>
                    <p className="font-body text-sm opacity-90 leading-relaxed">
                      {isEn 
                        ? 'Mercury is in retrograde. Opt for familiar silhouettes and vintage layers today to maintain your energetic grounding.'
                        : '水星正在逆行。今天选择熟悉的轮廓和复古叠穿，以保持你的能量接地。'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>

        {error && <div className="bg-destructive/10 text-destructive rounded-2xl p-4 text-sm text-center mt-8">{error}</div>}

        {status==='success'&&outfits.length>0&&(
          <div className="space-y-5 animate-slide-up mt-12">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-light text-foreground editorial-title">{t('home.todayOutfit')}</h2>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{outfits.length} {isEn ? 'Plans' : '套方案'}</span>
            </div>
            <div className="flex gap-2">
              {outfits.map((o,i)=>(
                <button key={o.id} onClick={()=>setActiveOutfitIndex(i)} className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-medium transition-all ${activeOutfitIndex===i?'bg-primary text-primary-foreground shadow-md':'bg-surface-container text-muted-foreground hover:bg-surface-container-high'}`}>
                  {isEn ? `Plan ${i+1}` : `方案 ${i+1}`}
                </button>
              ))}
            </div>
            {outfits.map((o,i)=><div key={o.id} className={`transition-all duration-300 ${i===activeOutfitIndex?'block':'hidden'}`}><OutfitCard outfit={o} isActive={true} isEn={isEn}/></div>)}
            <div className="flex gap-3 pb-4">
              <Button variant="outline" className="flex-1 rounded-2xl gap-2 h-12 hover:bg-surface-container" onClick={handleGenerate}>🔄 {isEn ? 'Regenerate' : '重新生成'}</Button>
              <Button className="flex-1 rounded-2xl gap-2 h-12 bg-primary hover:bg-primary/90">📤 {isEn ? 'Share' : '分享'}</Button>
            </div>
          </div>
        )}
      </div>

      {showEmptyWardrobeTip&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={()=>setShowEmptyWardrobeTip(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
          <div className="relative w-full max-w-sm bg-background rounded-3xl p-6 shadow-2xl animate-slide-up" onClick={(e)=>e.stopPropagation()}>
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl mb-4">👗</span>
              <h3 className="text-xl font-serif font-light editorial-title mb-2">{t('home.emptyWardrobe.title')}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t('home.emptyWardrobe.message')}</p>
              <div className="flex gap-3 w-full">
                <button onClick={()=>setShowEmptyWardrobeTip(false)} className="flex-1 py-3 rounded-2xl bg-surface-container text-foreground font-medium hover:bg-surface-container-high transition-colors">{t('common.cancel')}</button>
                <button onClick={()=>{setShowEmptyWardrobeTip(false);window.location.href='/wardrobe'}} className="flex-1 py-3 rounded-2xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors">{t('home.emptyWardrobe.action')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 辅助函数：根据hex颜色获取匹配的关键词
function getLuckyColorKeywords(hex: string): string[] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  // 简单的颜色分类
  if (r > 200 && g < 100 && b < 100) return ['红', 'red']
  if (r > 180 && g > 120 && b < 100) return ['黄', '金', '橙', 'yellow', 'gold', 'orange']
  if (g > 150 && r < 100 && b < 150) return ['绿', 'green']
  if (b > 150 && r < 150 && g < 150) return ['蓝', 'blue']
  if (r > 140 && g < 100 && b > 140) return ['紫', 'purple']
  if (r > 180 && g > 170 && b > 170) return ['白', '白', 'white', '银']
  if (r < 80 && g < 80 && b < 80) return ['黑', '黑', 'black', '深']
  if (r > 220 && g < 130 && b > 160) return ['粉', 'pink', '玫']
  if (Math.abs(r-g) < 30 && Math.abs(g-b) < 30 && r < 150) return ['灰', '灰', 'gray', '棕', 'brown']
  
  return []
}
