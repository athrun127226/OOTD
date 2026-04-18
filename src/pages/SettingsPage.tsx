import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { ZodiacSign } from '@/types'

const ZODIACS_ZH: ZodiacSign[] = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座',
]

const zodiacTranslations: Record<ZodiacSign, { zh: string; en: string }> = {
  '白羊座': { zh: '白羊座', en: 'Aries' }, '金牛座': { zh: '金牛座', en: 'Taurus' },
  '双子座': { zh: '双子座', en: 'Gemini' }, '巨蟹座': { zh: '巨蟹座', en: 'Cancer' },
  '狮子座': { zh: '狮子座', en: 'Leo' }, '处女座': { zh: '处女座', en: 'Virgo' },
  '天秤座': { zh: '天秤座', en: 'Libra' }, '天蝎座': { zh: '天蝎座', en: 'Scorpio' },
  '射手座': { zh: '射手座', en: 'Sagittarius' }, '摩羯座': { zh: '摩羯座', en: 'Capricorn' },
  '水瓶座': { zh: '水瓶座', en: 'Aquarius' }, '双鱼座': { zh: '双鱼座', en: 'Pisces' },
}

const STYLE_OPTIONS = [
  { id: 'minimalist', en: 'Minimalist', zh: '极简主义' },
  { id: 'professional', en: 'Professional', zh: '职业风' },
  { id: 'avantgarde', en: 'Avant-Garde', zh: '先锋前卫' },
  { id: 'vintage', en: 'Vintage', zh: '复古风' },
  { id: 'bohemian', en: 'Bohemian', zh: '波西米亚' },
]

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}

// 城市数据库（名称 + 经纬度）
interface CityData {
  name: string
  lat: number
  lon: number
}

const CITY_DATABASE: CityData[] = [
  // 中国城市
  { name: '上海', lat: 31.2304, lon: 121.4737 },
  { name: '北京', lat: 39.9042, lon: 116.4074 },
  { name: '深圳', lat: 22.5431, lon: 114.0579 },
  { name: '广州', lat: 23.1291, lon: 113.2644 },
  { name: '杭州', lat: 30.2741, lon: 120.1551 },
  { name: '成都', lat: 30.5728, lon: 104.0668 },
  { name: '南京', lat: 32.0603, lon: 118.7969 },
  { name: '武汉', lat: 30.5928, lon: 114.3055 },
  { name: '西安', lat: 34.3416, lon: 108.9398 },
  { name: '重庆', lat: 29.4316, lon: 106.9123 },
  { name: '苏州', lat: 31.2989, lon: 120.5853 },
  { name: '天津', lat: 39.0842, lon: 117.2000 },
  { name: '长沙', lat: 28.2282, lon: 112.9388 },
  { name: '青岛', lat: 36.0671, lon: 120.3826 },
  { name: '大连', lat: 38.9140, lon: 121.6147 },
  { name: '厦门', lat: 24.4798, lon: 118.0894 },
  { name: '昆明', lat: 25.0389, lon: 102.7183 },
  { name: '合肥', lat: 31.8206, lon: 117.2272 },
  { name: '郑州', lat: 34.7466, lon: 113.6254 },
  { name: '福州', lat: 26.0745, lon: 119.2965 },
  // 国际城市
  { name: '伦敦', lat: 51.5074, lon: -0.1278 },
  { name: '纽约', lat: 40.7128, lon: -74.0060 },
  { name: '东京', lat: 35.6762, lon: 139.6503 },
  { name: '巴黎', lat: 48.8566, lon: 2.3522 },
  { name: '悉尼', lat: -33.8688, lon: 151.2093 },
  { name: '洛杉矶', lat: 34.0522, lon: -118.2437 },
  { name: '新加坡', lat: 1.3521, lon: 103.8198 },
  { name: '香港', lat: 22.3193, lon: 114.1694 },
  { name: '台北', lat: 25.0330, lon: 121.5654 },
  { name: '首尔', lat: 37.5665, lon: 126.9780 },
  { name: '曼谷', lat: 13.7563, lon: 100.5018 },
  { name: '迪拜', lat: 25.2048, lon: 55.2708 },
  { name: '旧金山', lat: 37.7749, lon: -122.4194 },
  { name: '多伦多', lat: 43.6532, lon: -79.3832 },
  { name: '温哥华', lat: 49.2827, lon: -123.1207 },
  { name: '墨尔本', lat: -37.8136, lon: 144.9631 },
  { name: '大阪', lat: 34.6937, lon: 135.5023 },
  { name: '巴塞罗那', lat: 41.3851, lon: 2.1734 },
  { name: '阿姆斯特丹', lat: 52.3676, lon: 4.9041 },
  { name: '罗马', lat: 41.9028, lon: 12.4964 },
]

// 天气代码映射
const WMO_CODE_MAP: Record<number, { icon: string; conditionZh: string; conditionEn: string }> = {
  0: { icon: '☀️', conditionZh: '晴朗', conditionEn: 'Clear Sky' },
  1: { icon: '🌤️', conditionZh: '大部晴朗', conditionEn: 'Mainly Clear' },
  2: { icon: '⛅', conditionZh: '局部多云', conditionEn: 'Partly Cloudy' },
  3: { icon: '☁️', conditionZh: '多云', conditionEn: 'Overcast' },
  45: { icon: '🌫️', conditionZh: '有雾', conditionEn: 'Foggy' },
  48: { icon: '🌫️', conditionZh: '雾凇', conditionEn: 'Depositing Rime Fog' },
  51: { icon: '🌦️', conditionZh: '小毛毛雨', conditionEn: 'Light Drizzle' },
  53: { icon: '🌧️', conditionZh: '中毛毛雨', conditionEn: 'Moderate Drizzle' },
  55: { icon: '🌧️', conditionZh: '大毛毛雨', conditionEn: 'Dense Drizzle' },
  61: { icon: '🌦️', conditionZh: '小雨', conditionEn: 'Slight Rain' },
  63: { icon: '🌧️', conditionZh: '中雨', conditionEn: 'Moderate Rain' },
  65: { icon: '🌧️', conditionZh: '大雨', conditionEn: 'Heavy Rain' },
  71: { icon: '🌨️', conditionZh: '小雪', conditionEn: 'Slight Snow' },
  73: { icon: '❄️', conditionZh: '中雪', conditionEn: 'Moderate Snow' },
  75: { icon: '❄️', conditionZh: '大雪', conditionEn: 'Heavy Snow' },
  80: { icon: '🌦️', conditionZh: '阵雨', conditionEn: 'Rain Showers' },
  81: { icon: '🌧️', conditionZh: '中阵雨', conditionEn: 'Moderate Showers' },
  82: { icon: '⛈️', conditionZh: '强阵雨', conditionEn: 'Violent Showers' },
  95: { icon: '⛈️', conditionZh: '雷暴', conditionEn: 'Thunderstorm' },
  96: { icon: '⛈️', conditionZh: '雷暴伴冰雹', conditionEn: 'Thunderstorm with Hail' },
  99: { icon: '⛈️', conditionZh: '强雷暴伴冰雹', conditionEn: 'Severe Thunderstorm with Hail' },
}

interface WeatherInfo {
  temperature: number
  tempMin: number
  tempMax: number
  humidity: number
  windSpeed: number
  windDirection: number
  code: number
  icon: string
  conditionZh: string
  conditionEn: string
}

export default function SettingsPage() {
  const { i18n } = useTranslation()
  const { user, updateProfile } = useAuthStore()
  const { showToast } = useToast()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [city, setCity] = useState(user?.city || '上海')
  const [zodiac, setZodiac] = useState<ZodiacSign>(user?.zodiac || '天秤座')
  const [selectedStyles, setSelectedStyles] = useState<string[]>(user?.style || ['minimalist'])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 城市搜索相关状态
  const [cityQuery, setCityQuery] = useState('')
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const isEn = i18n.language === 'en'

  if (!user) return null

  const handleSave = () => {
    updateProfile({ name, avatar, city, zodiac, style: selectedStyles })
    showToast(isEn ? 'Settings saved successfully' : '设置已保存')
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) =>
      prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]
    )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 搜索匹配的城市
  const filteredCities = cityQuery.trim()
    ? CITY_DATABASE.filter(c => c.name.toLowerCase().includes(cityQuery.toLowerCase()))
    : []

  // 获取天气数据（使用 Open-Meteo 免费 API）
  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoadingWeather(true)
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
      )
      const data = await res.json()
      
      const wmoCode = data.current.weather_code ?? 0
      const wmo = WMO_CODE_MAP[wmoCode] || WMO_CODE_MAP[0]
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        tempMin: Math.round(data.daily.temperature_2m_min[0]),
        tempMax: Math.round(data.daily.temperature_2m_max[0]),
        humidity: Math.round(data.current.relative_humidity_2m),
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: Math.round(data.current.wind_direction_10m),
        code: wmoCode,
        icon: wmo.icon,
        conditionZh: wmo.conditionZh,
        conditionEn: wmo.conditionEn,
      })
    } catch {
      setWeather(null)
    } finally {
      setLoadingWeather(false)
    }
  }

  // 处理城市输入变化
  const handleCityInputChange = (value: string) => {
    setCity(value)
    setCityQuery(value)
    setShowCitySuggestions(true)

    // 防抖搜索
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const matched = CITY_DATABASE.find(c => c.name === value)
      if (matched) {
        fetchWeatherData(matched.lat, matched.lon)
      }
    }, 500)
  }

  // 选择推荐城市
  const selectCity = (cityData: CityData) => {
    setCity(cityData.name)
    setCityQuery(cityData.name)
    setShowCitySuggestions(false)
    fetchWeatherData(cityData.lat, cityData.lon)
  }

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowCitySuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 初始化时加载当前城市的天气
  useEffect(() => {
    const currentCity = CITY_DATABASE.find(c => c.name === city)
    if (currentCity) {
      fetchWeatherData(currentCity.lat, currentCity.lon)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen pb-28 md:pb-8 bg-surface">
      <div className="w-full max-w-screen-xl mx-auto px-6 md:px-16 pt-8 md:pt-12 space-y-8">
        {/* Header */}
        <section className="mb-12 max-w-3xl">
          <p className="text-[10px] font-label uppercase tracking-[0.3em] text-on-surface-variant mb-3">
            {isEn ? 'Preferences' : '偏好设置'}
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-light text-on-surface tracking-tight">
            {isEn ? (
              <>Your <span className="text-primary italic">Celestial</span> Settings</>
            ) : (
              <>你的<span className="text-primary italic">天体</span>设置</>
            )}
          </h1>
        </section>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 0: Profile - 头像和名称 */}
          <div className="bg-surface-container rounded-[2rem] p-8 editorial-shadow animate-slide-up">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label mb-6">
              {isEn ? 'Identity' : '身份'}
            </span>
            
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary-container shadow-lg shadow-primary/20">
                  {avatar ? (
                    <img src={avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-primary text-3xl font-bold">
                      {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md border-2 border-surface opacity-90 hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name */}
              <div className="flex-1 space-y-4 pt-1">
                <div>
                  <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                    {isEn ? 'Display Name' : '显示名称'}
                  </label>
                  <input
                    className="w-full h-11 rounded-xl bg-surface-container-highest px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 border-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <p className="text-xs text-on-surface-variant/60 font-body italic">
                  {isEn ? 'Click the pencil to change your avatar.' : '点击铅笔图标更换头像。'}
                </p>
              </div>
            </div>
          </div>

          {/* Card 1: Zodiac - 星座选择 */}
          <div className="bg-tertiary-fixed/20 rounded-[2rem] p-8 relative overflow-hidden editorial-shadow animate-slide-up">
            {/* 装饰星座符号 */}
            <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
              <span className="text-[120px] text-tertiary font-light">{ZODIAC_SYMBOLS[zodiac]}</span>
            </div>
            
            <div className="relative z-10">
              <span className="inline-block bg-tertiary-fixed/60 backdrop-blur-sm text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-label mb-4">
                {isEn ? 'The Sign' : '星座'}
              </span>
              <h2 className="font-headline text-3xl text-on-surface mb-2 flex items-center gap-3">
                <span className="text-tertiary text-4xl">{ZODIAC_SYMBOLS[zodiac]}</span>
                {isEn ? zodiacTranslations[zodiac].en : zodiac}
              </h2>
              <p className="text-sm text-on-surface-variant font-body italic leading-relaxed mb-6">
                {isEn 
                  ? 'Your zodiac sign influences the atmospheric energy of your style suggestions.'
                  : '你的星座影响着风格建议的大气能量。'}
              </p>

              <div>
                <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant block mb-3">
                  {isEn ? 'Adjust Celestial Alignment' : '调整天体对齐'}
                </label>
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value as ZodiacSign)}
                  className="w-full h-11 rounded-xl bg-surface-container-highest/80 backdrop-blur-sm px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-tertiary/30 border-0"
                >
                  {ZODIACS_ZH.map((z) => (
                    <option key={z} value={z}>
                      {isEn ? zodiacTranslations[z].en : z}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Primary City - 城市搜索 + 天气 */}
          <div className="bg-surface-container rounded-[2rem] p-8 editorial-shadow animate-slide-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">location_on</span>
              </div>
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  {isEn ? 'Timezone' : '时区'}
                </p>
                <p className="text-xs text-on-surface-variant font-body">CST ({city})</p>
              </div>
            </div>

            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Primary City' : '主要城市'}</h3>
            <p className="text-sm text-on-surface-variant font-body italic leading-relaxed mb-6">
              {isEn 
                ? 'Search and select your city to get real-time weather updates.'
                : '搜索并选择你的城市以获取实时天气更新。'}
            </p>

            {/* 城市搜索框（带下拉建议） */}
            <div className="relative" ref={searchRef}>
              <input
                className="w-full h-12 rounded-xl bg-surface-container-highest px-4 pl-11 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 border-0"
                placeholder={isEn ? 'Search city...' : '搜索城市...'}
                value={city}
                onChange={(e) => handleCityInputChange(e.target.value)}
                onFocus={() => setShowCitySuggestions(true)}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>

              {/* 下拉建议列表 */}
              {showCitySuggestions && cityQuery && filteredCities.length > 0 && (
                <div className="absolute z-20 mt-2 w-full bg-surface-container-highest rounded-xl shadow-xl max-h-48 overflow-y-auto border border-outline-variant/10 animate-fade-in">
                  {filteredCities.slice(0, 8).map((c) => (
                    <button
                      key={`${c.name}-${c.lat}`}
                      onClick={() => selectCity(c)}
                      className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 border-b border-outline-variant/5 last:border-0"
                    >
                      <span className="material-symbols-outlined text-base text-on-surface-variant">location_city</span>
                      <span className="text-sm font-medium text-on-surface">{c.name}</span>
                      <span className="text-xs text-on-surface-variant ml-auto font-label">
                        {c.lat.toFixed(2)}°{c.lon > 0 ? 'E' : 'W'}, {Math.abs(c.lon).toFixed(2)}°{c.lat > 0 ? 'N' : 'S'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* 无结果提示 */}
              {showCitySuggestions && cityQuery && filteredCities.length === 0 && (
                <div className="absolute z-20 mt-2 w-full bg-surface-container-highest rounded-xl shadow-xl p-4 text-center border border-outline-variant/10">
                  <p className="text-xs text-on-surface-variant">{isEn ? 'No matching cities found' : '未找到匹配城市'}</p>
                </div>
              )}
            </div>

            {/* 实时天气预览 */}
            <div className="mt-6 pt-6 bg-surface-container-low/50 -mx-8 -mb-8 px-8 pb-8 rounded-b-[2rem]">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-3">
                {isEn ? 'Live Weather' : '实时天气'}
              </p>
              
              {loadingWeather ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high animate-pulse" />
                  <div>
                    <div className="h-8 w-16 bg-surface-container-high rounded animate-pulse mb-2" />
                    <div className="h-3 w-32 bg-surface-container-high rounded animate-pulse" />
                  </div>
                </div>
              ) : weather ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{weather.icon}</span>
                    <div>
                      <p className="text-3xl font-headline font-light text-on-surface">{weather.temperature}°</p>
                      <p className="text-[10px] font-label uppercase tracking-wider text-on-surface-variant">
                        {isEn ? weather.conditionEn : weather.conditionZh} · {isEn ? 'Current' : '当前'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs font-label text-on-surface-variant pt-2 border-t border-outline-variant/10">
                    <span>{weather.tempMin}° / {weather.tempMax}°</span>
                    <span>💧 {weather.humidity}%</span>
                    <span>🌬️ {weather.windSpeed}km/h</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-3xl">cloud_off</span>
                  <p className="text-sm font-body italic">{isEn ? 'Enter a city to see weather' : '输入城市查看天气'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Style Goals - 风格目标 */}
          <div className="bg-surface-container rounded-[2rem] p-8 editorial-shadow animate-slide-up">
            <h3 className="font-headline text-2xl text-on-surface mb-2">{isEn ? 'Style Goals' : '风格目标'}</h3>
            <p className="text-sm text-on-surface-variant font-body italic leading-relaxed mb-6">
              {isEn ? 'Choose the aesthetic rhythm of your closet.' : '选择你衣橱的美学节奏。'}
            </p>

            <p className="text-[10px] font-label text-right text-on-surface-variant mb-3">
              {selectedStyles.length} {isEn ? 'selected' : '已选'}
            </p>

            {/* Style Grid */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {STYLE_OPTIONS.map((style) => {
                const isSelected = selectedStyles.includes(style.id)
                return (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`rounded-xl aspect-square flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-lg shadow-primary/20'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                    {!isSelected && <span className="w-5 h-5 rounded-full bg-on-surface-variant/20 mb-1" />}
                    <span className="text-[11px] font-label font-semibold tracking-wide text-center px-1">
                      {isEn ? style.en : style.zh}
                    </span>
                  </button>
                )
              })}
              {/* Custom add button */}
              <button className="rounded-xl aspect-square flex flex-col items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-lg mb-0.5">add</span>
                <span className="text-[10px] font-label">{isEn ? 'Custom...' : '自定义...'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-label">
            <span className="material-symbols-outlined text-base">sync</span>
            {isEn ? `Last sync with the stars · Today ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : `上次与星辰同步 · 今天 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => window.location.reload()} className="rounded-xl font-label text-sm tracking-wide text-on-surface-variant hover:bg-surface-container">
              {isEn ? 'Discard Changes' : '放弃更改'}
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-sm tracking-wide shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              {isEn ? 'Preserve Settings' : '保存设置'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
