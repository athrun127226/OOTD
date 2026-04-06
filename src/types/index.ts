// 衣物类型
export interface ClothingItem {
  id: string
  name: string
  category: ClothingCategory
  color: string
  style: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export type ClothingCategory = '上衣' | '下装' | '外套' | '鞋子' | '配饰' | '连衣裙'

// 天气数据
export interface WeatherData {
  city: string
  temperature: {
    min: number
    max: number
    current: number
  }
  condition: string
  conditionCode: string
  humidity: number
  windSpeed: number
  windDirection: string
  feelsLike: number
}

// 运势数据
export interface FortuneData {
  zodiac: string
  overall: number // 1-5星
  love: number
  career: number
  wealth: number
  health: number
  luckyColor: string
  luckyNumber: number
  todayTip: string
  summary: string
}

// OOTD穿搭方案
export interface OOTDOutfit {
  id: string
  name: string
  style: string
  items: {
    top?: ClothingItem
    bottom?: ClothingItem
    outerwear?: ClothingItem
    shoes?: ClothingItem
    accessories?: ClothingItem[]
    dress?: ClothingItem
  }
  aiComment: string
  occasion: string
  luckyReason?: string
  score: number
}

// 用户信息
export interface UserProfile {
  id: string
  name: string
  avatar?: string
  city: string
  zodiac: ZodiacSign
  email: string
  isPro: boolean
  credits: number
  dailyGenerateCount: number
  lastGenerateDate: string
  createdAt: string
}

export type ZodiacSign = 
  | '白羊座' | '金牛座' | '双子座' | '巨蟹座'
  | '狮子座' | '处女座' | '天秤座' | '天蝎座'
  | '射手座' | '摩羯座' | '水瓶座' | '双鱼座'

// 生成状态
export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error'

// 认证状态
export interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
  token: string | null
}
