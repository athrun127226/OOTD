import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'

// 获取本地存储的语言设置，默认中文
const savedLanguage = localStorage.getItem('ootd-language') || 'zh'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: savedLanguage,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

// 语言切换工具函数
export function changeLanguage(lang: 'zh' | 'en') {
  i18n.changeLanguage(lang)
  localStorage.setItem('ootd-language', lang)
}

// 获取当前语言
export function getCurrentLanguage(): 'zh' | 'en' {
  return (i18n.language || 'zh') as 'zh' | 'en'
}

// 根据语言获取支付币种和价格
export function getPaymentConfig(lang: 'zh' | 'en') {
  if (lang === 'zh') {
    return {
      currency: 'USD',
      monthly: { amount: '1.50', display: '$1.50/月' },
      yearly: { amount: '12.00', display: '$12/年' },
    }
  } else {
    return {
      currency: 'USD',
      monthly: { amount: '1.50', display: '$1.50/month' },
      yearly: { amount: '12.00', display: '$12/year' },
    }
  }
}