import type { WeatherData, FortuneData, OOTDOutfit, ClothingItem, UserProfile, ZodiacSign } from '@/types'

// ===== 模拟天气数据 =====
export async function fetchWeather(city: string): Promise<WeatherData> {
  await delay(800)
  const conditions = ['晴天', '多云', '小雨', '阴天', '大风']
  const conditionCodes = ['sunny', 'cloudy', 'rainy', 'overcast', 'windy']
  const idx = Math.floor(Math.random() * conditions.length)
  return {
    city,
    temperature: {
      min: 12 + Math.floor(Math.random() * 8),
      max: 22 + Math.floor(Math.random() * 8),
      current: 18 + Math.floor(Math.random() * 8),
    },
    condition: conditions[idx],
    conditionCode: conditionCodes[idx],
    humidity: 50 + Math.floor(Math.random() * 40),
    windSpeed: 5 + Math.floor(Math.random() * 15),
    windDirection: '东南风',
    feelsLike: 17 + Math.floor(Math.random() * 6),
  }
}

// ===== 模拟运势数据 =====
export async function fetchFortune(zodiac: ZodiacSign): Promise<FortuneData> {
  await delay(600)
  const luckyColors = ['玫瑰粉', '天空蓝', '薄荷绿', '奶油白', '珊瑚橙', '紫罗兰', '金色', '米白']
  const tips = [
    '今日宜穿亮色系，桃花运佳，出行顺利',
    '今日宜低调，深色系穿搭能带来稳定的财运',
    '今日幸运色为蓝色，穿着蓝色单品可提升贵人缘',
    '今日宜清新系穿搭，活力满满，事业顺心',
    '今日宜穿柔和色调，感情运势上升，适合约会',
  ]
  return {
    zodiac,
    overall: 3 + Math.floor(Math.random() * 3),
    love: 2 + Math.floor(Math.random() * 4),
    career: 2 + Math.floor(Math.random() * 4),
    wealth: 2 + Math.floor(Math.random() * 4),
    health: 3 + Math.floor(Math.random() * 3),
    luckyColor: luckyColors[Math.floor(Math.random() * luckyColors.length)],
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    todayTip: tips[Math.floor(Math.random() * tips.length)],
    summary: `${zodiac}今日整体运势不错，保持积极心态，好事连连。`,
  }
}

// ===== 模拟OOTD生成 =====
export async function generateOOTD(
  wardrobeItems: ClothingItem[],
  weather: WeatherData,
  fortune: FortuneData
): Promise<OOTDOutfit[]> {
  await delay(2000) // 模拟AI生成时间

  // 使用用户的衣橱数据，如果没有则使用默认数据
  const items = wardrobeItems.length > 0 ? wardrobeItems : getMockClothingItems()
  
  // 按类别分类衣物
  const tops = items.filter(i => i.category === '上衣')
  const bottoms = items.filter(i => i.category === '下装')
  const outerwears = items.filter(i => i.category === '外套')
  const dresses = items.filter(i => i.category === '连衣裙')
  const shoes = items.filter(i => i.category === '鞋子')
  const accessories = items.filter(i => i.category === '配饰')

  const styles = ['通勤风', '休闲风', '约会风', '运动风', '复古风']
  const occasions = ['日常通勤', '休闲外出', '约会聚餐', '运动健身', '逛街购物']
  const comments = [
    `这套搭配完美契合今日${weather.condition}的天气，气温${weather.temperature.current}°C穿着舒适。${fortune.luckyColor}的点缀呼应了${fortune.zodiac}的幸运色，自信出门，好运随行✨`,
    `经典利落的${styles[1]}穿搭，在${weather.condition}的天气中既保暖又不失时髦。简约的配色更显身材，是打工人的最佳选择💼`,
    `浪漫气息扑面而来！柔和的色调与今日"${fortune.todayTip.substring(0, 10)}..."的运势暗示完美呼应，遇见美好的一天就从这套开始🌸`,
  ]

  // 根据用户衣橱动态生成搭配方案
  const outfits: OOTDOutfit[] = []

  // 方案1：通勤风（上衣+下装，有鞋子更好）
  if (tops.length > 0 && bottoms.length > 0) {
    outfits.push({
      id: '1',
      name: '清新通勤look',
      style: '通勤风',
      items: {
        top: tops[0],
        bottom: bottoms[0],
        shoes: shoes.length > 0 ? shoes[0] : undefined,
        outerwear: outerwears.length > 0 ? outerwears[0] : undefined,
      },
      aiComment: comments[0],
      occasion: occasions[0],
      luckyReason: `融入了${fortune.luckyColor}，为你带来桃花运加持`,
      score: 4.8,
    })
  }

  // 方案2：休闲风（上衣+下装，有外套/鞋子更好）
  if (tops.length > 0 && bottoms.length > 1) {
    outfits.push({
      id: '2',
      name: '时髦休闲风',
      style: '休闲风',
      items: {
        top: tops[1 % tops.length],
        bottom: bottoms[1 % bottoms.length],
        outerwear: outerwears.length > 0 ? outerwears[0] : undefined,
        shoes: shoes.length > 1 ? shoes[1 % shoes.length] : undefined,
      },
      aiComment: comments[1],
      occasion: occasions[1],
      score: 4.5,
    })
  }

  // 方案3：约会风（连衣裙优先，或上衣+下装组合）
  if (dresses.length > 0) {
    outfits.push({
      id: '3',
      name: '约会浪漫风',
      style: '约会风',
      items: {
        dress: dresses[0],
        shoes: shoes.length > 0 ? shoes[0] : undefined,
        accessories: accessories.length > 0 ? [accessories[0]] : undefined,
      },
      aiComment: comments[2],
      occasion: occasions[2],
      luckyReason: '整体配色呼应今日运势，爱情运UP',
      score: 4.9,
    })
  } else if (tops.length > 0 && bottoms.length > 0) {
    // 没有连衣裙，用上衣+下装组合
    outfits.push({
      id: '3',
      name: '简约约会风',
      style: '约会风',
      items: {
        top: tops[tops.length - 1],
        bottom: bottoms[bottoms.length - 1],
        shoes: shoes.length > 0 ? shoes[shoes.length - 1] : undefined,
        accessories: accessories.length > 0 ? [accessories[0]] : undefined,
      },
      aiComment: comments[2],
      occasion: occasions[2],
      luckyReason: '整体配色呼应今日运势，爱情运UP',
      score: 4.7,
    })
  }

  // 如果用户衣橱数据不足，补充默认方案
  if (outfits.length === 0) {
    const mockItems = getMockClothingItems()
    outfits.push({
      id: '1',
      name: '清新通勤look',
      style: '通勤风',
      items: {
        top: mockItems.find(i => i.category === '上衣'),
        bottom: mockItems.find(i => i.category === '下装'),
        shoes: mockItems.find(i => i.category === '鞋子'),
      },
      aiComment: comments[0],
      occasion: occasions[0],
      luckyReason: `融入了${fortune.luckyColor}，为你带来桃花运加持`,
      score: 4.8,
    })
  }

  return outfits
}

// ===== 模拟登录 =====
export async function mockLogin(email: string, _password: string): Promise<{ user: UserProfile; token: string }> {
  await delay(1000)
  if (!email.includes('@')) {
    throw new Error('邮箱格式不正确')
  }
  const user: UserProfile = {
    id: 'user_' + Date.now(),
    name: email.split('@')[0],
    email,
    city: '上海',
    zodiac: '天秤座',
    style: [],
    isPro: false,
    credits: 10,
    dailyGenerateCount: 0,
    lastGenerateDate: '',
    createdAt: new Date().toISOString(),
  }
  return { user, token: 'mock_token_' + Date.now() }
}

export async function mockRegister(name: string, email: string, _password: string): Promise<{ user: UserProfile; token: string }> {
  await delay(1200)
  const user: UserProfile = {
    id: 'user_' + Date.now(),
    name,
    email,
    city: '上海',
    zodiac: '天秤座',
    style: [],
    isPro: false,
    credits: 10,
    dailyGenerateCount: 0,
    lastGenerateDate: '',
    createdAt: new Date().toISOString(),
  }
  return { user, token: 'mock_token_' + Date.now() }
}

// ===== 演示模式登录 =====
export function mockDemoLogin(): { user: UserProfile; token: string } {
  const user: UserProfile = {
    id: 'demo_user_' + Date.now(),
    name: 'OOTD探索者',
    email: 'demo@ootd.app',
    avatar: '',
    city: '北京市',
    zodiac: '双子座',
    style: [],
    isPro: false,
    credits: 10,
    dailyGenerateCount: 0,
    lastGenerateDate: '',
    createdAt: new Date().toISOString(),
  }
  return { user, token: 'demo_token_' + Date.now() }
}

// ===== Mock衣橱数据 =====
function getMockClothingItems(): ClothingItem[] {
  return [
    { id: 'c1', name: '白色基础T恤', category: '上衣', color: '白色', style: '基础款', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', tags: ['白色', '休闲', '百搭'], createdAt: '2024-01-01' },
    { id: 'c2', name: '条纹衬衫', category: '上衣', color: '蓝白条纹', style: '休闲', imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop', tags: ['条纹', '通勤', '清新'], createdAt: '2024-01-02' },
    { id: 'c3', name: '高腰牛仔裤', category: '下装', color: '深蓝', style: '休闲', imageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=300&h=300&fit=crop', tags: ['牛仔', '高腰', '显瘦'], createdAt: '2024-01-03' },
    { id: 'c4', name: 'A字半裙', category: '下装', color: '米白', style: '优雅', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=300&fit=crop', tags: ['半裙', '优雅', '约会'], createdAt: '2024-01-04' },
    { id: 'c5', name: '卡其色风衣', category: '外套', color: '卡其', style: '通勤', imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&h=300&fit=crop', tags: ['风衣', '通勤', '秋季'], createdAt: '2024-01-05' },
    { id: 'c6', name: '白色小雏菊连衣裙', category: '连衣裙', color: '白色碎花', style: '清新', imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=300&h=300&fit=crop', tags: ['连衣裙', '碎花', '约会'], createdAt: '2024-01-06' },
    { id: 'c7', name: '白色小白鞋', category: '鞋子', color: '白色', style: '休闲', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', tags: ['小白鞋', '百搭', '休闲'], createdAt: '2024-01-07' },
    { id: 'c8', name: '裸色细跟高跟鞋', category: '鞋子', color: '裸色', style: '优雅', imageUrl: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=300&h=300&fit=crop', tags: ['高跟鞋', '优雅', '约会'], createdAt: '2024-01-08' },
    { id: 'c9', name: '老爹鞋', category: '鞋子', color: '灰白', style: '休闲', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop', tags: ['老爹鞋', '潮流', '休闲'], createdAt: '2024-01-09' },
    { id: 'c10', name: '珍珠项链', category: '配饰', color: '白色', style: '优雅', imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&h=300&fit=crop', tags: ['项链', '珍珠', '优雅'], createdAt: '2024-01-10' },
  ]
}

export function getDefaultWardrobeItems(): ClothingItem[] {
  return getMockClothingItems()
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
