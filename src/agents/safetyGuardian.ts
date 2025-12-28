/**
 * Agent 6: Safety Guardian (The Shield)
 * 
 * Better Version: Uses Domain 6 of product.md for alerts and area safety
 */

import { SafetyResponse, SafetyAlert, EmergencyContacts } from "../types";
import { getDomain } from "../utils/kb";

/**
 * Analyze real-time safety
 */
export async function checkSafety(
    location: string,
    time: string,
    activityPreference: string,
    touristProfile?: any
): Promise<SafetyResponse> {
    const domainSafety = getDomain('safety');

    // Parse safety tables
    const lines = domainSafety.split('\n');
    const locationRow = lines.find(l => l.toLowerCase().includes(location.toLowerCase()) && l.includes('|'));

    const alerts: SafetyAlert[] = [];
    let riskLevel = 2; // Default safe

    if (locationRow) {
        const columns = locationRow.split('|').map(c => c.trim()).filter(c => c.length > 0);
        // Table: | Beach | Day | Night | Women | Risks | Mitigation | Best For |
        const dayRating = columns[1] || "";
        const nightRating = columns[2] || "";
        const keyRisks = columns[4] || "";
        const mitigation = columns[5] || "";

        if (keyRisks.toLowerCase().length > 5) {
            alerts.push({
                type: 'CRIME',
                severity: 'MEDIUM',
                message: `Active risks in ${location}: ${keyRisks}`,
                action: mitigation || "Secure belongings",
                location
            });
            riskLevel += 2;
        }

        // Time-based risk
        const hour = parseInt(time.split(':')[0]);
        if (hour >= 21 || hour < 5) {
            alerts.push({
                type: 'WOMEN_SAFETY',
                severity: 'MEDIUM',
                message: `Night safety in ${location} is rated ${nightRating}. Plan your return accordingly.`,
                action: "Use official taxis/GoaMiles",
                location
            });
            riskLevel += 3;
        }
    }

    // Always add weather info (Domain 6 context)
    alerts.push({
        type: 'WEATHER',
        severity: 'INFO',
        message: "Skies are clear, moderate humidity. Perfect for beach activities.",
        action: "Carry sunscreen",
        location: "Goa (General)"
    });

    const emergencyContacts: EmergencyContacts = {
        police: "100",
        ambulance: "108",
        tourist_helpline: "1363",
        nearby_hospital: "GMC Bambolim (District Hospital)"
    };

    return {
        alerts,
        emergency_contacts: emergencyContacts,
        risk_level: Math.min(riskLevel, 10),
        women_safety_tips: [
            "Share live location with emergency contact",
            "Prefer GoaMiles or pre-paid airport taxis",
            "Avoid desserted beach stretches after 11 PM"
        ]
    };
}
