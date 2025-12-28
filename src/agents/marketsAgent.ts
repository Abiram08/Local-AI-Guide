/**
 * Markets Agent (The Shopper)
 * 
 * Purpose: Guide tourists to best markets, flea markets, and shopping spots
 * Data Source: knowledge/markets.md
 */

import { getDomain } from "../utils/kb";

export interface MarketInfo {
    name: string;
    location: string;
    type: 'flea' | 'night' | 'fish' | 'spice' | 'local' | 'tourist';
    timing: string;
    best_day: string;
    what_to_buy: string[];
    price_range: string;
    bargaining_tips: string;
    crowd_level: string;
    rating: number;
}

export interface MarketsResponse {
    recommended_markets: MarketInfo[];
    shopping_tips: string[];
    scam_warnings: string[];
    best_time_to_visit: string;
}

/**
 * Get market recommendations based on preferences
 */
export async function recommendMarkets(
    shoppingInterests: string[],
    dayOfWeek: string,
    location: string,
    budget: 'budget' | 'mid-range' | 'premium'
): Promise<MarketsResponse> {
    const marketsData = getDomain('markets');

    const markets: MarketInfo[] = [];

    // Parse market sections
    const sections = marketsData.split(/###\s+\d+\.\d+|####/).filter(s => s.trim().length > 50);

    for (const section of sections) {
        const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 3) continue;

        const name = lines[0].replace(/\*\*/g, '').split('(')[0].trim();
        if (!name || name.length < 3) continue;

        const getValue = (key: string): string => {
            const line = lines.find(l => l.toLowerCase().includes(key.toLowerCase()));
            return line?.split(':').slice(1).join(':').replace(/\*\*/g, '').trim() || '';
        };

        const timing = getValue('Hours') || getValue('Timing') || getValue('Operating');
        const locationStr = getValue('Location') || 'Goa';

        // Determine market type
        let type: MarketInfo['type'] = 'local';
        const sectionLower = section.toLowerCase();
        if (sectionLower.includes('flea')) type = 'flea';
        else if (sectionLower.includes('night')) type = 'night';
        else if (sectionLower.includes('fish')) type = 'fish';
        else if (sectionLower.includes('spice')) type = 'spice';
        else if (sectionLower.includes('tourist')) type = 'tourist';

        // Filter by location if specified
        if (location && !locationStr.toLowerCase().includes(location.toLowerCase()) &&
            !section.toLowerCase().includes(location.toLowerCase())) {
            continue;
        }

        markets.push({
            name,
            location: locationStr,
            type,
            timing: timing || '9 AM - 6 PM',
            best_day: getValue('Best Day') || dayOfWeek || 'Saturday',
            what_to_buy: extractWhatToBuy(section),
            price_range: getValue('Price') || 'Varies - bargain expected',
            bargaining_tips: getValue('Bargain') || 'Start at 50% of quoted price',
            crowd_level: getValue('Crowd') || 'Moderate',
            rating: parseFloat(getValue('Rating')?.split('/')[0]) || 4.0
        });

        if (markets.length >= 5) break;
    }

    // Parse shopping tips
    const shoppingTips = extractTips(marketsData, 'tip');

    // Parse scam warnings
    const scamWarnings = extractTips(marketsData, 'scam|warn|avoid');

    return {
        recommended_markets: markets.length > 0 ? markets : getDefaultMarkets(),
        shopping_tips: shoppingTips.length > 0 ? shoppingTips : [
            'Bargaining is expected - start at 40-50% of quoted price',
            'Cash is king - many vendors don\'t accept cards',
            'Compare prices at multiple stalls before buying'
        ],
        scam_warnings: scamWarnings.length > 0 ? scamWarnings : [
            'Beware of fake branded goods',
            'Check quality before paying'
        ],
        best_time_to_visit: 'Morning (9-11 AM) for less crowds, Evening (5-7 PM) for best atmosphere'
    };
}

function extractWhatToBuy(section: string): string[] {
    const items: string[] = [];
    const keywords = ['clothes', 'jewelry', 'spices', 'handicrafts', 'souvenirs', 'textiles',
        'bags', 'shoes', 'accessories', 'antiques', 'art', 'food', 'fish', 'seafood'];

    const sectionLower = section.toLowerCase();
    for (const keyword of keywords) {
        if (sectionLower.includes(keyword)) {
            items.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }
    }

    return items.length > 0 ? items : ['Local handicrafts', 'Souvenirs'];
}

function extractTips(data: string, pattern: string): string[] {
    const tips: string[] = [];
    const regex = new RegExp(`[^.]*${pattern}[^.]*\\.`, 'gi');
    const matches = data.match(regex);

    if (matches) {
        tips.push(...matches.slice(0, 3).map(t => t.trim()));
    }

    return tips;
}

function getDefaultMarkets(): MarketInfo[] {
    return [
        {
            name: "Anjuna Flea Market",
            location: "Anjuna Beach, North Goa",
            type: 'flea',
            timing: "8 AM - 6 PM (Wednesdays only)",
            best_day: "Wednesday",
            what_to_buy: ["Clothes", "Jewelry", "Handicrafts", "Souvenirs"],
            price_range: "₹100 - ₹5000+",
            bargaining_tips: "Start at 40% of quoted price",
            crowd_level: "High",
            rating: 4.2
        },
        {
            name: "Saturday Night Market",
            location: "Arpora, North Goa",
            type: 'night',
            timing: "4 PM - 12 AM (Saturdays only)",
            best_day: "Saturday",
            what_to_buy: ["Clothes", "Food", "Accessories", "Art"],
            price_range: "₹200 - ₹10000+",
            bargaining_tips: "Less bargaining expected, prices more fixed",
            crowd_level: "Very High",
            rating: 4.5
        }
    ];
}

export default recommendMarkets;
