# 🎭 AniMood AI — Mood-Based Entertainment Recommendation Platform

AniMood AI is an intelligent recommendation and cross-media discovery platform for **Anime (Japan)**, **Manga (Japan)**, **Manhwa (South Korea)**, **Donghua (China)**, and **Manhua (China)**. 

Powered by **Gemini 2.0 AI**, AniMood analyzes your emotional state, context, energy levels, and preferred genres to recommend the exact watch or read for your mood with personalized AI reasoning.

---

## ✨ Features

- **🧠 Multi-Vector Mood Discovery**: Filter by 8 emotional moods, 8 daily situations, 4 energy states, format, and 11+ languages.
- **⚡ 7-Factor Weighted Recommendation Engine**: Multi-dimensional scoring matrix balancing mood affinities, genre harmony, situation fit, user taste history, quality rank, and cross-media multipliers.
- **🤖 Gemini AI Integration**: Live personalized reasoning explaining *why* a specific title is right for your mood.
- **📚 5 Cross-Media Catalogs**: Explore 1,000+ titles across Anime, Manga, Manhwa, Donghua, and Manhua with cross-media linking (e.g., Anime ⇄ Manga ⇄ Manhwa source adaptations).
- **🎬 Multimedia Details & Trailers**: Embedded YouTube trailers, character rosters, studios, and authorized streaming/reading platform badges.
- **🎲 Surprise Me**: Quick-roll recommendation generator with instant reasoning.
- **🌍 Internationalization**: Full translation support across 11+ languages.
- **🌗 Sleek Cyberpunk/Glassmorphic UI**: High-contrast, responsive dark mode design.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, TypeScript (tsx)
- **AI / LLM**: `@google/genai` (Google Gemini 2.0 Flash)
- **Data & Auth**: In-memory & JSON file storage (with optional MongoDB URI support), JWT & Bcryptjs

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/praneth2274/ANIMOOD-AI.git
cd ANIMOOD-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
JWT_SECRET="your_jwt_secret_here"
```

### 4. Run the development server
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📜 License
MIT License
