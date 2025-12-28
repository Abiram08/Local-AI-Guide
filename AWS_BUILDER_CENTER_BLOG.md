# Building GoanFlow: An AI-Powered Local Guide for Goa with Multi-Agent Architecture

## Introduction

Tourism in India is booming, but travelers often struggle to find authentic, personalized recommendations beyond generic travel guides. For the **AI for Bharat** challenge, I built **GoanFlow** – an intelligent travel companion for Goa that goes beyond simple chatbots by using a **multi-agent AI architecture** to provide expert-level guidance across 9 specialized domains.

This blog post walks through the architecture, key features, and technical implementation of GoanFlow, with a focus on how I leveraged **Kiro's AI-assisted development** to build a production-ready travel assistant.

---

## The Problem

Travelers visiting Goa face information overload:
- **Over 40 beaches** – which one fits my vibe?
- **Variable pricing** – am I getting tourist-trapped?
- **Scattered logistics** – how do I get from airport to beach?
- **Safety concerns** – what scams should I avoid?
- **Language barriers** – what's the local lingo?

Traditional chatbots provide generic responses. I wanted to build something that feels like **asking a local friend who actually knows Goa**.

---

## Architecture: Multi-Agent System

Instead of one monolithic AI, GoanFlow uses **9 specialized agents**, each with domain expertise backed by a curated knowledge base.

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
└─────────────────────────────────────────────────────────────┘
```

### The Agents

| Agent | Purpose | Example Query |
|-------|---------|---------------|
| **Experience Curator** | Orchestrates multi-agent responses | "Plan my 3-day trip" |
| **Food Agent** | Restaurant recommendations | "Best fish curry rice?" |
| **Accommodation Agent** | Hotels & hostels | "Budget stay near Baga" |
| **Transport Agent** | Taxis, rentals, ferries | "How to reach Dudhsagar?" |
| **Markets Agent** | Shopping & bargaining | "When is Anjuna flea market?" |
| **Activities Agent** | Things to do | "Best sunset spots?" |
| **Safety Guardian** | Scams & safety tips | "Is it safe to travel alone?" |
| **Crowd Manager** | Occupancy predictions | "Best time to visit Palolem?" |
| **Price Intelligence** | Budget optimization | "Am I being overcharged?" |

---

## Key Feature 1: Voice Interaction

GoanFlow supports **hands-free voice interaction** using the Web Speech API:

### How It Works
1. **Speech-to-Text**: User taps the microphone and speaks
2. **Voice Visualizer**: Audio waveform shows the app is listening
3. **AI Processing**: Query routes to appropriate agent
4. **Text-to-Speech**: Response is read aloud

### Implementation
```typescript
// Voice recording hook
const { isRecording, startRecording, stopRecording, transcript } = useVoiceRecorder();

// Web Speech API for recognition
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-IN';
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Send to chat API
};

// Text-to-Speech response
const speak = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  speechSynthesis.speak(utterance);
};
```

This allows travelers to interact while exploring – no need to stop and type!

---

## Key Feature 2: Interactive Map with 72 Locations

The map isn't just decorative – it's **fully interactive** with real geographic data:

### Features
- **72 curated locations** with GPS coordinates
- **6 category filters**: Beaches, Stays, Food, Markets, Transport, Activities
- **Leaflet.js integration** with OpenStreetMap tiles
- **Fly-to animations** when selecting locations
- **Rich popups** showing price, rating, and local tips

### Data Structure
```typescript
export interface Landmark {
    id: string;
    name: string;
    description: string;
    lat: number;    // Real GPS coordinates
    lng: number;
    category: 'beaches' | 'accommodation' | 'restaurants' | 'markets' | 'transport' | 'activities';
    price?: string;
    rating?: string;
    localTip?: string;  // Insider knowledge
}
```

Each location includes a **local tip** – the kind of advice only a local would know, like "Go early, the fish thali sells out by noon."

---

## Key Feature 3: Curated Knowledge Base (200+ KB)

The agents don't generate generic responses – they're grounded in **real, researched data**:

| Knowledge File | Size | Contents |
|----------------|------|----------|
| `transport.md` | 36 KB | Taxi rates, scooter rentals, ferry timings |
| `food_restaurants.md` | 33 KB | 50+ restaurants with pricing |
| `activities.md` | 31 KB | Waterfalls, nightlife, temples |
| `accommodation.md` | 28 KB | Hostels to 5-star resorts |
| `crowds.md` | 20 KB | Peak hours, seasonal patterns |
| `markets.md` | 18 KB | Bargaining strategies |
| `safety.md` | 17 KB | Scam warnings, emergency contacts |
| `pricing.md` | 14 KB | Seasonal price variations |

**Example from markets.md:**
> *"Anjuna Flea Market operates ONLY on Wednesdays. Bargaining rule: Start at 40% of asking price, settle at 60%. End-of-day (6-7 PM) gets you 20% extra discount."*

This specificity makes GoanFlow feel like consulting an actual local expert.

---

## Key Feature 4: Dark/Light Mode

Premium design with full theme support:
- **System preference detection** (respects OS settings)
- **Manual toggle** for user override
- **Glassmorphism UI** with backdrop blur effects
- **Smooth transitions** between themes

---

## Development with Kiro

I used **Kiro** for spec-driven AI-assisted development. The `.kiro` folder contains:

```
.kiro/
├── kiro.yaml          # Project configuration
└── specs/goanflow-tourism-os/
    ├── requirements.md  # User stories & acceptance criteria
    ├── design.md        # Technical architecture
    └── tasks.md         # Development checklist
```

Kiro helped me:
1. **Decompose requirements** into atomic user stories
2. **Design the multi-agent architecture** before coding
3. **Track implementation progress** through task checklists
4. **Iterate rapidly** with AI pair programming

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Leaflet.js |
| **Backend** | Node.js, Express, TypeScript |
| **AI** | Groq API (LLaMA-based) |
| **Voice** | Web Speech API |
| **Maps** | Leaflet + OpenStreetMap |
| **Styling** | CSS Variables, Glassmorphism |

---

## Results

- **9 specialized AI agents** for domain expertise
- **72 interactive map locations** with local tips
- **200+ KB curated knowledge base**
- **Voice-first interaction** for hands-free use
- **Dark/Light mode** with premium UI
- **Complete documentation** in GOANFLOW_DOCUMENTATION.md

---

## What's Next

Future enhancements could include:
- **Offline mode** for areas with poor connectivity
- **Multi-language support** (Hindi, Konkani)
- **Real-time crowd data** from live sources
- **Booking integration** for seamless reservations
- **Personalized itineraries** based on user preferences

---

## Try It Yourself

📂 **GitHub Repository**: [Link to your repo]

The repository includes:
- Full source code (frontend + backend)
- Complete knowledge base (8 files)
- Kiro specs (`.kiro` directory)
- Documentation

---

## Conclusion

GoanFlow demonstrates how **multi-agent AI architecture** can solve real-world problems better than monolithic chatbots. By combining specialized agents, curated knowledge, voice interaction, and interactive maps, we created a travel companion that feels like asking a knowledgeable local friend.

The **AI for Bharat** challenge pushed me to think beyond generic AI solutions toward **context-aware, locally-grounded intelligence**. GoanFlow is just the beginning – imagine similar systems for every tourist destination in India!

---

*Built with ❤️ for Goa travelers | AI for Bharat Challenge 2024*
