/**
 * Transport Agent (The Navigator's Guide)
 * 
 * Purpose: Provide transport recommendations, fare estimates, and safety tips
 * Data Source: knowledge/transport.md
 */

import { getDomain } from "../utils/kb";

export interface TransportOption {
    type: string;
    description: string;
    fare_estimate: string;
    booking_method: string;
    pros: string[];
    cons: string[];
    safety_rating: number;
    best_for: string[];
}

export interface TransportResponse {
    recommended_option: TransportOption;
    alternatives: TransportOption[];
    route_tips: string[];
    scam_warnings: string[];
    night_surcharge_info: string;
}

/**
 * Get transport recommendations for a route
 */
export async function recommendTransport(
    origin: string,
    destination: string,
    time: string,
    budget: 'budget' | 'comfort' | 'premium',
    groupSize: number
): Promise<TransportResponse> {
    const transportData = getDomain('transport');

    const options: TransportOption[] = [];

    // Parse GoaMiles section
    if (transportData.includes('GoaMiles')) {
        options.push({
            type: 'GoaMiles (Official App)',
            description: 'Government-backed taxi app with transparent pricing',
            fare_estimate: calculateFare(origin, destination, 'goamiles'),
            booking_method: 'GoaMiles App (Android/iOS)',
            pros: ['Transparent pricing', 'GPS tracked', 'Government regulated', 'Complaint system'],
            cons: ['Limited availability in remote areas', 'May have wait times'],
            safety_rating: 9,
            best_for: ['solo travelers', 'women', 'families', 'tourists']
        });
    }

    // Parse Auto-Rickshaw section
    if (transportData.includes('Auto-Rickshaw')) {
        options.push({
            type: 'Auto-Rickshaw',
            description: 'Iconic three-wheelers for short distances',
            fare_estimate: calculateFare(origin, destination, 'auto'),
            booking_method: 'Street hail or negotiate at stand',
            pros: ['Cheap for short distances', 'Easy to find', 'Fun experience'],
            cons: ['No AC', 'Must negotiate price', 'Not suitable for long trips'],
            safety_rating: 7,
            best_for: ['budget travelers', 'short trips', 'adventure seekers']
        });
    }

    // Parse Bike/Scooter Rental
    if (transportData.includes('Bike') || transportData.includes('Scooter')) {
        options.push({
            type: 'Scooter/Bike Rental',
            description: 'Self-drive two-wheelers for maximum flexibility',
            fare_estimate: '₹300-500/day (scooter), ₹500-800/day (bike)',
            booking_method: 'Local rental shops or Bounce app',
            pros: ['Maximum flexibility', 'Cheapest for full day', 'Easy parking'],
            cons: ['Need valid license', 'Helmet mandatory', 'Traffic can be chaotic'],
            safety_rating: 6,
            best_for: ['experienced riders', 'couples', 'solo adventurers']
        });
    }

    // Parse Private Taxi section
    if (transportData.includes('Private Taxi')) {
        options.push({
            type: 'Private Taxi',
            description: 'Pre-negotiated rate for comfortable travel',
            fare_estimate: calculateFare(origin, destination, 'private'),
            booking_method: 'Hotel concierge or direct booking',
            pros: ['AC comfort', 'Door-to-door', 'Can negotiate for full day'],
            cons: ['Higher cost', 'Must negotiate upfront'],
            safety_rating: 8,
            best_for: ['families', 'groups', 'comfort seekers']
        });
    }

    // Sort by budget preference
    let recommended: TransportOption;
    if (budget === 'budget') {
        recommended = options.find(o => o.type.includes('Auto')) || options[0];
    } else if (budget === 'premium') {
        recommended = options.find(o => o.type.includes('Private')) || options[0];
    } else {
        recommended = options.find(o => o.type.includes('GoaMiles')) || options[0];
    }

    // Parse night surcharge info
    let nightSurcharge = 'Night surcharge (10 PM - 6 AM): +25-50% on base fare';
    const nightSection = transportData.split('Night')[1]?.split('\n').slice(0, 5).join(' ');
    if (nightSection?.includes('%')) {
        nightSurcharge = nightSection.match(/\d+%[^.]+/)?.[0] || nightSurcharge;
    }

    // Parse scam warnings
    const scamWarnings: string[] = [];
    if (transportData.toLowerCase().includes('scam') || transportData.toLowerCase().includes('overcharge')) {
        scamWarnings.push('Always agree on fare BEFORE getting in');
        scamWarnings.push('Use GoaMiles or pre-paid taxi counters at airport');
        scamWarnings.push('Avoid taxis that refuse to use meter');
    }

    return {
        recommended_option: recommended || options[0],
        alternatives: options.filter(o => o !== recommended).slice(0, 2),
        route_tips: [
            `Best route from ${origin} to ${destination}: Main highway preferred`,
            'Avoid beach roads during sunset (heavy traffic)',
            'Keep Google Maps handy - some drivers may take longer routes'
        ],
        scam_warnings: scamWarnings.length > 0 ? scamWarnings : ['Always confirm fare before travel'],
        night_surcharge_info: nightSurcharge
    };
}

function calculateFare(origin: string, destination: string, type: string): string {
    // Simple distance-based estimation
    const baseRates: Record<string, number> = {
        'goamiles': 15, // per km
        'auto': 12,
        'private': 18
    };

    // Estimated distances (simplified)
    const distances: Record<string, number> = {
        'airport': 30,
        'baga': 15,
        'calangute': 12,
        'panjim': 8,
        'anjuna': 18,
        'palolem': 45
    };

    const dist = distances[destination.toLowerCase()] || 20;
    const rate = baseRates[type] || 15;
    const fare = dist * rate;

    return `₹${fare - 50}-${fare + 100} (estimated)`;
}

export default recommendTransport;
