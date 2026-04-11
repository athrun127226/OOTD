import { useState } from 'react'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/PaymentModal'
import type { ZodiacSign } from '@/types'

const ZODIACS: ZodiacSign[] = [
  '白羊座', '金牛座', '双子座', '巨蟹座',
  '狮子座', '处女座', '天秤座', '天蝎座',
  '射手座', '摩羯座', '水瓶座', '双鱼座',
]

const CITIES = ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', '重庆', '南京']

const zodiacEmojis: Record<ZodiacSign, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [city, setCity] = useState(user?.city || '上海')
  const [zodiac, setZodiac] = useState<ZodiacSign>(user?.zodiac || '天秤座')
  const [saved, setSaved] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  if (!user) return null

  const handleSave = () => {
    updateProfile({ name, city, zodiac })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* 顶部标题 */}
        <h1 className="text-2xl font-bold">个人中心</h1>

        {/* 用户信息卡 */}
        <div className="glass rounded-3xl p-6 shadow-md animate-slide-up">
          <div className="flex items-center gap-4 mb-5">
            {/* 头像 */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {user.isPro ? (
                  <span className="text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                    ✨ Pro会员
                  </span>
                ) : (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    免费版
                  </span>
                )}
                <span className="text-xs text-muted-foreground">💎 {user.credits} 穿搭币</span>
              </div>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span>📍</span>
                  <span className="text-muted-foreground">所在城市</span>
                </div>
                <span className="text-sm font-medium">{user.city}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span>⭐</span>
                  <span className="text-muted-foreground">我的星座</span>
                </div>
                <span className="text-sm font-medium">
                  {zodiacEmojis[user.zodiac]} {user.zodiac}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span>📅</span>
                  <span className="text-muted-foreground">注册时间</span>
                </div>
                <span className="text-sm font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                </span>
              </div>
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="w-full rounded-xl mt-2"
              >
                ✏️ 编辑资料
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">昵称</label>
                <input
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">所在城市（用于获取天气）</label>
                <select
                  className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">我的星座（用于运势推算）</label>
                <div className="grid grid-cols-4 gap-2">
                  {ZODIACS.map((z) => (
                    <button
                      key={z}
                      onClick={() => setZodiac(z)}
                      className={`py-2 rounded-xl text-xs font-medium transition-all ${
                        zodiac === z
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {zodiacEmojis[z]} {z.replace('座', '')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1 rounded-xl">
                  取消
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  保存
                </Button>
              </div>
            </div>
          )}

          {saved && (
            <div className="mt-3 text-center text-sm text-green-600 bg-green-50 rounded-xl py-2">
              ✓ 资料已更新
            </div>
          )}
        </div>

        {/* Pro升级卡 */}
        {!user.isPro && (
          <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white shadow-xl animate-slide-up">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative">
              <p className="text-xs font-medium opacity-80 mb-1">解锁无限可能</p>
              <h3 className="text-xl font-bold mb-3">升级 Pro 会员 ✨</h3>
              <ul className="space-y-1.5 mb-4">
                {['无限衣橱容量', '每日无限次生成', 'AI智能抠图', '穿搭风格定制', '无水印分享海报'].map((feat) => (
                  <li key={feat} className="text-sm flex items-center gap-2">
                    <span className="text-white/70">✓</span> {feat}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setShowPayment(true)}
                  className="bg-white text-pink-600 hover:bg-white/90 rounded-xl font-bold shadow-lg"
                >
                  $1.50/月 立即升级
                </Button>
                <span className="text-xs opacity-70">$12/年</span>
              </div>
            </div>
          </div>
        )}

        {/* 功能列表 */}
        <div className="glass rounded-3xl overflow-hidden shadow-md animate-slide-up">
          {[
            { icon: '🎨', label: '穿搭历史', desc: '查看过去生成的方案' },
            { icon: '🔔', label: '消息通知', desc: '管理通知偏好' },
            { icon: '🔒', label: '账号安全', desc: '修改密码、绑定手机' },
            { icon: '📋', label: '关于我们', desc: 'OOTD Generator v1.0.0' },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 text-left"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-muted-foreground text-sm">›</span>
            </button>
          ))}
        </div>

        {/* 退出登录 */}
        <Button
          variant="outline"
          className="w-full rounded-2xl text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={logout}
        >
          退出登录
        </Button>
      </div>

      {/* 支付弹窗 */}
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
      />
    </div>
  )
}
