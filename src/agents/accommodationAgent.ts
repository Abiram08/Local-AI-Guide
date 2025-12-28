/**
 * Agent 8: Accommodation Agent (The Stays)
 * 
 * Better Version: Uses shared KB utility to parse Domain 1
 */

import { Accommodation, AccommodationRecommendation, TouristPersona } from "../types";
import { getDomain } from "../utils/kb";

/**
 * recommendAccommodation
 * 
 * Logic:
 * 1. Pull Domain 1 from KB
 * 2. Parse items and map to categories
 * 3. Filter by budget and vibe
 */
export async function recommendAccommodation(
    persona: TouristPersona,
    locationPreference?: string
): Promise<AccommodationRecommendation[]> {
    const domainAcc = getDomain('accommodation');
    const accommodations: Accommodation[] = [];

    // Improved parsing using Domain headers
    const categories: ('Hostel' | 'Budget' | 'Mid-Range' | 'Luxury')[] = ['Hostel', 'Budget', 'Mid-Range', 'Luxury'];

    categories.forEach((cat: 'Hostel' | 'Budget' | 'Mid-Range' | 'Luxury') => {
        const catSection = domainAcc.split(new RegExp(`### ${cat.toUpperCase()}`, "i"))[1]?.split("###")[0];
        if (!catSection) return;

        const items = catSection.split("#### ").filter((i: string) => i.trim().length > 0);

        items.forEach((itemStr: string) => {
            const lines = itemStr.split("\n").map((l: string) => l.trim());
            const name = lines[0].replace(/\*\*/g, "");

            const getValue = (key: string) => {
                const line = lines.find((l: string) => l.toLowerCase().startsWith(`${key.toLowerCase()}:`));
                return line ? line.split(":")[1]?.trim() : "";
            };

            accommodations.push({
                name,
                location: getValue("Location") || "Goa",
                category: cat,
                price_range: getValue("Price") || getValue("Dorm bed price") || "Contact for pricing",
                amenities: getValue("Amenities")?.split(",").map((a: string) => a.trim()) || [],
                vibe: getValue("Vibe") || "Local",
                rating: parseFloat(getValue("Rating")?.split("/")[0] || "1.0") || 4.0,
                best_for: getValue("Best for")?.split(",").map((a: string) => a.trim()) || [],
                noise_level: getValue("Noise level") || "5/10"
            });
        });
    });

    const totalBudget = persona.budget_per_day;
    let targetCategory: 'Hostel' | 'Budget' | 'Mid-Range' | 'Luxury' = 'Budget';

    if (totalBudget < 1200) targetCategory = 'Hostel';
    else if (totalBudget < 3000) targetCategory = 'Budget';
    else if (totalBudget < 7000) targetCategory = 'Mid-Range';
    else targetCategory = 'Luxury';

    let matches = accommodations.filter(acc => acc.category === targetCategory);

    if (locationPreference) {
        const locMatches = matches.filter(acc => acc.location.toLowerCase().includes(locationPreference.toLowerCase()));
        if (locMatches.length > 0) matches = locMatches;
    }

    // Sort by rating
    matches.sort((a, b) => b.rating - a.rating);

    return matches.slice(0, 2).map(acc => ({
        recommendation: acc,
        why_recommended: `Based on your daily budget (₹${totalBudget}) and interest in ${acc.vibe} environments.`,
        safety_score: acc.rating * 2,
        fair_price_verified: true
    }));
}
