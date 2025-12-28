/**
 * GoanFlow Type Definitions
 * Shared interfaces for all agents
 */

// Tourist Profiler Types
export interface TouristPersona {
    tourist_id: string;
    persona: string;
    confidence: number;
    interests: string[];
    budget_per_day: number;
    group_size: number;
    risk_tolerance: 'low' | 'moderate' | 'high';
    dietary_restrictions: string[];
    accessibility_needs: string[];
    generated_at: string;
}

export interface AppInteractions {
    clicks: Record<string, number>;
    searches: string[];
    time_spent: Record<string, number>;
    filters_used: Record<string, any>;
}

// Guide Matcher Types
export interface GuideMatch {
    rank: number;
    guide_id: string;
    name: string;
    score: number;
    match_reason: string;
    languages: string[];
    specialties: string[];
    rate: string;
    rating: string;
    availability: string[];
    reviews_highlight: string[];
}

export interface Guide {
    id: string;
    name: string;
    age: number;
    experience_years: number;
    languages: string[];
    specialties: string[];
    hourly_rate: number;
    rating: number;
    total_reviews: number;
    availability: string[];
    certifications: string[];
}

// Crowd Manager Types
export interface CrowdPrediction {
    venue: VenueStatus;
    alternatives: AlternativeVenue[];
    prediction_confidence: number;
}

export interface VenueStatus {
    name: string;
    current_crowd: number;
    predicted_peak_in_30_min: number;
    status: 'LOW' | 'MODERATE' | 'CROWDED' | 'VERY_CROWDED';
}

export interface AlternativeVenue {
    name: string;
    current_crowd: number;
    drive_time: string;
    rating: string;
    why: string;
}

// Price Intelligence Types
export interface PriceAnalysis {
    item: string;
    vendor: string;
    cost_breakdown: CostBreakdown;
    total_cost: number;
    fair_markup_percentage: number;
    fair_price_range: string;
    market_overcharge_detection: OverchargeDetection;
    goanflow_price: number;
    recommendation: string;
}

export interface CostBreakdown {
    ingredients: number;
    labor: number;
    location_premium: number;
    utilities: number;
}

export interface OverchargeDetection {
    typical_charged: string;
    overcharge_percentage: string;
}

// Safety Guardian Types
export interface SafetyAlert {
    type: 'WEATHER' | 'CRIME' | 'HEALTH' | 'WOMEN_SAFETY' | 'TRAFFIC' | 'EVENT';
    severity: 'HIGH' | 'MEDIUM' | 'INFO';
    message: string;
    action: string;
    location?: string;
}

export interface EmergencyContacts {
    police: string;
    ambulance: string;
    tourist_helpline: string;
    nearby_hospital?: string;
    guide_contact?: string;
}

export interface SafetyResponse {
    alerts: SafetyAlert[];
    emergency_contacts: EmergencyContacts;
    women_safety_tips?: string[];
    risk_level: number;
}

// Experience Curator Types
export interface Itinerary {
    date: string;
    tourist_id: string;
    matched_guide: GuideMatch;
    activities: Activity[];
    daily_summary: DailySummary;
}

export interface Activity {
    time: string;
    duration: string;
    location: string;
    activity_name: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'activity' | 'rest' | 'travel';
    cost: number;
    fair_price_verified: boolean;
    safety_rating: number;
    crowd_status: string;
    why_recommended: string;
    alternatives?: string[];
    booking_link?: string;
}

export interface DailySummary {
    total_spent: number;
    remaining_budget: number;
    guide_time_hours: number;
    guide_income: number;
    fair_prices_verified_percentage: number;
    safety_score: number;
    satisfaction_prediction: number;
}

// Accommodation Types
export interface Accommodation {
    name: string;
    location: string;
    gps?: {
        latitude: number;
        longitude: number;
    };
    category: 'Hostel' | 'Budget' | 'Mid-Range' | 'Luxury';
    price_range: string;
    amenities: string[];
    vibe: string;
    rating: number;
    best_for: string[];
    noise_level?: string;
    contact?: string;
    booking_links?: string[];
}

export interface AccommodationRecommendation {
    recommendation: Accommodation;
    why_recommended: string;
    safety_score: number;
    fair_price_verified: boolean;
}

// Orchestrator Types
export interface UserInput {
    userId: string;
    date: string;
    start_time: string;
    budget: number;
    appInteractions: AppInteractions;
    location?: {
        latitude: number;
        longitude: number;
    };
    preferences?: {
        pace: 'relaxed' | 'moderate' | 'packed';
        group_type: 'solo' | 'couple' | 'family' | 'friends';
    };
}

export interface OrchestratorResponse {
    persona?: TouristPersona;
    itinerary?: Itinerary;
    accommodation?: AccommodationRecommendation[];
    safety_alerts?: SafetyAlert[];
    missing_info?: string[];
    status: 'success' | 'error' | 'needs_info';
    message?: string;
}

// Venue Types
export interface Venue {
    id: string;
    name: string;
    location: string;
    gps: {
        latitude: number;
        longitude: number;
    };
    type: string;
    cuisine?: string[];
    hours: string;
    capacity: number;
    pricing: VenuePricing;
    crowd_analytics: CrowdAnalytics;
    safety_ratings: SafetyRatings;
    reviews: VenueReviews;
}

export interface VenuePricing {
    food_items?: Record<string, string>;
    drinks?: Record<string, string>;
    fair_price_verified: boolean;
    exploitation_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface CrowdAnalytics {
    historical_data: Record<string, number[]>;
    ml_prediction_accuracy: number;
    best_times: string[];
    avoid_times: string[];
}

export interface SafetyRatings {
    overall: number;
    women_safety_day: number;
    women_safety_night: number;
    solo_traveler_safe: boolean;
    accessibility: string;
    crime_incidents_6months: number;
}

export interface VenueReviews {
    total_reviews: number;
    average_rating: number;
    top_positive: string[];
    common_complaints: string[];
}
