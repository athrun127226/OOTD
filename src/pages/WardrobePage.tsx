import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWardrobeStore } from '@/store'
import { Button } from '@/components/ui/button'
import type { ClothingCategory, ClothingItem } from '@/types'
import { getDefaultWardrobeItems } from '@/services/mockApi'

// 中英文分类映射
const CATEGORY_MAP_ZH: ClothingCategory[] = ['上衣', '下装', '外套', '连衣裙', '鞋子', '配饰']
const CATEGORY_MAP_EN: ClothingCategory[] = ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Shoes', 'Accessories']

const categoryEmojis: Record<ClothingCategory, string> = {
  '上衣': '👕', 'Tops': '👕',
  '下装': '👖', 'Bottoms': '👖',
  '外套': '🧥', 'Outerwear': '🧥',
  '连衣裙': '👗', 'Dresses': '👗',
  '鞋子': '👟', 'Shoes': '👟',
  '配饰': '💍', 'Accessories': '💍',
}

function ClothingCard({
  item,
  onDelete,
}: {
  item: ClothingItem
  onDelete: (id: string) => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-muted group card-hover cursor-pointer"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="aspect-square">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-2">
        <p className="text-xs font-medium truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.color}</p>
      </div>
      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center text-xs hover:bg-destructive/90 transition-all shadow-md"
        >
          ×
        </button>
      )}
    </div>
  )
}

function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: (item: ClothingItem) => void }) {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<ClothingCategory>('上衣')
  const [color, setColor] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isEn = i18n.language === 'en'
  const categories = isEn ? CATEGORY_MAP_EN : CATEGORY_MAP_ZH

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
    let internalCategory = category
    if (isEn) {
      // 英文转中文
      const enToZh: Record<string, ClothingCategory> = {
        'Tops': '上衣', 'Bottoms': '下装', 'Outerwear': '外套',
        'Dresses': '连衣裙', 'Shoes': '鞋子', 'Accessories': '配饰'
      }
      internalCategory = enToZh[category] || category
    }
    
    const newItem: ClothingItem = {
      id: 'item_' + Date.now(),
      name,
      category: internalCategory,
      color,
      style: isEn ? 'Basic' : '百搭',
      imageUrl: previewUrl || `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=300&fit=crop`,
      tags: [color, internalCategory],
      createdAt: new Date().toISOString(),
    }
    onUpload(newItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-background rounded-3xl p-6 space-y-4 shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{t('wardrobe.addModalTitle')}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {/* 图片上传区 */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden"
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-3xl mb-2">📸</span>
              <p className="text-sm text-muted-foreground">{t('wardrobe.uploadImage')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isEn ? 'Solid background works best' : '建议纯色背景拍摄效果更佳'}
              </p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {/* 表单 */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('wardrobe.nameLabel') || 'Name'}</label>
            <input
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={isEn ? 'e.g., White T-Shirt' : '如：白色T恤、牛仔裤'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('wardrobe.category')}</label>
              <select
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{categoryEmojis[c]} {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('wardrobe.color')}</label>
              <input
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
        >
          {t('wardrobe.saveItem')}
        </Button>
      </div>
    </div>
  )
}

export default function WardrobePage() {
  const { t, i18n } = useTranslation()
  const { items, addItem, removeItem } = useWardrobeStore()
  const [activeCategory, setActiveCategory] = useState<ClothingCategory | 'all'>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [showGuide, setShowGuide] = useState(items.length === 0)

  const isEn = i18n.language === 'en'
  const categories = isEn ? CATEGORY_MAP_EN : CATEGORY_MAP_ZH

  const filtered = activeCategory === 'all' ? items : items.filter((i) => {
    // 支持中英文分类匹配
    if (isEn) {
      const zhToEn: Record<string, string> = {
        '上衣': 'Tops', '下装': 'Bottoms', '外套': 'Outerwear',
        '连衣裙': 'Dresses', '鞋子': 'Shoes', '配饰': 'Accessories'
      }
      return zhToEn[i.category] === activeCategory || i.category === activeCategory
    }
    return i.category === activeCategory
  })

  const handleLoadDefaults = () => {
    const defaults = getDefaultWardrobeItems()
    defaults.forEach((item) => addItem(item))
    setShowGuide(false)
  }

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold">{t('wardrobe.title')}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t('wardrobe.itemCount', { count: items.length })}
            </p>
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 shadow-md"
          >
            + {t('wardrobe.addItem')}
          </Button>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {isEn ? 'All' : '全部'} ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => {
              const zhToEn: Record<string, string> = {
                '上衣': 'Tops', '下装': 'Bottoms', '外套': 'Outerwear',
                '连衣裙': 'Dresses', '鞋子': 'Shoes', '配饰': 'Accessories'
              }
              return zhToEn[i.category] === cat || i.category === cat
            }).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {categoryEmojis[cat]} {cat} {count > 0 && `(${count})`}
              </button>
            )
          })}
        </div>

        {/* 空衣橱引导 */}
        {items.length === 0 && showGuide && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <span className="text-6xl mb-4 animate-float">👗</span>
            <h3 className="text-lg font-bold mb-2">{t('wardrobe.noItems')}</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {t('wardrobe.addItemTip')}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleLoadDefaults}
                variant="outline"
                className="rounded-xl"
              >
                📦 {isEn ? 'Load Sample Wardrobe' : '加载示例衣橱'}
              </Button>
              <Button
                onClick={() => setShowUpload(true)}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
              >
                📸 {isEn ? 'Upload My Clothes' : '上传我的衣服'}
              </Button>
            </div>
          </div>
        )}

        {/* 衣物网格 */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-fade-in">
            {filtered.map((item) => (
              <ClothingCard key={item.id} item={item} onDelete={removeItem} />
            ))}
            {/* 添加占位卡片 */}
            <div
              onClick={() => setShowUpload(true)}
              className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
            >
              <span className="text-2xl mb-1">+</span>
              <span className="text-xs text-muted-foreground">{isEn ? 'Add' : '添加'}</span>
            </div>
          </div>
        )}

        {/* 已有衣服但筛选结果为空 */}
        {items.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🔍</span>
          <p className="text-muted-foreground">{isEn ? 'No items in this category' : '该分类暂无单品'}</p>
            <button onClick={() => setShowUpload(true)} className="text-primary text-sm mt-2 hover:underline">
              {isEn ? 'Click to add' : '点击添加'}
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