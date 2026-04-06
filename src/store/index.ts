import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile, ClothingItem, WeatherData, FortuneData, OOTDOutfit, GenerateStatus } from '@/types'

// ===== Auth Store =====
interface AuthStore {
  isAuthenticated: boolean
  user: UserProfile | null
  token: string | null
  login: (user: UserProfile, token: string) => void
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => set({ isAuthenticated: true, user, token }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'ootd-auth' }
  )
)

// ===== Wardrobe Store =====
interface WardrobeStore {
  items: ClothingItem[]
  addItem: (item: ClothingItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<ClothingItem>) => void
  clearAll: () => void
}

export const useWardrobeStore = create<WardrobeStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'ootd-wardrobe' }
  )
)

// ===== OOTD Generator Store =====
interface OOTDStore {
  weather: WeatherData | null
  fortune: FortuneData | null
  outfits: OOTDOutfit[]
  status: GenerateStatus
  error: string | null
  activeOutfitIndex: number
  setWeather: (weather: WeatherData) => void
  setFortune: (fortune: FortuneData) => void
  setOutfits: (outfits: OOTDOutfit[]) => void
  setStatus: (status: GenerateStatus) => void
  setError: (error: string | null) => void
  setActiveOutfitIndex: (index: number) => void
  reset: () => void
}

export const useOOTDStore = create<OOTDStore>((set) => ({
  weather: null,
  fortune: null,
  outfits: [],
  status: 'idle',
  error: null,
  activeOutfitIndex: 0,
  setWeather: (weather) => set({ weather }),
  setFortune: (fortune) => set({ fortune }),
  setOutfits: (outfits) => set({ outfits }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setActiveOutfitIndex: (index) => set({ activeOutfitIndex: index }),
  reset: () => set({ outfits: [], status: 'idle', error: null, activeOutfitIndex: 0 }),
}))
