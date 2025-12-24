/**
 * GoanFlow API Server
 * Express.js server that connects React frontend to backend agents
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { orchestrateGoanFlow } from './orchestrator';
import { UserInput } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

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

        // Orchestrate all agents
        const result = await orchestrateGoanFlow(userInput);

        console.log('✅ Orchestration successful');
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

// Profile tourist endpoint (Agent 1 only)
app.post('/api/profile', async (req: Request, res: Response) => {
    try {
        const { profileTourist } = await import('./agents/touristProfiler');
        const persona = await profileTourist(req.body.appInteractions);
        res.json({ persona, status: 'success' });
    } catch (error) {
        console.error('Error profiling tourist:', error);
        res.status(500).json({
            error: 'Failed to profile tourist',
            status: 'error',
        });
    }
});

// Match guide endpoint (Agent 2 only)
app.post('/api/match-guide', async (req: Request, res: Response) => {
    try {
        const { matchGuide } = await import('./agents/guideMatcher');
        const { persona, date } = req.body;
        const guides = await matchGuide(persona, date);
        res.json({ guides, status: 'success' });
    } catch (error) {
        console.error('Error matching guide:', error);
        res.status(500).json({
            error: 'Failed to match guide',
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

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        status: 'error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🏖️  GoanFlow API Server Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   - GET  /api/health`);
    console.log(`   - POST /api/orchestrate (main endpoint)`);
    console.log(`   - POST /api/profile`);
    console.log(`   - POST /api/match-guide`);
    console.log(`   - POST /api/check-crowds`);
    console.log(`   - POST /api/analyze-prices`);
    console.log(`   - POST /api/check-safety`);
    console.log('\n✨ Ready to serve tourists!\n');
});

export default app;
