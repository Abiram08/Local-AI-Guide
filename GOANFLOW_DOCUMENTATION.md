# GoanFlow - Intelligent Goa Travel Companion

## 🌴 Project Overview

**GoanFlow** is an AI-powered travel assistant for Goa, India, featuring a multi-agent architecture, voice interaction, and a comprehensive knowledge base covering all aspects of traveling in Goa.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + TypeScript)           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Chat UI   │  │  Map View   │  │  Voice Visualizer   │  │
│  │   (Dark/    │  │  (Leaflet   │  │  (Web Speech API)   │  │
│  │    Light)   │  │   72 POIs)  │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (Port 4000)
┌─────────────────────────▼───────────────────────────────────┐
│                  BACKEND (Express + Node.js)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Experience Curator (Orchestrator)       │   │
│  │           Routes requests to specialized agents      │   │
│  └──────────────────────────────────────────────────────┘   │
│          │         │         │         │         │          │
│    ┌─────▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐     │
│    │ Food    │ │ Stay  │ │ Trans │ │Market │ │ Acts  │     │
│    │ Agent   │ │ Agent │ │ Agent │ │ Agent │ │ Agent │     │
│    └─────────┘ └───────┘ └───────┘ └───────┘ └───────┘     │
│          │         │         │         │         │          │
│    ┌─────▼───┐ ┌───▼───┐ ┌───▼───┐                         │
│    │ Safety  │ │ Crowd │ │ Price │   ← Utility Agents      │
│    │Guardian │ │Manager│ │ Intel │                         │
│    └─────────┘ └───────┘ └───────┘                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   KNOWLEDGE BASE (8 Files)                  │
│  accommodation.md │ activities.md │ food_restaurants.md     │
│  transport.md │ markets.md │ safety.md │ crowds.md │ pricing│
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Agent System (9 Agents)

| Agent | File | Purpose | Knowledge Source |
|-------|------|---------|------------------|
| **Experience Curator** | `experienceCurator.ts` | Main orchestrator that routes queries to specialized agents | All sources |
| **Food Agent** | `foodAgent.ts` | Restaurant recommendations, cuisine types, local dishes | `food_restaurants.md` |
| **Accommodation Agent** | `accommodationAgent.ts` | Hotels, hostels, resorts based on budget and style | `accommodation.md` |
| **Transport Agent** | `transportAgent.ts` | Taxi rates, scooter rentals, ferries, airport transfers | `transport.md` |
| **Markets Agent** | `marketsAgent.ts` | Flea markets, shopping tips, bargaining strategies | `markets.md` |
| **Activities Agent** | `activitiesAgent.ts` | Waterfalls, nightlife, temples, water sports | `activities.md` |
| **Safety Guardian** | `safetyGuardian.ts` | Travel safety, emergency contacts, scam warnings | `safety.md` |
| **Crowd Manager** | `crowdManager.ts` | Real-time occupancy predictions, best times to visit | `crowds.md` |
| **Price Intelligence** | `priceIntelligence.ts` | Seasonal price variations, budget optimization | `pricing.md` |

---

## 📚 Knowledge Base (200+ KB of Data)

| File | Size | Coverage |
|------|------|----------|
| `transport.md` | 36 KB | GoaMiles, taxi rates, scooter rentals, ferries, airports |
| `food_restaurants.md` | 33 KB | 50+ restaurants, cuisines, price ranges, local tips |
| `activities.md` | 31 KB | Waterfalls, nightlife, temples, water sports, casinos |
| `accommodation.md` | 28 KB | Hostels to 5-star resorts, budget to luxury |
| `crowds.md` | 20 KB | Occupancy data, peak hours, seasonal variations |
| `markets.md` | 18 KB | Flea markets, shopping tips, bargaining tactics |
| `safety.md` | 17 KB | Emergency contacts, scam warnings, travel tips |
| `pricing.md` | 14 KB | Seasonal pricing, negotiation strategies |

**Total: ~200 KB of curated Goa travel intelligence**

---

## 🎯 Key Features

### 1. Voice Interaction
- **Speech-to-Text**: Web Speech API for voice input
- **Text-to-Speech**: Natural responses with adjustable voice settings
- **Voice Visualizer**: Audio waveform animation during listening

### 2. Interactive Map (72 Locations)
- **Real Map**: Leaflet.js with OpenStreetMap tiles
- **6 Categories**: Beaches, Accommodation, Restaurants, Markets, Transport, Activities
- **Category Filters**: Exclusive filtering (select one category at a time)
- **Fly-to Animation**: Smooth map transitions when selecting locations
- **Rich Popups**: Price, rating, and local tips for each location

### 3. Conversational AI
- **Multi-Agent Routing**: Queries routed to specialized agents
- **Context Awareness**: Conversation history maintained
- **Personality Detection**: Adapts response style to user
- **Structured Responses**: Headings, bullet points, links

### 4. Dark/Light Mode
- **System Preference Detection**: Respects OS settings
- **Manual Toggle**: User can override preference
- **Full Theme Support**: All components adapt to theme

### 5. Topic Quick Access
- **Chip Buttons**: Beaches, Food, Stays, Markets, Activities
- **Popular Questions**: One-tap common queries
- **Blue Hover Effect**: Consistent interaction feedback

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/chat` | POST | Main conversational endpoint |
| `/api/orchestrate` | POST | Multi-agent itinerary generation |
| `/api/check-crowds` | POST | Crowd predictions |
| `/api/check-safety` | POST | Safety information |
| `/api/recommend-accommodation` | POST | Hotel/hostel recommendations |
| `/api/recommend-food` | POST | Restaurant recommendations |
| `/api/recommend-transport` | POST | Transport options |
| `/api/recommend-markets` | POST | Shopping recommendations |
| `/api/recommend-activities` | POST | Activities and attractions |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Leaflet** for interactive maps
- **Web Speech API** for voice features
- **CSS Variables** for theming

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Groq AI** for natural language processing
- **dotenv** for configuration

---

## 🚀 Running the Project

### Prerequisites
- Node.js 18+
- npm or yarn
- Groq API Key

### Setup
```bash
# Clone and install
git clone <repository-url>
cd "z:\Projects\Kiro\Week 5"
npm install
cd client && npm install

# Configure environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run both servers
npm run server      # Backend on port 4000
npm start           # Frontend on port 3000 (in client folder)
```

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=4000
```

---

## 📁 Project Structure

```
Week 5/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── MapExplore.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── TopicChips.tsx
│   │   │   └── VoiceVisualizer.tsx
│   │   ├── data/
│   │   │   └── landmarks.ts  # 72 map locations
│   │   ├── App.tsx
│   │   └── index.css        # Design system
├── src/
│   ├── agents/             # 9 specialized agents
│   │   ├── experienceCurator.ts
│   │   ├── foodAgent.ts
│   │   ├── accommodationAgent.ts
│   │   ├── transportAgent.ts
│   │   ├── marketsAgent.ts
│   │   ├── activitiesAgent.ts
│   │   ├── safetyGuardian.ts
│   │   ├── crowdManager.ts
│   │   └── priceIntelligence.ts
│   └── server.ts           # Express API server
├── knowledge/              # 8 knowledge base files
│   ├── accommodation.md
│   ├── activities.md
│   ├── crowds.md
│   ├── food_restaurants.md
│   ├── markets.md
│   ├── pricing.md
│   ├── safety.md
│   └── transport.md
└── package.json
```

---

## ✨ Highlights

- **72 Real Locations** with accurate GPS coordinates
- **9 Specialized AI Agents** for domain expertise
- **200+ KB Knowledge Base** covering all Goa travel needs
- **Voice-First Design** with speech recognition
- **Premium UI** with glassmorphism and animations
- **Dark/Light Mode** with full theme support
- **Real Interactive Map** with zoom, pan, and filtering

---

*Built with ❤️ for travelers exploring Goa*
