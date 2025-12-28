/**
 * GoanFlow API Server
 * Express.js server that connects React frontend to backend agents
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { orchestrateGoanFlow } from './orchestrator';
import { UserInput } from './types';
import { callAI } from './utils/aiClient';
import { saveConversation, updatePersonality } from './utils/db';
import { detectIntent, detectPersonality, getPersonalityGuidance, injectCulturalContext } from './utils/intelligence';
import { getSystemPrompt } from './utils/systemPrompts';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for large payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'GoanFlow API',
        version: '1.0.0',
    });
});

// Main orchestration endpoint
app.post('/api/orchestrate', async (req: Request, res: Response) => {
    try {
        console.log('📥 Received orchestration request');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const userInput: UserInput = req.body;

        // Validate required fields
        if (!userInput.userId || !userInput.date || !userInput.budget) {
            return res.status(400).json({
                error: 'Missing required fields: userId, date, budget',
                status: 'error',
            });
        }

        const result = await orchestrateGoanFlow(userInput);
        res.json(result);
    } catch (error) {
        console.error('❌ Orchestration error:', error);
        res.status(500).json({
            error: 'Failed to generate itinerary',
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 'error',
        });
    }
});

// Check crowds endpoint (Agent 3 only)
app.post('/api/check-crowds', async (req: Request, res: Response) => {
    try {
        const { manageCrowds } = await import('./agents/crowdManager');
        const { venueId, time, date, weather } = req.body;
        const prediction = await manageCrowds(venueId, time, date, weather);
        res.json({ prediction, status: 'success' });
    } catch (error) {
        console.error('Error checking crowds:', error);
        res.status(500).json({
            error: 'Failed to check crowds',
            status: 'error',
        });
    }
});

// Analyze prices endpoint (Agent 4 only)
app.post('/api/analyze-prices', async (req: Request, res: Response) => {
    try {
        const { analyzePrices } = await import('./agents/priceIntelligence');
        const { itemName, vendor, quantity } = req.body;
        const analysis = await analyzePrices(itemName, vendor, quantity);
        res.json({ analysis, status: 'success' });
    } catch (error) {
        console.error('Error analyzing prices:', error);
        res.status(500).json({
            error: 'Failed to analyze prices',
            status: 'error',
        });
    }
});

// Conversational Chat Endpoint (Phase 2, Step 2.2)
app.post('/api/chat', async (req: Request, res: Response) => {
    try {
        const { message, conversationHistory = [], userId } = req.body;

        // 1. Detect intent & personality
        const intent = detectIntent(message);
        const personality = detectPersonality(conversationHistory);

        // 2. Build System Prompt using enhanced prompts
        const systemPrompt = getSystemPrompt(intent, {
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-IN'),
        }) + `

USER STYLE: ${getPersonalityGuidance(personality)}

RESPONSE FORMAT:
You MUST return your response as a JSON object with two fields:
1. "reply": A conversational response in markdown. Be concise (under 100 words unless asked for details). Include specific prices in INR, place names, and end with a follow-up question.
2. "metadata": A structured object containing:
   - For BEACH: { intent: "BEACH", beach: string, location: string, parking: string, bestTime: string }
   - For FOOD: { intent: "FOOD", dish: string, restaurant: string, priceRange: string, paymentModes: string }
   - For SAFETY: { intent: "SAFETY", topic: string, emergencyContacts: object }
   - For ACTIVITIES: { intent: "ACTIVITIES", topic: string, venue: string, timing: string, price: string }
   - For GENERAL: { intent: "WELCOME" }

Example:
{
    "reply": "Conversational text here...",
    "metadata": { intent: "BEACH", beach: "Palolem", ... }
}`;

        // 3. Call AI
        const rawResponse = await callAI(systemPrompt, message);
        let parsed;
        try {
            parsed = JSON.parse(rawResponse);
        } catch (e) {
            parsed = { reply: rawResponse, metadata: {} };
        }

        // 4. Store in RDS
        await saveConversation(userId, message, parsed.reply, {
            intent,
            personality: personality.type
        });
        await updatePersonality(userId, personality.type);

        // 5. Response
        res.json({
            reply: parsed.reply,
            meta: {
                intent,
                personality: personality.type,
                data: parsed.metadata
            },
            detectedPersona: personality
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Check safety endpoint (Agent 6 only)
app.post('/api/check-safety', async (req: Request, res: Response) => {
    try {
        const { checkSafety } = await import('./agents/safetyGuardian');
        const { location, time, activity, touristProfile } = req.body;
        const safetyResponse = await checkSafety(
            location,
            time,
            activity,
            touristProfile
        );
        res.json({ safety: safetyResponse, status: 'success' });
    } catch (error) {
        console.error('Error checking safety:', error);
        res.status(500).json({
            error: 'Failed to check safety',
            status: 'error',
        });
    }
});

// Recommend accommodation endpoint (Agent 8 only)
app.post('/api/recommend-accommodation', async (req: Request, res: Response) => {
    try {
        const { recommendAccommodation } = await import('./agents/accommodationAgent');
        const { persona, locationPreference } = req.body;
        const recommendations = await recommendAccommodation(persona, locationPreference);
        res.json({ recommendations, status: 'success' });
    } catch (error) {
        console.error('Error recommending accommodation:', error);
        res.status(500).json({
            error: 'Failed to recommend accommodation',
            status: 'error',
        });
    }
});

// Recommend food/restaurants endpoint
app.post('/api/recommend-food', async (req: Request, res: Response) => {
    try {
        const { recommendFood } = await import('./agents/foodAgent');
        const { budget, cuisine, location, groupType } = req.body;
        const recommendations = await recommendFood(
            budget || 'mid-range',
            cuisine || 'goan',
            location || '',
            groupType || 'solo'
        );
        res.json({ ...recommendations, status: 'success' });
    } catch (error) {
        console.error('Error recommending food:', error);
        res.status(500).json({
            error: 'Failed to recommend food',
            status: 'error',
        });
    }
});

// Recommend transport endpoint
app.post('/api/recommend-transport', async (req: Request, res: Response) => {
    try {
        const { recommendTransport } = await import('./agents/transportAgent');
        const { origin, destination, time, budget, groupSize } = req.body;
        const recommendations = await recommendTransport(
            origin || 'Airport',
            destination || 'Baga',
            time || '10:00',
            budget || 'comfort',
            groupSize || 2
        );
        res.json({ ...recommendations, status: 'success' });
    } catch (error) {
        console.error('Error recommending transport:', error);
        res.status(500).json({
            error: 'Failed to recommend transport',
            status: 'error',
        });
    }
});

// Recommend markets endpoint
app.post('/api/recommend-markets', async (req: Request, res: Response) => {
    try {
        const { recommendMarkets } = await import('./agents/marketsAgent');
        const { shoppingInterests, dayOfWeek, location, budget } = req.body;
        const recommendations = await recommendMarkets(
            shoppingInterests || ['souvenirs'],
            dayOfWeek || 'Saturday',
            location || '',
            budget || 'mid-range'
        );
        res.json({ ...recommendations, status: 'success' });
    } catch (error) {
        console.error('Error recommending markets:', error);
        res.status(500).json({
            error: 'Failed to recommend markets',
            status: 'error',
        });
    }
});

// Recommend activities endpoint
app.post('/api/recommend-activities', async (req: Request, res: Response) => {
    try {
        const { recommendActivities } = await import('./agents/activitiesAgent');
        const { interests, budget, fitnessLevel, timeAvailable } = req.body;
        const recommendations = await recommendActivities(
            interests || ['nature', 'culture'],
            budget || 5000,
            fitnessLevel || 'moderate',
            timeAvailable || 8
        );
        res.json({ ...recommendations, status: 'success' });
    } catch (error) {
        console.error('Error recommending activities:', error);
        res.status(500).json({
            error: 'Failed to recommend activities',
            status: 'error',
        });
    }
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/build');
    app.use(express.static(clientBuildPath));

    // SPA fallback - serve index.html for any non-API routes
    app.get('*', (req: Request, res: Response) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        } else {
            res.status(404).json({
                error: 'Endpoint not found',
                path: req.path,
                status: 'error',
            });
        }
    });
} else {
    // Development 404 handler
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            error: 'Endpoint not found',
            path: req.path,
            status: 'error',
        });
    });
}

// Start server
app.listen(PORT, () => {
    console.log('🏖️  GoanFlow API Server Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - POST /api/orchestrate (Main Navigator)`);
    console.log(`   - POST /api/chat (Conversational AI)`);
    console.log(`   - POST /api/analyze-prices (The Shield)`);
    console.log(`   - POST /api/check-safety (The Shield)`);
    console.log(`   - POST /api/check-crowds (The Scout)`);
    console.log(`   - POST /api/recommend-accommodation (The Stays)`);
    console.log(`   - POST /api/recommend-food (The Foodie)`);
    console.log(`   - POST /api/recommend-transport (Transport Guide)`);
    console.log(`   - POST /api/recommend-markets (The Shopper)`);
    console.log(`   - POST /api/recommend-activities (The Explorer)`);
    console.log('\n✨ Ready to serve tourists!\n');
});

export default app;
