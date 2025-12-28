/**
 * Food & Restaurant Agent (The Foodie)
 * 
 * Purpose: Recommend authentic restaurants, shacks, and hidden gems
 * Data Source: knowledge/food_restaurants.md
 */

import { getDomain } from "../utils/kb";

export interface RestaurantRecommendation {
    name: string;
    location: string;
    cuisine: string;
    signature_dish: string;
    price_range: string;
    rating: string;
    why_visit: string;
    local_tip: string;
    ambiance: string;
    best_for: string[];
}

export interface FoodResponse {
    recommendations: RestaurantRecommendation[];
    budget_tips: string[];
    safety_warnings: string[];
}

/**
 * Get restaurant recommendations based on preferences
 */
export async function recommendFood(
    budget: 'budget' | 'mid-range' | 'premium',
    cuisine: string,
    location: string,
    groupType: string
): Promise<FoodResponse> {
    const foodData = getDomain('food_restaurants');

    const recommendations: RestaurantRecommendation[] = [];

    // Parse restaurant sections (### numbered entries)
    const sections = foodData.split(/### \d+\./);

    for (const section of sections.slice(1)) { // Skip first empty split
        const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length === 0) continue;

        const name = lines[0].split('-')[0]?.trim() || lines[0];

        const getValue = (key: string): string => {
            const line = lines.find(l => l.toLowerCase().startsWith(`- **${key.toLowerCase()}`));
            return line?.split(':').slice(1).join(':').replace(/\*\*/g, '').trim() || '';
        };

        const priceStr = getValue('Average Price');
        const locationStr = getValue('Location');

        // Filter by budget
        const priceMatch = priceStr.match(/₹([\d,]+)/);
        const avgPrice = priceMatch ? parseInt(priceMatch[1].replace(',', '')) : 1000;

        let matchesBudget = false;
        if (budget === 'budget' && avgPrice < 600) matchesBudget = true;
        else if (budget === 'mid-range' && avgPrice >= 600 && avgPrice < 1500) matchesBudget = true;
        else if (budget === 'premium' && avgPrice >= 1500) matchesBudget = true;

        // Filter by location if specified
        const matchesLocation = !location || locationStr.toLowerCase().includes(location.toLowerCase());

        if (matchesBudget && matchesLocation) {
            recommendations.push({
                name,
                location: locationStr || 'Goa',
                cuisine: getValue('Cuisine') || 'Goan',
                signature_dish: getValue('Signature Dish') || 'Chef\'s Special',
                price_range: priceStr || '₹500-1000',
                rating: getValue('Rating') || '4.0/5',
                why_visit: getValue('Why Visit') || 'Authentic Goan experience',
                local_tip: getValue('Local Tip') || 'Ask for daily specials',
                ambiance: getValue('Ambiance') || 'Casual',
                best_for: [groupType]
            });
        }

        if (recommendations.length >= 5) break; // Limit to 5 recommendations
    }

    // Parse budget tips from Pricing Hacks section
    const budgetTips: string[] = [];
    const pricingSection = foodData.split('## Pricing Hacks')[1]?.split('##')[0];
    if (pricingSection) {
        const tipMatches = pricingSection.match(/\d+\.\s\*\*[^*]+\*\*:[^*\n]+/g);
        if (tipMatches) {
            budgetTips.push(...tipMatches.slice(0, 3).map(t => t.replace(/\*\*/g, '').trim()));
        }
    }

    // Parse safety warnings
    const safetyWarnings: string[] = [];
    const safetySection = foodData.split('## Safety Warnings')[1]?.split('##')[0];
    if (safetySection) {
        if (safetySection.includes('printed menu')) {
            safetyWarnings.push('Always ask for printed menu with prices before ordering');
        }
        if (safetySection.includes('freshness')) {
            safetyWarnings.push('Ask when fish was caught - should be same day');
        }
    }

    return {
        recommendations: recommendations.length > 0 ? recommendations : getDefaultRecommendations(),
        budget_tips: budgetTips.length > 0 ? budgetTips : ['Lunch thalis are 40% cheaper than dinner'],
        safety_warnings: safetyWarnings.length > 0 ? safetyWarnings : ['Check for health certificates at beach shacks']
    };
}

function getDefaultRecommendations(): RestaurantRecommendation[] {
    return [{
        name: "Ritz Classic",
        location: "Panjim & Margao",
        cuisine: "Traditional Goan",
        signature_dish: "Fish Thali",
        price_range: "₹700-1000 for two",
        rating: "4.3/5",
        why_visit: "Legendary restaurant loved by locals and tourists alike",
        local_tip: "Order the fish thali with pomfret",
        ambiance: "Bustling, lively",
        best_for: ["families", "couples", "solo"]
    }];
}

export default recommendFood;
