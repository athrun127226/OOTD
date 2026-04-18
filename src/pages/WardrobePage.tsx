import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWardrobeStore } from '@/store'
import { Button } from '@/components/ui/button'
import type { ClothingCategory, ClothingItem } from '@/types'
import { getDefaultWardrobeItems } from '@/services/mockApi'

// 分类（内部使用中文，显示时翻译）
const CATEGORIES_ZH: ClothingCategory[] = ['上衣', '下装', '外套', '连衣裙', '鞋子', '配饰']

// 天体标签映射 - 参考设计配色
const CELESTIAL_TAGS: { key: string; label: string; bg: string; text: string }[] = [
  { key: 'solar', label: 'SOLAR', bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed' },
  { key: 'lunar', label: 'LUNAR', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed' },
  { key: 'saturnian', label: 'SATURNIAN', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed-variant' },
  { key: 'venusian', label: 'VENUSIAN', bg: 'bg-secondary-fixed-dim', text: 'text-on-secondary-fixed-variant' },
]

// 根据索引获取天体标签
function getCelestialTag(index: number) {
  return CELESTIAL_TAGS[index % CELESTIAL_TAGS.length]
}

const categoryEmojis: Record<ClothingCategory, string> = {
  '上衣': '👕',
  '下装': '👖',
  '外套': '🧥',
  '连衣裙': '👗',
  '鞋子': '👟',
  '配饰': '💍',
}

// 分类翻译映射
const categoryTranslations: Record<ClothingCategory, { zh: string; en: string }> = {
  '上衣': { zh: '上衣', en: 'Tops' },
  '下装': { zh: '下装', en: 'Bottoms' },
  '外套': { zh: '外套', en: 'Outerwear' },
  '连衣裙': { zh: '连衣裙', en: 'Dresses' },
  '鞋子': { zh: '鞋子', en: 'Shoes' },
  '配饰': { zh: '配饰', en: 'Accessories' },
}

// 季节选项
const SEASONS_ZH = ['春季', '夏季', '秋季', '冬季']
const SEASONS_EN = ['Spring', 'Summer', 'Autumn', 'Winter']

// 天气选项
const WEATHERS_ZH = ['晴天', '多云', '雨天', '大风']
const WEATHERS_EN = ['Sunny', 'Cloudy', 'Rainy', 'Windy']

function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (item: ClothingItem) => void }) {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClothingCategory>('上衣')
  const [color, setColor] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEn = i18n.language === 'en'
  const categories = CATEGORIES_ZH

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!name.trim() || !color.trim()) return
    
    // 统一存储为中文分类（内部使用）
    const newItem: ClothingItem = {
      id: 'item_' + Date.now(),
      name,
      category: category, // 已经是中文分类
      color,
      style: isEn ? 'Basic' : '百搭',
      imageUrl: previewUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=300&fit=crop`,
      tags: [color, category],
      createdAt: new Date().toISOString(),
    }
    onUpload(newItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-background rounded-3xl p-6 space-y-5 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-light editorial-title">{t('wardrobe.addModalTitle')}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
        </div>

        {/* 图片上传区 */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-outline/30 rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-surface-container-low"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-4xl mb-2">📸</span>
              <p className="text-sm text-muted-foreground font-label">{t('wardrobe.uploadImage')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isEn ? 'Solid background works best' : '建议纯色背景拍摄效果更佳'}
              </p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {/* 表单 */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block font-label">{t('wardrobe.nameLabel') || 'Name'}</label>
            <input
              className="w-full h-11 rounded-2xl border border-outline/20 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder={isEn ? 'e.g., White T-Shirt' : '如：白色T恤、牛仔裤'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block font-label">{t('wardrobe.category')}</label>
              <select
                className="w-full h-11 rounded-2xl border border-outline/20 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryEmojis[c]} {isEn ? categoryTranslations[c].en : categoryTranslations[c].zh}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block font-label">{t('wardrobe.color')}</label>
              <input
                className="w-full h-11 rounded-2xl border border-outline/20 bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder={isEn ? 'e.g., White' : '如：白色、深蓝'}
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!name.trim() || !color.trim()}
          className="w-full rounded-2xl h-12 bg-primary hover:bg-primary/90"
        >
          {t('wardrobe.saveItem')}
        </Button>
      </div>
    </div>
  )
}

// 下拉筛选组件
function FilterDropdown({
  label,
  options,
  selectedValue,
  onSelect,
  isEn,
}: {
  label: string
  options: { value: string; label: string }[]
  selectedValue: string | null
  onSelect: (value: string | null) => void
  isEn: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-5 py-2.5 rounded-xl font-label flex items-center gap-2 transition-colors ${
          selectedValue
            ? 'bg-primary text-on-primary shadow-sm shadow-primary/20'
            : 'bg-surface-container-low text-on-surface hover:bg-surface-variant'
        }`}
      >
        <span>{selectedValue || label}</span>
        <span className={`material-symbols-outlined text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <>
          {/* 遮罩层，点击关闭 */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          
          {/* 下拉菜单 */}
          <div className="absolute top-full mt-1 left-0 z-20 min-w-[160px] bg-surface-container-highest rounded-xl shadow-xl border border-outline-variant/10 overflow-hidden animate-fade-in">
            {/* 全部选项 */}
            <button
              onClick={() => { onSelect(null); setIsOpen(false) }}
              className={`w-full px-4 py-2.5 text-left text-sm font-label hover:bg-primary/5 transition-colors ${
                selectedValue === null ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              {isEn ? 'All' : '全部'}
            </button>
            
            {/* 分隔线 */}
            <div className="border-t border-outline-variant/10 my-1" />
            
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onSelect(opt.value); setIsOpen(false) }}
                className={`w-full px-4 py-2.5 text-left text-sm font-label hover:bg-primary/5 transition-colors ${
                  selectedValue === opt.value ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function WardrobePage() {
  const { t, i18n } = useTranslation()
  const { items, addItem, removeItem } = useWardrobeStore()
  const [showUpload, setShowUpload] = useState(false)
  const [showGuide, setShowGuide] = useState(items.length === 0)

  // 筛选状态
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null)

  const isEn = i18n.language === 'en'

  // 季节选项
  const seasonOptions = SEASONS_ZH.map((v, i) => ({
    value: v,
    label: isEn ? SEASONS_EN[i] : v,
  }))

  // 类型选项（即衣物分类）
  const typeOptions = CATEGORIES_ZH.map((c) => ({
    value: c,
    label: isEn ? categoryTranslations[c].en : c,
  }))

  // 天气选项
  const weatherOptions = WEATHERS_ZH.map((v, i) => ({
    value: v,
    label: isEn ? WEATHERS_EN[i] : v,
  }))

  // 应用所有筛选条件
  let filtered = [...items]

  if (selectedType) {
    filtered = filtered.filter(i => i.category === selectedType)
  }
  // 季节和天气筛选基于 tags 或模拟数据
  if (selectedSeason || selectedWeather) {
    // 如果有筛选条件但当前没有匹配项，可以展示全部或提示用户
    // 这里做简单处理：季节和天气作为展示性筛选（未来可接入更复杂的匹配逻辑）
    // 目前保留为 UI 层面的筛选体验
  }

  const handleLoadDefaults = () => {
    const defaults = getDefaultWardrobeItems()
    defaults.forEach((item) => addItem(item))
    setShowGuide(false)
  }

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-background">
      <div className="w-full max-w-screen-2xl mx-auto px-6 md:px-16 pt-8 md:pt-12 pb-32">
        {/* 编辑风格大标题 */}
        <section className="mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-serif font-light text-foreground mb-4 tracking-tight editorial-title">
            {isEn ? 'The Wardrobe' : '我的穿搭集'}
          </h1>
          <p className="text-on-surface-variant max-w-2xl font-serif italic leading-relaxed opacity-80">
            {isEn 
              ? 'Your personal curated collection, where earthly质感 meets celestial inspiration. Each outfit you create becomes a chapter in your evolving aesthetic narrative.'
              : '你的个人风格精选集，尘世质感与天体灵感的交汇。每一套穿搭都是你不断演变的审美叙事中的一个篇章。'}
          </p>
        </section>

        {/* 筛选栏 - 编辑风格（去掉频率） */}
        <section className="mb-10 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label={isEn ? 'Season' : '季节'}
              options={seasonOptions}
              selectedValue={selectedSeason}
              onSelect={setSelectedSeason}
              isEn={isEn}
            />
            <FilterDropdown
              label={isEn ? 'Type' : '类型'}
              options={typeOptions}
              selectedValue={selectedType}
              onSelect={setSelectedType}
              isEn={isEn}
            />
            <FilterDropdown
              label={isEn ? 'Weather' : '天气'}
              options={weatherOptions}
              selectedValue={selectedWeather}
              onSelect={setSelectedWeather}
              isEn={isEn}
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 text-primary font-bold font-label hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined">add_circle</span>
            {isEn ? 'UPLOAD NEW PIECE' : '上传新单品'}
          </button>
        </section>

        {/* 当前筛选状态指示 */}
        {(selectedSeason || selectedType || selectedWeather) && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-label text-on-surface-variant">{isEn ? 'Filters:' : '当前筛选：'}</span>
            {selectedSeason && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-label">
                {isEn ? SEASONS_EN[SEASONS_ZH.indexOf(selectedSeason)] ?? selectedSeason : selectedSeason}
                <button onClick={() => setSelectedSeason(null)} className="hover:text-red-400 ml-0.5">×</button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-label">
                {isEn ? categoryTranslations[selectedType as ClothingCategory]?.en ?? selectedType : selectedType}
                <button onClick={() => setSelectedType(null)} className="hover:text-red-400 ml-0.5">×</button>
              </span>
            )}
            {selectedWeather && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-label">
                {isEn ? WEATHERS_EN[WEATHERS_ZH.indexOf(selectedWeather)] ?? selectedWeather : selectedWeather}
                <button onClick={() => setSelectedWeather(null)} className="hover:text-red-400 ml-0.5">×</button>
              </span>
            )}
            <button
              onClick={() => { setSelectedSeason(null); setSelectedType(null); setSelectedWeather(null); }}
              className="text-[11px] font-label text-on-surface-variant hover:text-red-500 underline"
            >
              {isEn ? 'Clear All' : '清除全部'}
            </button>
          </div>
        )}

        {/* 空衣橱引导 */}
        {items.length === 0 && showGuide && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <span className="text-7xl mb-6 animate-float">👗</span>
            <h3 className="text-xl font-serif font-light editorial-title mb-3">{t('wardrobe.noItems')}</h3>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs font-label">
              {t('wardrobe.addItemTip')}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleLoadDefaults}
                variant="outline"
                className="rounded-2xl h-12 px-6 border-outline/30"
              >
                📦 {isEn ? 'Load Sample Wardrobe' : '加载示例衣橱'}
              </Button>
              <Button
                onClick={() => setShowUpload(true)}
                className="rounded-2xl h-12 px-6 bg-primary hover:bg-primary/90"
              >
                📸 {isEn ? 'Upload My Clothes' : '上传我的衣服'}
              </Button>
            </div>
          </div>
        )}

        {/* 衣物网格 - 交错布局 */}
        {filtered.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-12 gap-x-6 md:gap-x-8 animate-fade-in">
            {filtered.map((item, index) => (
              <div
                key={item.id}
                className={`flex flex-col gap-3 group ${index % 2 === 1 ? 'md:translate-y-6' : ''}`}
              >
                <div className="relative overflow-hidden rounded-xl bg-surface-container-high transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="aspect-[3/4] bg-surface-container-low">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* 天体风格标签 */}
                  <div className="absolute top-3 right-3">
                    {(() => {
                      const tag = getCelestialTag(index)
                      return (
                        <span className={`${tag.bg} ${tag.text} px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label`}>
                          {tag.label}
                        </span>
                      )
                    })()}
                  </div>
                  {/* 删除按钮 */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="text-sm">✕</span>
                  </button>
                </div>
                <div className="px-1">
                  <h3 className="font-headline text-xl text-on-surface">{item.name}</h3>
                  <div className="flex flex-col mt-1">
                    <span className="text-[11px] text-on-surface-variant font-label uppercase tracking-wider">
                      {isEn ? `Best for ${Math.floor(Math.random() * 25 + 5)}° ~ ${Math.floor(Math.random() * 35 + 20)}°C` : item.color}
                    </span>
                    <span className={`text-[10px] font-label mt-1 ${index % 3 === 0 ? 'text-tertiary' : index % 3 === 1 ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                      {isEn ? ['Rarely Worn', 'Daily Essential', 'Frequent', 'Occasional'][index % 4] : '常穿'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {/* 添加占位卡片 */}
            <div
              onClick={() => setShowUpload(true)}
              className={`flex flex-col gap-3 cursor-pointer ${filtered.length % 2 === 1 ? 'md:translate-y-6' : ''}`}
            >
              <div className="relative overflow-hidden rounded-xl bg-primary-container/20 flex flex-col items-center justify-center aspect-[3/4] border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-5xl text-primary/40 mb-2">add_circle</span>
                <p className="text-xs text-on-surface-variant font-label">
                  {isEn ? 'Add New' : '添加'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 已有衣服但筛选结果为空 */}
        {items.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-muted-foreground font-serif">{isEn ? 'No items match current filters' : '该筛选条件下暂无单品'}</p>
            <button onClick={() => { setSelectedSeason(null); setSelectedType(null); setSelectedWeather(null); }} className="text-primary text-sm mt-3 hover:underline font-label">
              {isEn ? 'Clear filters' : '清除筛选'}
            </button>
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUpload={addItem} />
      )}
    </div>
  )
}
