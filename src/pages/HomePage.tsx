import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useOOTDStore, useWardrobeStore } from '@/store'
import { fetchWeather, fetchFortune, generateOOTD } from '@/services/mockApi'
import type { Lang } from '@/services/mockApi'
import { Button } from '@/components/ui/button'
import type { OOTDOutfit, ZodiacSign } from '@/types'

const zodiacTranslations: Record<ZodiacSign, { zh: string; en: string }> = {
  '白羊座': { zh: '白羊座', en: 'Aries' }, '金牛座': { zh: '金牛座', en: 'Taurus' },
  '双子座': { zh: '双子座', en: 'Gemini' }, '巨蟹座': { zh: '巨蟹座', en: 'Cancer' },
  '狮子座': { zh: '狮子座', en: 'Leo' }, '处女座': { zh: '处女座', en: 'Virgo' },
  '天秤座': { zh: '天秤座', en: 'Libra' }, '天蝎座': { zh: '天蝎座', en: 'Scorpio' },
  '射手座': { zh: '射手座', en: 'Sagittarius' }, '摩羯座': { zh: '摩羯座', en: 'Capricorn' },
  '水瓶座': { zh: '水瓶座', en: 'Aquarius' }, '双鱼座': { zh: '双鱼座', en: 'Pisces' },
}

const colorTranslations: Record<string, { zh: string; en: string }> = {
  '玫瑰粉': { zh: '玫瑰粉', en: 'Rose Pink' }, '天空蓝': { zh: '天空蓝', en: 'Sky Blue' },
  '薄荷绿': { zh: '薄荷绿', en: 'Mint Green' }, '奶油白': { zh: '奶油白', en: 'Cream White' },
  '珊瑚橙': { zh: '珊瑚橙', en: 'Coral Orange' }, '紫罗兰': { zh: '紫罗兰', en: 'Violet' },
  '金色': { zh: '金色', en: 'Gold' }, '米白': { zh: '米白', en: 'Beige' },
}

// Chromatic color match data
const COLOR_MATCHES_ZH = [
  { name: '丝巾', percent: 98, hex: '#E9C349' },
  { name: '亚麻长裤', percent: 82, hex: '#C5A02E' },
  { name: '羊毛大衣', percent: 75, hex: '#735C00' },
  { name: '棉质T恤', percent: null, hex: '#FED65B', recommended: true },
]

const COLOR_MATCHES_EN = [
  { name: 'Silk Scarf', percent: 98, hex: '#E9C349' },
  { name: 'Linen Trousers', percent: 82, hex: '#C5A02E' },
  { name: 'Wool Coat', percent: 75, hex: '#735C00' },
  { name: 'Cotton Tee', percent: null, hex: '#FED65B', recommended: true },
]

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
  const [initialLoading, setInitialLoading] = useState(true)
  const [showEmptyWardrobeTip, setShowEmptyWardrobeTip] = useState(false)
  const isEn = i18n.language === 'en'

  useEffect(() => {
    if (!user) return
    const lang: Lang = isEn ? 'en' : 'zh'
    ;(async () => {
      try { const [w,f] = await Promise.all([fetchWeather(user.city||'上海',lang),fetchFortune(user.zodiac||'天秤座',lang)]); setWeather(w); setFortune(f) }
      catch {/*silent*/}
      finally { setInitialLoading(false) }
    })()
  },[user,setWeather,setFortune,isEn])

  const handleGenerate = async () => {
    if (wardrobeItems.length===0){setShowEmptyWardrobeTip(true);return}
    if(status==='loading')return
    setStatus('loading'); setError(null)
    const lang: Lang=isEn?'en':'zh'
    try { const r=await generateOOTD(wardrobeItems,weather!,fortune!,lang); setOutfits(r); setStatus('success'); setActiveOutfitIndex(0) }
    catch { setError(isEn?'Generation failed':'生成失败'); setStatus('error') }
  }

  const colorMatches = isEn ? COLOR_MATCHES_EN : COLOR_MATCHES_ZH

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
              <div className="bg-surface-container-low group cursor-pointer relative overflow-hidden rounded-[2rem] p-1 border-2 border-dashed border-outline-variant/50 hover:border-primary/50 transition-all duration-500 min-h-[340px] flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 p-8">
                  <span className="material-symbols-outlined text-5xl text-primary mb-4 block">add_photo_alternate</span>
                  <h3 className="font-headline text-2xl mb-2 text-primary">
                    {isEn ? 'Introduce a Muse' : '引入灵感'}
                  </h3>
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
                    {isEn ? 'Drag or tap to upload garment' : '拖拽或点击上传单品'}
                  </p>
                </div>
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

            {/* Chromatic Alignment Section */}
            <section className="bg-surface-container rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative animate-slide-up">
              <div className="absolute top-0 right-0 p-8"><span className="material-symbols-outlined text-secondary opacity-30 text-8xl" style={{fontWeight:100}}>star_half</span></div>
              <div className="relative z-10">
                <h2 className="font-headline text-3xl mb-8">
                  {isEn ? 'Chromatic Alignment' : '色彩对齐'}
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square rounded-full bg-secondary-container flex items-center justify-center editorial-shadow p-2 mx-auto max-w-[240px]">
                      <div className="w-full h-full rounded-full border-4 border-white/20 flex flex-col items-center justify-center text-center">
                        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-secondary-fixed-variant mb-2">
                          {isEn ? 'Lucky Transit' : '幸运过境'}
                        </span>
                        <span className="font-headline text-4xl text-on-secondary-fixed">
                          {isEn ? 'Zodiac Gold' : '星座金'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
                    {colorMatches.map((m,i)=>(
                      <div key={i} className="bg-surface p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg" style={{backgroundColor:m.hex}}/>
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
              
              {/* Fabric Detection */}
              <div className="mb-10">
                <div className="flex justify-between items-end mb-4">
                  <h4 className="font-headline text-xl">{isEn ? 'Fabric Detection' : '面料检测'}</h4>
                  <span className="material-symbols-outlined text-on-surface-variant">texture</span>
                </div>
                {[
                  { n: isEn ? 'Organic Cotton' : '有机棉', p: 45 },
                  { n: isEn ? 'Raw Silk' : '生丝', p: 32 },
                  { n: isEn ? 'Recycled Wool' : '再生羊毛', p: 23 },
                ].map((f) => (
                  <div key={f.n} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs font-label uppercase tracking-widest mb-2 text-on-surface-variant">
                      <span>{f.n}</span><span>{f.p}%</span>
                    </div>
                    <div className="h-1 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{width:`${f.p}%`}}/>
                    </div>
                  </div>
                ))}
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
                {fortune && (
                  <div className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-8 relative overflow-hidden group">
                    <img alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400"/>
                    <div className="relative z-10">
                      <span className="material-symbols-outlined text-tertiary-fixed mb-4">auto_awesome</span>
                      <h4 className="font-serif text-2xl mb-2">{isEn&&zodiacTranslations[fortune.zodiac as ZodiacSign]?zodiacTranslations[fortune.zodiac as ZodiacSign].en:fortune.zodiac}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white/30 shadow-sm flex-shrink-0" style={{backgroundColor:'#EC4899'}}/>
                        <p className="text-sm font-bold">{isEn&&colorTranslations[fortune.luckyColor]?colorTranslations[fortune.luckyColor].en:fortune.luckyColor}</p>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed">{fortune.todayTip}</p>
                    </div>
                  </div>
                )}
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
