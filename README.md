<div align="center">

# 🏝️ GoanFlow

### AI-Powered Travel Companion for Goa

**Experience Goa like a local with intelligent, voice-enabled travel assistance**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Railway-blueviolet)](https://local-ai-guide-production.up.railway.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Groq](https://img.shields.io/badge/Groq-AI-F55036)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🔗 [Try the Live Demo →](https://local-ai-guide-production.up.railway.app/)**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Reference](#-api-reference) • [Deployment](#-deployment)

</div>

---

## 🌴 Overview

**GoanFlow** is an intelligent travel assistant that helps tourists navigate Goa with personalized recommendations, real-time crowd predictions, and local expertise — all through a beautiful conversational interface with voice support.

### Why GoanFlow?

| Problem | GoanFlow Solution |
|---------|-------------------|
| Tourists overpay for services | **Price Intelligence** with fair pricing detection |
| Overcrowded attractions | **Crowd Manager** with real-time predictions |
| Safety concerns | **Safety Guardian** with emergency contacts |
| Generic travel advice | **9 Specialized AI Agents** with deep local knowledge |

---

## ✨ Features

### 🎙️ Voice-First Experience
- **Speech-to-Text** — Ask questions naturally using your voice
- **Text-to-Speech** — Listen to recommendations on the go
- **Voice Visualizer** — Real-time audio waveform feedback

### 🗺️ Interactive Map (72+ Locations)
- **Real GPS Coordinates** — Accurate location data for all points
- **Category Filters** — Beaches, Restaurants, Hotels, Markets, Activities
- **Rich Information** — Prices, ratings, and local tips for each spot

### 🤖 Multi-Agent AI System
9 specialized agents work together to provide expert guidance:

| Agent | Expertise |
|-------|-----------|
| 🎯 **Experience Curator** | Orchestrates all agents for personalized responses |
| 🍽️ **Food Agent** | Restaurant recommendations & local cuisine |
| 🏨 **Accommodation Agent** | Hotels, hostels, resorts by budget |
| 🚗 **Transport Agent** | Taxis, rentals, ferries, airport transfers |
| 🛍️ **Markets Agent** | Flea markets, bargaining tips, best deals |
| 🏄 **Activities Agent** | Water sports, nightlife, temples, waterfalls |
| 🛡️ **Safety Guardian** | Travel safety & emergency contacts |
| 👥 **Crowd Manager** | Real-time occupancy predictions |
| 💰 **Price Intelligence** | Fair pricing & budget optimization |

### 🎨 Premium UI/UX
- **Dark/Light Mode** — System preference detection
- **Glassmorphism Design** — Modern, elegant interface
- **Responsive Layout** — Works on all screen sizes
- **Saved Tips** — Bookmark favorite recommendations

---

## 🎬 Demo

### Chat Interface
> Ask anything about Goa — beaches, food, nightlife, transport, or hidden gems!

```
User: "Where can I get the best fish curry under ₹300?"

GoanFlow: Here are my top picks for authentic Goan fish curry:

🏆 **Ritz Classic** (Panjim) - ₹250
   Classic Goan fish curry rice, been serving since 1980!

🐟 **Vinayak Family Restaurant** (Assagao) - ₹280  
   Known for pomfret curry, locals' favorite

💡 Pro tip: Ask for "Xit Kodi" — that's the Konkani name!
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn**
- **Groq API Key** ([Get it here](https://console.groq.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/goanflow.git
cd goanflow

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

# Configure environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Start development server
npm start
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Your Groq API key for AI responses |
| `PORT` | ❌ | Backend port (default: 4000) |
| `NODE_ENV` | ❌ | `development` or `production` |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + TypeScript)                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐│
│  │   Chat UI   │ │  Map View   │ │    Voice Visualizer         ││
│  │(Dark/Light) │ │(Leaflet.js) │ │   (Web Speech API)          ││
│  └─────────────┘ └─────────────┘ └─────────────────────────────┘│
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST API (Port 4000)
┌───────────────────────────▼─────────────────────────────────────┐
│                 BACKEND (Express + Node.js)                      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Experience Curator (Orchestrator)                │ │
│  │          Routes queries to specialized agents               │ │
│  └────────────────────────────────────────────────────────────┘ │
│       │         │         │         │         │         │       │
│  ┌────┴───┐┌────┴───┐┌────┴───┐┌────┴───┐┌────┴───┐┌────┴───┐  │
│  │ Food   ││ Stay   ││ Trans  ││Markets ││ Acts   ││ Safety │  │
│  │ Agent  ││ Agent  ││ Agent  ││ Agent  ││ Agent  ││Guardian│  │
│  └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│               KNOWLEDGE BASE (200+ KB of Data)                   │
│  accommodation.md │ activities.md │ food_restaurants.md         │
│  transport.md │ markets.md │ safety.md │ crowds.md │ pricing.md │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
goanflow/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── MapExplore.tsx      # Interactive Leaflet map
│   │   │   ├── MessageBubble.tsx   # Chat message component
│   │   │   ├── TopicChips.tsx      # Quick topic selection
│   │   │   └── VoiceVisualizer.tsx # Voice recording UI
│   │   ├── data/
│   │   │   └── landmarks.ts    # 72 map locations with GPS
│   │   ├── App.tsx             # Main application
│   │   └── App.css             # Styling
│   └── package.json
│
├── src/                        # Node.js backend
│   ├── agents/                 # 9 specialized AI agents
│   │   ├── experienceCurator.ts
│   │   ├── foodAgent.ts
│   │   ├── accommodationAgent.ts
│   │   ├── transportAgent.ts
│   │   ├── marketsAgent.ts
│   │   ├── activitiesAgent.ts
│   │   ├── safetyGuardian.ts
│   │   ├── crowdManager.ts
│   │   └── priceIntelligence.ts
│   ├── utils/                  # Utilities
│   │   ├── aiClient.ts         # Groq AI integration
│   │   └── systemPrompts.ts    # Agent prompts
│   └── server.ts               # Express API server
│
├── knowledge/                  # Knowledge base (200+ KB)
│   ├── accommodation.md
│   ├── activities.md
│   ├── crowds.md
│   ├── food_restaurants.md
│   ├── markets.md
│   ├── pricing.md
│   ├── safety.md
│   └── transport.md
│
├── railway.json                # Railway deployment config
├── package.json
└── README.md
```

---

## 🔌 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/chat` | Main conversational AI |
| `POST` | `/api/orchestrate` | Multi-agent itinerary |
| `POST` | `/api/recommend-food` | Food recommendations |
| `POST` | `/api/recommend-accommodation` | Stay recommendations |
| `POST` | `/api/recommend-transport` | Transport options |
| `POST` | `/api/recommend-markets` | Shopping recommendations |
| `POST` | `/api/recommend-activities` | Activities & attractions |
| `POST` | `/api/check-safety` | Safety information |
| `POST` | `/api/check-crowds` | Crowd predictions |

### Example Request

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Best beaches for sunset?",
    "userId": "user123",
    "conversationHistory": []
  }'
```

---

## 🚢 Deployment

### Deploy to Railway (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```

2. **Connect Railway**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Select your repository

3. **Add Environment Variables**
   | Variable | Value |
   |----------|-------|
   | `GROQ_API_KEY` | Your Groq API key |
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` |

4. **Generate Domain** → App is live! 🎉

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Leaflet.js, Web Speech API |
| **Backend** | Node.js, Express, TypeScript |
| **AI** | Groq (Llama) for natural language processing |
| **Deployment** | Railway |

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run agent-specific tests
npm run test:agents
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** — Ultra-fast AI inference
- **Leaflet.js** — Beautiful interactive maps
- **MDN Web Speech API** — Voice recognition

---

<div align="center">

**Built with ❤️ for travelers exploring Goa**

🏝️ **GoanFlow** — Your AI Local Guide

</div>
