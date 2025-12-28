/**
 * GoanFlow Main Orchestrator
 * 
 * Simplified "Core 4" Architecture:
 * 1. The Shield (Price Intelligence + Safety Guardian)
 * 2. The Scout (Crowd Manager)
 * 3. The Stays (Accommodation Agent)
 * 4. The Navigator (Experience Curator)
 */

import { manageCrowds } from "./agents/crowdManager";
import { analyzePrices } from "./agents/priceIntelligence";
import { checkSafety } from "./agents/safetyGuardian";
import { recommendAccommodation } from "./agents/accommodationAgent";
import { curateExperience } from "./agents/experienceCurator";
import {
    UserInput,
    OrchestratorResponse,
    TouristPersona,
    CrowdPrediction,
    PriceAnalysis,
    SafetyResponse,
    Itinerary,
    AccommodationRecommendation,
} from "./types";

/**
 * Main orchestration function (Adaptive Dispatcher)
 */
export async function orchestrateGoanFlow(
    userInput: UserInput
): Promise<OrchestratorResponse> {
    try {
        console.log("🚀 GoanFlow Adaptive Orchestration Started");

        // 1. ADAPTIVE DISPATCHER: Check for missing vital info
        const missingInfo: string[] = [];
        if (!userInput.budget || userInput.budget <= 0) missingInfo.push("budget");
        if (!userInput.date) missingInfo.push("date");
        if (!userInput.preferences?.group_type) missingInfo.push("group_type (solo/couple/family/friends)");

        if (missingInfo.length > 0) {
            console.log(`⚠️  Needs More Info: Missing ${missingInfo.join(", ")}`);
            return {
                status: "needs_info",
                missing_info: missingInfo,
                message: "I need a bit more info to curate your perfect Goan experience. Could you provide your " + missingInfo.join(", ") + "?",
            };
        }

        console.log(`User ID: ${userInput.userId} | Budget: ₹${userInput.budget}`);
        console.log("\n" + "=".repeat(60) + "\n");

        // 2. CORE 4 FLOW

        // Step 1: The Shield (Security & Pricing)
        console.log("🛡️ STEP 1: Activating The Goan Shield...");
        const itemsToCheck = ["Prawn Curry", "Fish Thali"];
        const priceAnalyses: Record<string, PriceAnalysis> = {};
        for (const item of itemsToCheck) {
            priceAnalyses[item.toLowerCase()] = await analyzePrices(item, "Local Shack", 1);
        }

        const safetyAlerts: SafetyResponse = await checkSafety(
            userInput.location ? `${userInput.location.latitude},${userInput.location.longitude}` : "Anjuna Beach",
            userInput.start_time,
            "beach exploration"
        );
        console.log(`✓ Shield Active: Risk Level ${safetyAlerts.risk_level}/10`);
        console.log("\n");

        // Step 2: The Scout (Crowd Real-time)
        console.log("👥 STEP 2: The Scout is scanning crowds...");
        const venuesToCheck = ["basilica", "ashwem_beach"];
        const crowdPredictions: Record<string, CrowdPrediction> = {};
        for (const venue of venuesToCheck) {
            crowdPredictions[venue] = await manageCrowds(venue, userInput.start_time, userInput.date, "sunny");
        }
        console.log("✓ Scout Scanned: Crowds analyzed for key locations");
        console.log("\n");

        // Step 3: The Stays (Accommodation)
        console.log("🏨 STEP 3: Finding perfect stays...");
        // Mapping simple input to internal persona for types compatibility
        const persona: TouristPersona = {
            tourist_id: userInput.userId,
            persona: userInput.preferences?.group_type || "traveler",
            interests: Object.keys(userInput.appInteractions?.clicks || {}),
            budget_per_day: userInput.budget / 3, // Assuming 3-day average trip
            confidence: 1.0,
            group_size: userInput.preferences?.group_type === "solo" ? 1 : 2,
            risk_tolerance: 'moderate',
            dietary_restrictions: [],
            accessibility_needs: [],
            generated_at: new Date().toISOString()
        };
        const accommodations = await recommendAccommodation(persona);
        console.log(`✓ Stays Found: ${accommodations[0]?.recommendation.name || "Default Stay"}`);
        console.log("\n");

        // Step 4: The Navigator (Final Curation)
        console.log("🎯 STEP 4: The Navigator is building the trip...");
        const itinerary: Itinerary = await curateExperience(
            persona,
            { rank: 1, name: "Local Guide", score: 40, match_reason: "Cultural expert", guide_id: "G1", languages: ["English"], specialties: ["Culture"], rate: "₹800/hr", rating: "4.8", availability: [], reviews_highlight: [] },
            crowdPredictions,
            priceAnalyses,
            safetyAlerts,
            userInput.budget,
            userInput.date
        );
        console.log("✅ GoanFlow Orchestration Complete!");
        console.log("\n📋 ITINERARY SUMMARY:\n");
        itinerary.activities.forEach((activity) => {
            console.log(`${activity.time} → ${activity.activity_name}`);
            console.log(`  Location: ${activity.location}`);
            console.log(`  Cost: ₹${activity.cost} (fair price ✓)`);
            console.log(`  Crowd: ${activity.crowd_status}`);
            console.log(`  Safety: ${activity.safety_rating}/5 ⭐`);
            console.log(`  Why: ${activity.why_recommended}`);
            console.log("");
        });

        console.log("\n💡 DAILY SUMMARY:");
        console.log(`Total spent: ₹${itinerary.daily_summary.total_spent}`);
        console.log(`Remaining budget: ₹${itinerary.daily_summary.remaining_budget}`);
        console.log(
            `Guide income: ₹${itinerary.daily_summary.guide_income} (${itinerary.daily_summary.guide_time_hours} hours)`
        );
        console.log(
            `Fair prices verified: ${itinerary.daily_summary.fair_prices_verified_percentage}%`
        );
        console.log(`Safety score: ${itinerary.daily_summary.safety_score}/10`);
        console.log(
            `Satisfaction prediction: ${itinerary.daily_summary.satisfaction_prediction}/10`
        );

        return {
            persona,
            itinerary,
            accommodation: accommodations,
            safety_alerts: safetyAlerts.alerts,
            status: "success",
            message: "Perfect itinerary created! All agents coordinated successfully.",
        };
    } catch (error) {
        console.error("❌ Error in orchestration:", error);
        throw error;
    }
}

/**
 * Example usage / Demo
 */
async function demo() {
    console.log("--- TEST 1: MISSING INFO (Adaptive Flow) ---");
    const partialInput: UserInput = {
        userId: "USER_PARTIAL_001",
        date: "2025-12-28",
        budget: 0, // Missing budget
        appInteractions: { clicks: {}, searches: [], time_spent: {}, filters_used: {} },
        start_time: "09:00"
    };

    const result1 = await orchestrateGoanFlow(partialInput);
    console.log(`Status: ${result1.status}`);
    console.log(`Message: ${result1.message}\n`);

    console.log("--- TEST 2: FULL CONTEXT (Premium Flow) ---");
    const fullInput: UserInput = {
        userId: "DEMO_USER_001",
        date: "2025-12-28",
        start_time: "08:00",
        budget: 5000,
        appInteractions: {
            clicks: { beaches: 10, food: 5 },
            searches: [],
            time_spent: {},
            filters_used: {},
        },
        location: { latitude: 15.5597, longitude: 73.8083 },
        preferences: {
            pace: "moderate",
            group_type: "solo",
        },
    };

    const result2 = await orchestrateGoanFlow(fullInput);
    if (result2.status === "success" && result2.itinerary) {
        console.log(`✓ Generated ${result2.itinerary.activities.length} activities`);
        console.log(`✓ Selected Stay: ${result2.accommodation?.[0]?.recommendation.name}`);
        console.log(`✓ Safety Risk: ${result2.itinerary.daily_summary.safety_score}/10`);
    }
}

// Run demo if executed directly
if (require.main === module) {
    console.log("🏖️ GoanFlow Demo Starting...\n");
    demo().catch(console.error);
}

export default orchestrateGoanFlow;
