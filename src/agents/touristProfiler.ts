/**
 * Agent 1: Tourist Profiler
 * 
 * Purpose: Understand tourist preferences through passive behavioral analysis
 * without requiring survey questions.
 * 
 * Algorithm:
 * - Track app interactions (clicks, searches, time spent)
 * - Calculate interest scores (adventure, food, culture, nightlife)
 * - Generate persona with confidence level
 * - Return: { persona, interests, confidence, budget_per_day }
 */

import { TouristPersona, AppInteractions } from "../types";
import { callAI, parseAIResponse } from "../utils/aiClient";

/**
 * Profile tourist based on app interaction patterns
 */
export async function profileTourist(
    appInteractions: AppInteractions
): Promise<TouristPersona> {
    const systemPrompt = `You are a tourist profiler for GoanFlow, an AI tourism OS for Goa.

Your task: Analyze app interaction patterns to create a detailed tourist persona.

Consider:
- Clicks on different sections (beaches, food, heritage, nightlife, adventure)
- Search queries (what they're looking for)
- Time spent on different pages (indicates interest level)
- Filters used (budget, group size, accessibility)

Calculate interest scores (0-100%) for:
- Adventure (water sports, hiking, risk activities)
- Food (restaurants, local cuisine, street food)
- Culture (heritage sites, museums, local experiences)
- Nightlife (bars, clubs, evening activities)
- Relaxation (beaches, spas, quiet activities)

Determine:
- Primary persona (adventurous_foodie, cultural_traveler, budget_backpacker, party_enthusiast, family_oriented, relaxation_seeker)
- Confidence level (0-1, how sure you are)
- Budget per day (infer from filters and searches)
- Group size (solo, couple, family, friends)
- Risk tolerance (low, moderate, high)

Return ONLY valid JSON with this structure:
{
  "tourist_id": "TOUR_XXX",
  "persona": "string",
  "confidence": 0-1,
  "interests": ["string"],
  "budget_per_day": number,
  "group_size": number,
  "risk_tolerance": "low|moderate|high",
  "dietary_restrictions": ["string"],
  "accessibility_needs": ["string"],
  "generated_at": "ISO timestamp"
}`;

    try {
        const response = await callAI(
            systemPrompt,
            `Analyze these app interactions and profile the tourist:\n\n${JSON.stringify(
                appInteractions,
                null,
                2
            )}`,
            1024
        );

        const persona = parseAIResponse<TouristPersona>(response);
        return persona;
    } catch (error) {
        console.error("Error profiling tourist:", error);

        // Fallback: Return default persona based on basic heuristics
        return createFallbackPersona(appInteractions);
    }
}

/**
 * Fallback persona creation using simple heuristics
 */
function createFallbackPersona(
    interactions: AppInteractions
): TouristPersona {
    const clicks = interactions.clicks || {};
    const searches = interactions.searches || [];
    const timeSpent = interactions.time_spent || {};

    // Calculate interest scores
    const adventureScore =
        (clicks.water_sports || 0) +
        (clicks.beaches || 0) +
        (clicks.adventure || 0);
    const foodScore =
        (clicks.food || 0) + (clicks.restaurants || 0) + (clicks.street_food || 0);
    const cultureScore =
        (clicks.heritage || 0) + (clicks.museums || 0) + (clicks.culture || 0);
    const nightlifeScore =
        (clicks.nightlife || 0) + (clicks.bars || 0) + (clicks.clubs || 0);

    // Determine primary persona
    const scores = {
        adventure: adventureScore,
        food: foodScore,
        culture: cultureScore,
        nightlife: nightlifeScore,
    };

    const primaryInterest = Object.keys(scores).reduce((a, b) =>
        scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    );

    // Determine persona
    let persona = "balanced_traveler";
    if (adventureScore > 5 && foodScore > 5) {
        persona = "adventurous_foodie";
    } else if (adventureScore > 8) {
        persona = "adventure_seeker";
    } else if (foodScore > 8) {
        persona = "food_enthusiast";
    } else if (cultureScore > 8) {
        persona = "cultural_traveler";
    } else if (nightlifeScore > 8) {
        persona = "party_enthusiast";
    }

    // Infer budget from filters
    const budgetFilter = interactions.filters_used?.budget || "moderate";
    let budgetPerDay = 4500;
    if (budgetFilter === "low") budgetPerDay = 2500;
    if (budgetFilter === "high") budgetPerDay = 8000;

    return {
        tourist_id: `TOUR_${Date.now()}`,
        persona,
        confidence: 0.75,
        interests: [primaryInterest, "beaches", "local_culture"],
        budget_per_day: budgetPerDay,
        group_size: interactions.filters_used?.group_size || 2,
        risk_tolerance: adventureScore > 7 ? "high" : "moderate",
        dietary_restrictions: interactions.filters_used?.dietary || [],
        accessibility_needs: interactions.filters_used?.accessibility || [],
        generated_at: new Date().toISOString(),
    };
}

/**
 * Example usage:
 * 
 * const interactions = {
 *   clicks: {
 *     beaches: 15,
 *     food: 12,
 *     water_sports: 8,
 *     heritage: 3
 *   },
 *   searches: ["best seafood", "surfing lessons", "beach shacks"],
 *   time_spent: {
 *     food_section: 180,
 *     beaches_section: 240,
 *     adventure_section: 120
 *   },
 *   filters_used: {
 *     budget: "moderate",
 *     group_size: 2
 *   }
 * };
 * 
 * const persona = await profileTourist(interactions);
 * console.log(persona);
 * // Output: { persona: "adventurous_foodie", confidence: 0.95, interests: ["water_sports", "street_food", "nightlife"], budget_per_day: 4500, ... }
 */
