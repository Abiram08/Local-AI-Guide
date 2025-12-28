/**
 * Agent 3: Crowd Manager (The Scout)
 * 
 * Better Version: Uses Domain 4 of product.md for crowd data and seasonality
 */

import { CrowdPrediction, VenueStatus, AlternativeVenue } from "../types";
import { getDomain } from "../utils/kb";

/**
 * Manage crowds and predict status
 */
export async function manageCrowds(
    venueId: string,
    time: string,
    date: string,
    weather: string
): Promise<CrowdPrediction> {
    const domainCrowds = getDomain('crowds');

    // Parse location crowd data
    const sections = domainCrowds.split('#### ');
    const venueSection = sections.find(s => s.toLowerCase().includes(venueId.toLowerCase()));

    // Default values
    let baseCrowd = 50; // default %
    let status: 'LOW' | 'MODERATE' | 'CROWDED' | 'VERY_CROWDED' = 'LOW';
    let venueName = venueId.charAt(0).toUpperCase() + venueId.slice(1);

    if (venueSection) {
        const lines = venueSection.split('\n');
        venueName = lines[0].trim();

        const occupancyLine = lines.find(l => l.toLowerCase().includes('occupancy %'));
        if (occupancyLine) {
            const columns = occupancyLine.split('|').map(c => c.trim()).filter(c => c.length > 0);
            // Table: | Occupancy % | Best Time % | Worst Time % | Details |
            const worstTimeVal = columns[2] || "80%";
            baseCrowd = parseInt(worstTimeVal.replace('%', ''));
        }
    }

    // Apply Seasonal Multiplier (from Domain 4 table)
    const month = new Date(date).getMonth();
    let multiplier = 1.0;
    if (month === 11 || month === 0) multiplier = 2.5; // Dec-Jan
    else if (month === 1) multiplier = 3.0; // Feb (Carnival)
    else if (month === 4 || month === 5) multiplier = 0.5; // May-Jun

    const currentCrowd = Math.round(baseCrowd * multiplier);

    if (currentCrowd < 200) status = 'LOW';
    else if (currentCrowd < 500) status = 'MODERATE';
    else if (currentCrowd < 800) status = 'CROWDED';
    else status = 'VERY_CROWDED';

    const venueStatus: VenueStatus = {
        name: venueName,
        current_crowd: currentCrowd,
        predicted_peak_in_30_min: Math.round(currentCrowd * 1.1),
        status: status,
    };

    // Find alternatives (heuristic fallback or from context)
    const alternatives: AlternativeVenue[] = [
        {
            name: "Mandrem Beach (Quiet Zone)",
            current_crowd: 45,
            drive_time: "25 min",
            rating: "4.8",
            why: "Crowd status is LOW compared to Baga. Ideal for susegad vibes."
        }
    ];

    return {
        venue: venueStatus,
        alternatives: currentCrowd > 600 ? alternatives : [],
        prediction_confidence: 0.88,
    };
}
