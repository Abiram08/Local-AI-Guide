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

IMPORTANT BEHAVIOR - BE A FRIENDLY LOCAL GUIDE:
- Before giving recommendations, ASK 1-2 clarifying questions to understand their needs better.
- For beaches: Ask about vibe preference (party/peaceful), time of day, activities (swimming/sunset/surfing).
- For food: Ask about cuisine preference, budget range, vegetarian/non-veg, spicy tolerance.
- For activities: Ask about group size, adventure level, timing preference.
- For plans: Ask about budget, interests, travel companions, energy level.
- Be conversational and friendly like a local friend, not a tour guide.
- Use casual language with occasional Hindi/Konkani words (yaar, bro, etc.)

RESPONSE FORMAT:
Return ONLY a JSON object (no text before or after):
{
    "reply": "Your friendly conversational response here. Keep it under 80 words. Always end with a question to engage the user."
}`;

        // 3. Call AI with conversation history for context
        const rawResponse = await callAI(systemPrompt, message, conversationHistory);
        let parsed;

        // First, try to find and extract JSON from the response
        const jsonMatch = rawResponse.match(/\{[\s\S]*?"reply"[\s\S]*?\}(?=\s*$|\s*\n)/);

        if (jsonMatch) {
            try {
                parsed = JSON.parse(jsonMatch[0]);
                // If the response has text BEFORE the JSON, that's the reply
                const textBeforeJson = rawResponse.slice(0, rawResponse.indexOf(jsonMatch[0])).trim();
                if (textBeforeJson && !parsed.reply) {
                    parsed.reply = textBeforeJson;
                }
            } catch (e) {
                // JSON found but invalid - use text before it as reply
                const cleanText = rawResponse.replace(/\{[\s\S]*\}$/m, '').trim();
                parsed = { reply: cleanText || rawResponse, metadata: {} };
            }
        } else {
            try {
                // Maybe the whole thing is JSON
                parsed = JSON.parse(rawResponse);
            } catch (e) {
                // No JSON at all - just use the raw response
                parsed = { reply: rawResponse, metadata: {} };
            }
        }

        // Final cleanup - remove any remaining JSON from reply text
        if (parsed.reply && typeof parsed.reply === 'string') {
            parsed.reply = parsed.reply.replace(/\{[\s\S]*?"metadata"[\s\S]*?\}\s*$/m, '').trim();
            parsed.reply = parsed.reply.replace(/\{[\s\S]*?"intent"[\s\S]*?\}\s*$/m, '').trim();
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
    const fs = require('fs');

    // Try multiple possible paths for the client build
    const possiblePaths = [
        path.join(process.cwd(), 'client', 'build'),
        path.join(__dirname, '..', 'client', 'build'),
        path.join(__dirname, 'client', 'build'),
    ];

    let clientBuildPath = possiblePaths[0]; // Default
    for (const p of possiblePaths) {
        console.log(`📁 Checking path: ${p}`);
        if (fs.existsSync(p)) {
            clientBuildPath = p;
            console.log(`✅ Found build at: ${p}`);
            break;
        }
    }

    console.log(`📁 Serving static files from: ${clientBuildPath}`);
    app.use(express.static(clientBuildPath));

    // SPA fallback - serve index.html for any non-API routes
    app.get('*', (req: Request, res: Response) => {
        if (!req.path.startsWith('/api')) {
            const indexPath = path.join(clientBuildPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                res.sendFile(indexPath);
            } else {
                res.status(404).send('Build not found. Check Railway build logs.');
            }
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
