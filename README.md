# OOTD Generator - AI穿搭助手

> 基于AI的每日穿搭生成器，结合实时天气与星座运势，一键生成3套时髦穿搭方案

## ✨ 功能特色

- 🌤️ **实时天气** - 根据你所在城市获取当日天气，推荐适合的穿搭厚度与风格
- ⭐ **运势结合** - 基于星座推算今日幸运色，将运势融入穿搭方案
- 👗 **数字衣橱** - 上传自己的衣物照片，建立专属数字衣橱（支持按类型分类管理）
- 🤖 **AI一键生成** - 点击按钮，AI立即基于你的实际衣橱生成3套完整穿搭方案，含AI点评
- 💎 **Freemium模式** - 免费版每日1次生成，Pro版无限生成+高级功能

## 🛠 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui (Radix UI)
- **状态管理**: Zustand (带localStorage持久化)
- **路由**: React Router v6
- **AI能力**: Gemini 2.5 Pro (衣物识别) + GPT-5 (穿搭生成)
- **后端服务**: Atoms Cloud (认证 + 数据库 + 文件存储)
- **支付**: Stripe

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📱 页面结构

```
/           首页 - 天气/运势展示 + 一键生成OOTD
/wardrobe   衣橱页 - 单品上传/管理/分类筛选
/profile    个人中心 - 用户信息/城市/星座设置
```

## 📋 需求优先级

| 功能 | 优先级 | 状态 |
|------|--------|------|
| 用户鉴权 | P0 | ✅ 完成 |
| 衣橱录入与管理 | P0 | ✅ 完成 |
| 天气获取 | P0 | ✅ 完成 (Mock) |
| 运势推算 | P0 | ✅ 完成 (Mock) |
| AI穿搭生成 | P0 | ✅ 完成 (Mock) |
| 方案展示 | P0 | ✅ 完成 |
| 穿搭历史 | P2 | 🔲 待开发 |
| 社交分享 | P2 | 🔲 待开发 |

## 🔧 环境变量配置

创建 `.env.local` 文件：

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_WEATHER_API_KEY=your_weather_api_key
VITE_ATOMS_CLOUD_APP_ID=your_atoms_cloud_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```
