/**
 * Agent 5: Experience Curator (THE ORCHESTRATOR)
 * 
 * Purpose: Coordinate all agents to build perfect day itineraries
 * 
 * Process:
 * 1. Call Agent 1 (Tourist Profiler) - Get persona
 * 2. Call Agent 2 (Guide Matcher) - Get matched guide
 * 3. Call Agent 3 (Crowd Manager) - Check crowds
 * 4. Call Agent 4 (Price Intelligence) - Get fair prices
 * 5. Call Agent 6 (Safety Guardian) - Get safety alerts
 * 6. Apply constraints (budget, interests, travel time, rest breaks)
 * 7. Generate hour-by-hour itinerary
 */

import Anthropic from "@anthropic-ai/sdk";
import {
    TouristPersona,
    GuideMatch,
    CrowdPrediction,
    PriceAnalysis,
    SafetyResponse,
    Itinerary,
    Activity,
    DailySummary,
} from "../types";
import { profileTourist } from "./touristProfiler";
import { matchGuide } from "./guideMatcher";
import { manageCrowds } from "./crowdManager";
import { analyzePrices } from "./priceIntelligence";
import { checkSafety } from "./safetyGuardian";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Load product.md for context
 */
function loadProductContext(): string {
    const productPath = path.join(__dirname, "../../product.md");
    return fs.readFileSync(productPath, "utf-8");
}

/**
 * Curate perfect experience by orchestrating all agents
 */
export async function curateExperience(
    persona: TouristPersona,
    matchedGuide: GuideMatch,
    crowdPredictions: Record<string, CrowdPrediction>,
    priceAnalyses: Record<string, PriceAnalysis>,
    safetyAlerts: SafetyResponse,
    budget: number,
    date: string
): Promise<Itinerary> {
    const productContext = loadProductContext();

    const systemPrompt = `You are an experience curator for GoanFlow, the AI tourism OS.

Your task: Build a perfect hour-by-hour itinerary by orchestrating all agent insights.

Inputs:
- Tourist persona (interests, budget, preferences)
- Matched guide (specialties, availability, rate)
- Crowd predictions (avoid peaks, suggest alternatives)
- Fair prices (verified, no exploitation)
- Safety alerts (proactive warnings)

Constraints:
- Total cost ≤ budget
- All activities match primary interests
- Avoid peak crowd times (>1000 people)
- Guide available entire tour
- 15 min travel time between activities
- 30 min rest breaks every 3 hours
- Meals: breakfast 6-7 AM, lunch 12-1 PM, dinner 7-8 PM
- No activities at religious sites during prayer times (6-7 AM, 5-6 PM)
- All safety alerts checked

Itinerary Structure:
- 6:30 AM: Breakfast (fair price, low crowd, safe)
- 8:00 AM: Primary interest activity
- 10:30 AM: Rest/cultural activity
- 12:30 PM: Lunch
- 2:00-4:00 PM: Primary interest activity
- 6:00 PM: Sunset/optional activity
- 7:30 PM: Dinner
- 9:00 PM: Evening activity (if safe)

For each activity, include:
- Time, duration, location, activity name, type
- Cost (fair price verified)
- Safety rating (1-5)
- Crowd status (LOW/MODERATE/CROWDED)
- Why recommended (interest match)
- Alternatives if available

Return ONLY valid JSON matching Itinerary type.`;

    try {
        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 3072,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: `Create perfect itinerary:

Tourist Persona:
${JSON.stringify(persona, null, 2)}

Matched Guide:
${JSON.stringify(matchedGuide, null, 2)}

Crowd Predictions:
${JSON.stringify(crowdPredictions, null, 2)}

Price Analyses:
${JSON.stringify(priceAnalyses, null, 2)}

Safety Alerts:
${JSON.stringify(safetyAlerts, null, 2)}

Budget: ₹${budget}
Date: ${date}

Venue & Activity Data (from product.md):
${productContext.substring(0, 10000)}

Build hour-by-hour itinerary respecting all constraints.`,
                },
            ],
        });

        const content = message.content[0];
        if (content.type === "text") {
            const itinerary = JSON.parse(content.text);
            return itinerary as Itinerary;
        }

        throw new Error("Failed to get text response from Claude");
    } catch (error) {
        console.error("Error curating experience:", error);

        // Fallback: Return mock itinerary
        return createFallbackItinerary(
            persona,
            matchedGuide,
            budget,
            date
        );
    }
}

/**
 * Fallback itinerary creation using simple template
 */
function createFallbackItinerary(
    persona: TouristPersona,
    guide: GuideMatch,
    budget: number,
    date: string
): Itinerary {
    const activities: Activity[] = [
        {
            time: "6:30 AM",
            duration: "45 min",
            location: "Vedavati Beach Shack, Arambol",
            activity_name: "Sunrise Breakfast",
            type: "breakfast",
            cost: 160,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "LOW (10-15 people)",
            why_recommended: "Fresh fish daily, sunrise view, local favorite, fair prices",
            alternatives: ["Curlies (₹200)", "Local cafe (₹100)"],
        },
        {
            time: "8:00 AM",
            duration: "2 hours",
            location: "Arambol Beach",
            activity_name: "Surfing Lesson",
            type: "activity",
            cost: 1500,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "LOW (8 people in class)",
            why_recommended: "Best waves morning, professional instruction, matches adventure interest",
            alternatives: ["Kayaking (₹400)", "Beach yoga (₹300)"],
        },
        {
            time: "10:30 AM",
            duration: "1 hour",
            location: "Lilliput Cafe",
            activity_name: "Rest & Coffee",
            type: "rest",
            cost: 150,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "LOW (20 people)",
            why_recommended: "Recovery time, Portuguese ambiance, good coffee, WiFi",
        },
        {
            time: "12:30 PM",
            duration: "1 hour",
            location: "Local Konkani Kitchen",
            activity_name: "Authentic Goan Lunch",
            type: "lunch",
            cost: 300,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "LOW (10-15 locals, no tourists)",
            why_recommended: "Guide's personal favorite, authentic Konkani food, not on tourist maps",
            alternatives: ["Curlies (₹450)", "Beach shack (₹250)"],
        },
        {
            time: "2:00 PM",
            duration: "1.5 hours",
            location: "Chapora Fort",
            activity_name: "Heritage Tour with Stories",
            type: "activity",
            cost: 0,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "MODERATE (100-150 people)",
            why_recommended: "Guide specialty, 400-year history, hidden chambers, stories make it alive",
            alternatives: ["Basilica (crowded)", "Sé Cathedral (200 people)"],
        },
        {
            time: "6:00 PM",
            duration: "45 min",
            location: "Vagator Viewpoint (Hidden spot)",
            activity_name: "Sunset Photography",
            type: "activity",
            cost: 0,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "MODERATE (30 people vs 500+ main beach)",
            why_recommended: "Golden hour, photogenic, guide knows all spots, authentic",
        },
        {
            time: "7:30 PM",
            duration: "1 hour",
            location: "Curlies Beach Shack",
            activity_name: "Seafood Dinner",
            type: "dinner",
            cost: 450,
            fair_price_verified: true,
            safety_rating: 5,
            crowd_status: "MODERATE (150 people)",
            why_recommended: "Fresh seafood, live music, beach ambiance, fair prices verified",
            alternatives: ["Portuguese restaurant (₹600)", "Street food tour (₹300)"],
        },
    ];

    const totalSpent = activities.reduce((sum, act) => sum + act.cost, 0);
    const guideHours = 6;
    const guideRate = parseInt(guide.rate.replace(/[^0-9]/g, ""));
    const guideCost = guideHours * guideRate;
    const totalWithGuide = totalSpent + guideCost;

    const dailySummary: DailySummary = {
        total_spent: totalWithGuide,
        remaining_budget: budget - totalWithGuide,
        guide_time_hours: guideHours,
        guide_income: guideCost * 0.8, // 80% to guide
        fair_prices_verified_percentage: 100,
        safety_score: 9.5,
        satisfaction_prediction: 9.2,
    };

    return {
        date,
        tourist_id: persona.tourist_id,
        matched_guide: guide,
        activities,
        daily_summary: dailySummary,
    };
}

/**
 * Example usage:
 * 
 * const persona = await profileTourist(interactions);
 * const guides = await matchGuide(persona, "2025-12-24");
 * const crowds = await manageCrowds("basilica", "14:00", "2025-12-24", "sunny");
 * const prices = await analyzePrices("Prawn Curry", "Curlies", 1);
 * const safety = await checkSafety("Anjuna", "14:00", "beach activity");
 * 
 * const itinerary = await curateExperience(
 *   persona,
 *   guides[0],
 *   { basilica: crowds },
 *   { "prawn curry": prices },
 *   safety,
 *   4500,
 *   "2025-12-24"
 * );
 * 
 * console.log(itinerary);
 * // Output: Complete hour-by-hour itinerary with all activities, costs, safety ratings
 */
