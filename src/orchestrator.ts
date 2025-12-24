/**
 * GoanFlow Main Orchestrator
 * 
 * This is the main entry point that coordinates all 6 agents to deliver
 * personalized, fair-priced, and safe travel experiences in Goa.
 * 
 * Flow:
 * 1. Profile tourist (Agent 1)
 * 2. Match guide (Agent 2)
 * 3. Check crowds (Agent 3)
 * 4. Analyze prices (Agent 4)
 * 5. Check safety (Agent 6)
 * 6. Curate experience (Agent 5 - orchestrator)
 */

import { profileTourist } from "./agents/touristProfiler";
import { matchGuide } from "./agents/guideMatcher";
import { manageCrowds } from "./agents/crowdManager";
import { analyzePrices } from "./agents/priceIntelligence";
import { checkSafety } from "./agents/safetyGuardian";
import { curateExperience } from "./agents/experienceCurator";
import {
    UserInput,
    OrchestratorResponse,
    TouristPersona,
    GuideMatch,
    CrowdPrediction,
    PriceAnalysis,
    SafetyResponse,
    Itinerary,
} from "./types";

/**
 * Main orchestration function
 * Coordinates all 6 agents to create perfect travel experience
 */
export async function orchestrateGoanFlow(
    userInput: UserInput
): Promise<OrchestratorResponse> {
    try {
        console.log("🚀 GoanFlow Orchestration Started");
        console.log(`User ID: ${userInput.userId}`);
        console.log(`Date: ${userInput.date}`);
        console.log(`Budget: ₹${userInput.budget}`);
        console.log("\n" + "=".repeat(60) + "\n");

        // Step 1: Profile Tourist (Agent 1)
        console.log("📊 Step 1: Profiling tourist...");
        const persona: TouristPersona = await profileTourist(
            userInput.appInteractions
        );
        console.log(`✓ Tourist profiled: ${persona.persona}`);
        console.log(`  Interests: ${persona.interests.join(", ")}`);
        console.log(`  Confidence: ${(persona.confidence * 100).toFixed(0)}%`);
        console.log(`  Budget per day: ₹${persona.budget_per_day}`);
        console.log("\n");

        // Step 2: Match Guide (Agent 2)
        console.log("🧑‍🤝‍🧑 Step 2: Matching guide...");
        const guides: GuideMatch[] = await matchGuide(persona, userInput.date);
        const matchedGuide = guides[0]; // Top match
        console.log(`✓ Guide matched: ${matchedGuide.name}`);
        console.log(`  Score: ${matchedGuide.score}/40`);
        console.log(`  Match reason: ${matchedGuide.match_reason}`);
        console.log(`  Rate: ${matchedGuide.rate}`);
        console.log("\n");

        // Step 3: Check Crowds (Agent 3)
        console.log("👥 Step 3: Analyzing crowds...");
        const venuesToCheck = ["basilica", "fort_aguada", "anjuna_beach"];
        const crowdPredictions: Record<string, CrowdPrediction> = {};

        for (const venue of venuesToCheck) {
            const prediction = await manageCrowds(
                venue,
                userInput.start_time,
                userInput.date,
                "sunny" // In production, get real weather
            );
            crowdPredictions[venue] = prediction;
            console.log(
                `  ${prediction.venue.name}: ${prediction.venue.status} (${prediction.venue.current_crowd} people)`
            );
        }
        console.log("✓ Crowds analyzed");
        console.log("\n");

        // Step 4: Analyze Prices (Agent 4)
        console.log("💰 Step 4: Verifying fair prices...");
        const itemsToCheck = ["Prawn Curry", "Fish Thali", "Masala Chai"];
        const priceAnalyses: Record<string, PriceAnalysis> = {};

        for (const item of itemsToCheck) {
            const analysis = await analyzePrices(item, "Curlies Beach Shack", 1);
            priceAnalyses[item.toLowerCase()] = analysis;
            console.log(
                `  ${item}: ₹${analysis.goanflow_price} (fair), market: ${analysis.market_overcharge_detection.typical_charged}`
            );
        }
        console.log("✓ Prices verified");
        console.log("\n");

        // Step 5: Check Safety (Agent 6)
        console.log("🛡️ Step 5: Checking safety...");
        const safetyAlerts: SafetyResponse = await checkSafety(
            userInput.location
                ? `${userInput.location.latitude},${userInput.location.longitude}`
                : "Anjuna Beach",
            userInput.start_time,
            "beach activities",
            {
                gender: userInput.preferences?.group_type === "solo" ? "female" : undefined,
                group_type: userInput.preferences?.group_type,
            }
        );
        console.log(`  Risk level: ${safetyAlerts.risk_level}/10`);
        console.log(`  Active alerts: ${safetyAlerts.alerts.length}`);
        if (safetyAlerts.alerts.length > 0) {
            safetyAlerts.alerts.forEach((alert) => {
                console.log(`    - [${alert.severity}] ${alert.message}`);
            });
        }
        console.log("✓ Safety checked");
        console.log("\n");

        // Step 6: Curate Experience (Agent 5 - Orchestrator)
        console.log("🎯 Step 6: Curating perfect experience...");
        const itinerary: Itinerary = await curateExperience(
            persona,
            matchedGuide,
            crowdPredictions,
            priceAnalyses,
            safetyAlerts,
            userInput.budget,
            userInput.date
        );
        console.log("✓ Itinerary created");
        console.log(`  Activities: ${itinerary.activities.length}`);
        console.log(`  Total spent: ₹${itinerary.daily_summary.total_spent}`);
        console.log(
            `  Remaining budget: ₹${itinerary.daily_summary.remaining_budget}`
        );
        console.log(
            `  Satisfaction prediction: ${itinerary.daily_summary.satisfaction_prediction}/10`
        );
        console.log("\n" + "=".repeat(60) + "\n");

        // Success response
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
    const userInput: UserInput = {
        userId: "DEMO_USER_001",
        date: "2025-12-28",
        start_time: "06:30",
        budget: 4500,
        appInteractions: {
            clicks: {
                beaches: 15,
                food: 12,
                water_sports: 8,
                heritage: 3,
                nightlife: 5,
            },
            searches: ["best seafood", "surfing lessons", "beach shacks", "sunset spots"],
            time_spent: {
                food_section: 180,
                beaches_section: 240,
                adventure_section: 120,
                heritage_section: 60,
            },
            filters_used: {
                budget: "moderate",
                group_size: 2,
            },
        },
        location: {
            latitude: 15.5597,
            longitude: 73.8083,
        },
        preferences: {
            pace: "moderate",
            group_type: "couple",
        },
    };

    try {
        const result = await orchestrateGoanFlow(userInput);
        console.log("\n🎉 SUCCESS! GoanFlow delivered personalized experience.");
        console.log(`Status: ${result.status}`);
        console.log(`Message: ${result.message}`);
    } catch (error) {
        console.error("Demo failed:", error);
    }
}

// Run demo if executed directly
if (require.main === module) {
    console.log("🏖️ GoanFlow Demo Starting...\n");
    demo().catch(console.error);
}

export default orchestrateGoanFlow;
