/**
 * Activities Agent (The Explorer)
 * 
 * Purpose: Recommend waterfalls, nightlife, wellness, heritage sites, and adventures
 * Data Source: knowledge/activities.md
 */

import { getDomain } from "../utils/kb";

export interface ActivityInfo {
    name: string;
    category: 'waterfall' | 'nightlife' | 'wellness' | 'heritage' | 'adventure' | 'beach';
    location: string;
    entry_fee: string;
    duration: string;
    best_time: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    rating: number;
    description: string;
    tips: string[];
    warnings: string[];
}

export interface ActivitiesResponse {
    recommended_activities: ActivityInfo[];
    day_plan: string;
    total_cost_estimate: string;
    safety_notes: string[];
}

/**
 * Get activity recommendations based on preferences
 */
export async function recommendActivities(
    interests: string[],
    budget: number,
    fitnessLevel: 'low' | 'moderate' | 'high',
    timeAvailable: number // hours
): Promise<ActivitiesResponse> {
    const activitiesData = getDomain('activities');

    const activities: ActivityInfo[] = [];

    // Parse Waterfalls section
    if (interests.includes('nature') || interests.includes('waterfalls') || interests.includes('adventure')) {
        const waterfallSection = activitiesData.split('## 1. WATERFALLS')[1]?.split('## 2.')[0];
        if (waterfallSection) {
            activities.push(parseWaterfallInfo(waterfallSection, 'Dudhsagar'));
        }
    }

    // Parse Nightlife section
    if (interests.includes('nightlife') || interests.includes('party') || interests.includes('clubs')) {
        const nightlifeSection = activitiesData.split('## 2. NIGHTLIFE')[1]?.split('## 3.')[0];
        if (nightlifeSection) {
            activities.push(...parseNightlifeInfo(nightlifeSection));
        }
    }

    // Parse Wellness section
    if (interests.includes('wellness') || interests.includes('spa') || interests.includes('yoga')) {
        const wellnessSection = activitiesData.split('## 3. WELLNESS')[1]?.split('## 4.')[0];
        if (wellnessSection) {
            activities.push(...parseWellnessInfo(wellnessSection));
        }
    }

    // Parse Heritage section
    if (interests.includes('heritage') || interests.includes('culture') || interests.includes('history')) {
        const heritageSection = activitiesData.split('UNESCO')[1]?.split('##')[0];
        if (heritageSection) {
            activities.push(...parseHeritageInfo(heritageSection));
        }
    }

    // Filter by budget and fitness
    const filtered = activities.filter(a => {
        const costMatch = a.entry_fee.match(/₹([\d,]+)/);
        const cost = costMatch ? parseInt(costMatch[1].replace(',', '')) : 500;

        if (cost > budget * 0.3) return false; // Single activity shouldn't exceed 30% of total budget

        if (fitnessLevel === 'low' && a.difficulty === 'hard') return false;

        return true;
    });

    // Calculate total cost
    const totalCost = filtered.reduce((sum, a) => {
        const costMatch = a.entry_fee.match(/₹([\d,]+)/);
        return sum + (costMatch ? parseInt(costMatch[1].replace(',', '')) : 500);
    }, 0);

    // Generate day plan
    const dayPlan = generateDayPlan(filtered, timeAvailable);

    return {
        recommended_activities: filtered.length > 0 ? filtered.slice(0, 4) : getDefaultActivities(),
        day_plan: dayPlan,
        total_cost_estimate: `₹${totalCost}-${totalCost + 1000}`,
        safety_notes: [
            'Always carry water and sunscreen',
            'Inform hotel of your itinerary',
            'Keep emergency contacts handy'
        ]
    };
}

function parseWaterfallInfo(section: string, name: string): ActivityInfo {
    const lines = section.split('\n');

    const getValue = (key: string): string => {
        const line = lines.find(l => l.toLowerCase().includes(key.toLowerCase()));
        return line?.split(':').slice(1).join(':').replace(/\*\*/g, '').trim() || '';
    };

    return {
        name: 'Dudhsagar Waterfall',
        category: 'waterfall',
        location: getValue('Location') || 'Mollem National Park',
        entry_fee: getValue('Entry Fee') || '₹100-260',
        duration: '5-6 hours round trip',
        best_time: getValue('Best Time') || '6-8 AM (less crowded)',
        difficulty: 'moderate',
        rating: 4.0,
        description: '310m cascade, known as "Sea of Milk", Goa\'s #1 waterfall',
        tips: [
            'Book jeep safari in advance',
            'Carry 3L+ water and snacks',
            'Life jacket mandatory for swimming'
        ],
        warnings: [
            'Avoid 1-3 PM (peak crowd, hot)',
            'Monsoon: beautiful but dangerous currents'
        ]
    };
}

function parseNightlifeInfo(section: string): ActivityInfo[] {
    return [
        {
            name: "Tito's Nightclub",
            category: 'nightlife',
            location: "Baga Beach, North Goa",
            entry_fee: "₹1,500-2,000 (couples), ₹2,000-3,000 (stag)",
            duration: "4-5 hours",
            best_time: "9 PM - 4 AM",
            difficulty: 'easy',
            rating: 4.2,
            description: "Most famous club in Asia, high-energy EDM and Bollywood",
            tips: [
                'Book online for 10-15% discount',
                'Go before 10 PM for less crowds',
                'Smart casual dress code'
            ],
            warnings: [
                'Dec 25-Jan 2: +50% surcharge',
                'Don\'t accept drinks from strangers'
            ]
        },
        {
            name: "Club Cubana",
            category: 'nightlife',
            location: "Arpora, North Goa",
            entry_fee: "₹2,000 (couples)",
            duration: "3-4 hours",
            best_time: "6-8 PM (happy hour) or 10 PM onwards",
            difficulty: 'easy',
            rating: 4.4,
            description: "Rooftop club with sea views, tropical open-air setting",
            tips: [
                'Happy hour 6-8 PM is cheapest',
                'Best sunset views 6:30-7:30 PM'
            ],
            warnings: []
        }
    ];
}

function parseWellnessInfo(section: string): ActivityInfo[] {
    return [
        {
            name: "Soul Vacation Ayurveda",
            category: 'wellness',
            location: "Colva, South Goa",
            entry_fee: "₹15,000-27,000 (2N/3D package)",
            duration: "Full day or multi-day",
            best_time: "Morning sessions recommended",
            difficulty: 'easy',
            rating: 4.5,
            description: "Premium Ayurveda with doctor consultation, lake-facing cottages",
            tips: [
                'Book direct for discounts',
                'Vegetarian meals included'
            ],
            warnings: [
                'Consult doctor about allergies before treatment'
            ]
        }
    ];
}

function parseHeritageInfo(section: string): ActivityInfo[] {
    return [
        {
            name: "Sé Cathedral, Old Goa",
            category: 'heritage',
            location: "Old Goa",
            entry_fee: "FREE",
            duration: "45 min - 1.5 hours",
            best_time: "7:30-8:30 AM (peaceful, best light)",
            difficulty: 'easy',
            rating: 4.6,
            description: "Largest church in Asia, UNESCO World Heritage Site",
            tips: [
                'Cover shoulders and knees',
                'Best combined with Basilica of Bom Jesus nearby'
            ],
            warnings: [
                'Avoid 12-3 PM (hot, crowded)'
            ]
        }
    ];
}

function generateDayPlan(activities: ActivityInfo[], hours: number): string {
    if (activities.length === 0) return "Flexible exploration day";

    const plan = activities.slice(0, 3).map((a, i) => {
        const startHour = 8 + (i * 3);
        return `${startHour}:00 - ${a.name} (${a.duration})`;
    });

    return plan.join(' → ');
}

function getDefaultActivities(): ActivityInfo[] {
    return [
        {
            name: "Fort Aguada",
            category: 'heritage',
            location: "Candolim, North Goa",
            entry_fee: "FREE",
            duration: "45 min",
            best_time: "5-6 PM (sunset)",
            difficulty: 'easy',
            rating: 4.3,
            description: "17th-century Portuguese fort with lighthouse and sea views",
            tips: ['Best sunset views in North Goa'],
            warnings: []
        }
    ];
}

export default recommendActivities;
