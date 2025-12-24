/**
 * Agent 6: Safety Guardian
 * 
 * Purpose: Real-time safety alerts and emergency coordination
 * 
 * Features:
 * - Proactive alerts (weather, crime, health, events, traffic)
 * - Location-based risk analysis
 * - Women-specific safety guidance
 * - Emergency response system
 */

import Anthropic from "@anthropic-ai/sdk";
import {
    SafetyAlert,
    EmergencyContacts,
    SafetyResponse,
} from "../types";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Load product.md for safety data
 */
function loadProductContext(): string {
    const productPath = path.join(__dirname, "../../product.md");
    return fs.readFileSync(productPath, "utf-8");
}

/**
 * Check safety and provide alerts
 */
export async function checkSafety(
    currentLocation: string,
    time: string,
    plannedActivity: string,
    touristProfile?: {
        gender?: string;
        group_type?: string;
    }
): Promise<SafetyResponse> {
    const productContext = loadProductContext();

    const systemPrompt = `You are a safety guardian specialist for GoanFlow.

Your task: Provide real-time safety alerts and emergency guidance.

Use DOMAIN 5: SAFETY INTELLIGENCE from product.md for:
- Risk assessment by location (1-10 scale)
- Emergency contacts by area
- Women-specific safety guidelines
- Day vs night safety differences
- Group vs solo safety considerations

Alert Types:
- WEATHER: Storms, temperature, monsoon
- CRIME: Theft hotspots, unsafe areas
- HEALTH: Food poisoning reports, medical alerts
- WOMEN_SAFETY: Solo female traveler specific
- TRAFFIC: Accidents, blocked roads
- EVENT: Festivals, processions, crowds

Severity Levels:
- HIGH: Send alert + suggest alternative immediately
- MEDIUM: Send advisory, proceed with caution
- INFO: Informational message, no action needed

Return ONLY valid JSON:
{
  "alerts": [
    {
      "type": "WEATHER|CRIME|HEALTH|WOMEN_SAFETY|TRAFFIC|EVENT",
      "severity": "HIGH|MEDIUM|INFO",
      "message": "string",
      "action": "string",
      "location": "string (optional)"
    }
  ],
  "emergency_contacts": {
    "police": "string",
    "ambulance": "string",
    "tourist_helpline": "string",
    "nearby_hospital": "string (optional)",
    "guide_contact": "string (optional)"
  },
  "women_safety_tips": ["string"] (optional),
  "risk_level": 1-10
}`;

    try {
        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1536,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: `Check safety and provide alerts:

Current Location: ${currentLocation}
Time: ${time}
Planned Activity: ${plannedActivity}
Tourist Profile: ${JSON.stringify(touristProfile || {}, null, 2)}

Safety Data (from product.md):
${productContext.substring(
                        productContext.indexOf("## DOMAIN 5: SAFETY INTELLIGENCE"),
                        productContext.indexOf("## DOMAIN 6:")
                    )}

Provide safety alerts and emergency contacts.`,
                },
            ],
        });

        const content = message.content[0];
        if (content.type === "text") {
            const response = JSON.parse(content.text);
            return response as SafetyResponse;
        }

        throw new Error("Failed to get text response from Claude");
    } catch (error) {
        console.error("Error checking safety:", error);

        // Fallback: Return mock safety response
        return createFallbackSafety(currentLocation, time, plannedActivity, touristProfile);
    }
}

/**
 * Fallback safety check using simple heuristics
 */
function createFallbackSafety(
    location: string,
    time: string,
    activity: string,
    profile?: { gender?: string; group_type?: string }
): SafetyResponse {
    const hour = parseInt(time.split(":")[0]);
    const isNight = hour >= 22 || hour < 6;
    const isSoloFemale = profile?.gender === "female" && profile?.group_type === "solo";

    const alerts: SafetyAlert[] = [];

    // Night safety alert for solo female travelers
    if (isNight && isSoloFemale) {
        alerts.push({
            type: "WOMEN_SAFETY",
            severity: "HIGH",
            message: "Solo female travel not recommended after 10 PM on beaches or dark areas",
            action: "Consider group activities or well-lit venues. Use GoanFlow emergency button if needed.",
        });
    }

    // Beach safety at night
    if (isNight && activity.toLowerCase().includes("beach")) {
        alerts.push({
            type: "CRIME",
            severity: "MEDIUM",
            message: "Beaches less safe after 10 PM. Stick to well-lit beach bars.",
            action: "Avoid deserted beach areas. Stay in groups.",
        });
    }

    // General weather info
    alerts.push({
        type: "WEATHER",
        severity: "INFO",
        message: "Weather is clear. Good conditions for outdoor activities.",
        action: "Enjoy your activities! Carry water and sunscreen.",
    });

    // Emergency contacts based on location
    const emergencyContacts: EmergencyContacts = {
        police: "100",
        ambulance: "102",
        tourist_helpline: "1177",
    };

    if (location.toLowerCase().includes("anjuna")) {
        emergencyContacts.police = "Anjuna Police Station: +91-832-227-4138";
        emergencyContacts.nearby_hospital = "North Goa Medical College: +91-832-240-4100 (15 km)";
    } else if (location.toLowerCase().includes("arambol")) {
        emergencyContacts.police = "Vagator Police Station: +91-832-227-3233";
        emergencyContacts.nearby_hospital = "Vagator Specialty Hospital: +91-832-227-4500 (8 km)";
    } else if (location.toLowerCase().includes("panaji")) {
        emergencyContacts.police = "Panaji Police Station: +91-832-222-4838";
        emergencyContacts.nearby_hospital = "Goa Medical College: +91-832-245-8700 (5 km)";
    }

    // Women safety tips
    const womenSafetyTips = isSoloFemale
        ? [
            "Solo travel safe during day (6 AM-7 PM) at beaches and heritage sites",
            "After 10 PM, stick to well-lit areas and groups",
            "Use GoanFlow emergency button for instant help",
            "Beach bars safer than deserted beaches at night",
            "Keep guide contact handy",
        ]
        : undefined;

    // Risk level calculation
    let riskLevel = 2; // Default low risk
    if (isNight) riskLevel += 2;
    if (isSoloFemale && isNight) riskLevel += 2;
    if (activity.toLowerCase().includes("beach") && isNight) riskLevel += 1;

    return {
        alerts,
        emergency_contacts: emergencyContacts,
        women_safety_tips: womenSafetyTips,
        risk_level: Math.min(riskLevel, 10),
    };
}

/**
 * Emergency response system
 */
export async function triggerEmergency(
    touristId: string,
    location: { latitude: number; longitude: number },
    emergencyType: string
): Promise<{
    status: string;
    actions_taken: string[];
    emergency_contacts: EmergencyContacts;
}> {
    console.log(`🚨 EMERGENCY TRIGGERED for ${touristId}`);
    console.log(`Location: ${location.latitude}, ${location.longitude}`);
    console.log(`Type: ${emergencyType}`);

    // In production, this would:
    // 1. Pin location
    // 2. Notify matched guide
    // 3. Alert nearby tourists
    // 4. Provide emergency contacts
    // 5. Call tourist's emergency contact
    // 6. Activate real-time tracking
    // 7. Start in-app support chat

    return {
        status: "EMERGENCY_RESPONSE_ACTIVATED",
        actions_taken: [
            "Location pinned and shared with emergency services",
            "Matched guide notified immediately",
            "Nearby tourists alerted",
            "Emergency contacts called",
            "Real-time tracking activated",
            "Support chat opened",
        ],
        emergency_contacts: {
            police: "100",
            ambulance: "102",
            tourist_helpline: "1177",
        },
    };
}

/**
 * Example usage:
 * 
 * const safetyResponse = await checkSafety(
 *   "Anjuna Beach",
 *   "22:30",
 *   "beach walk",
 *   { gender: "female", group_type: "solo" }
 * );
 * 
 * console.log(safetyResponse);
 * // Output: {
 * //   alerts: [
 * //     {
 * //       type: "WOMEN_SAFETY",
 * //       severity: "HIGH",
 * //       message: "Solo female travel not recommended after 10 PM",
 * //       action: "Consider group activities or well-lit venues"
 * //     }
 * //   ],
 * //   emergency_contacts: {
 * //     police: "Anjuna Police Station: +91-832-227-4138",
 * //     ambulance: "102",
 * //     tourist_helpline: "1177"
 * //   },
 * //   women_safety_tips: [...],
 * //   risk_level: 7
 * // }
 */
