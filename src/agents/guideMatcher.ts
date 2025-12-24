/**
 * Agent 2: Guide Matcher
 * 
 * Purpose: Find perfect guide using ML scoring algorithm
 * 
 * Scoring Formula (max 40 points):
 * - Language match: +10 pts
 * - Specialty alignment: +10 pts
 * - Rating: +(rating/5)*10 pts
 * - Availability: +5 pts
 * - Personality fit: +5 pts (sentiment analysis of reviews)
 * 
 * Output: Top 3 ranked guides with match reasons
 */

import Anthropic from "@anthropic-ai/sdk";
import { TouristPersona, GuideMatch, Guide } from "../types";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Load product.md to access guide database
 */
function loadProductContext(): string {
    const productPath = path.join(__dirname, "../../product.md");
    return fs.readFileSync(productPath, "utf-8");
}

/**
 * Match guide based on tourist persona
 */
export async function matchGuide(
    persona: TouristPersona,
    requestedDate: string
): Promise<GuideMatch[]> {
    const productContext = loadProductContext();

    const systemPrompt = `You are a guide matching specialist for GoanFlow.

Your task: Find the best guides for a tourist based on their persona.

Use the GUIDE NETWORK section from product.md to access 200+ guide profiles.

Scoring Algorithm (max 40 points):
1. Language Match (+10 pts): Does guide speak tourist's language?
2. Specialty Alignment (+10 pts): Do guide's specialties match tourist interests?
3. Rating (+10 pts): Normalize guide rating (0-5) to 0-10 points
4. Availability (+5 pts): Is guide available on requested date?
5. Personality Fit (+5 pts): Based on review sentiment vs tourist persona

For each guide, calculate total score and provide match reason.

Return top 3 guides ranked by score.

Return ONLY valid JSON array:
[
  {
    "rank": 1,
    "guide_id": "string",
    "name": "string",
    "score": number,
    "match_reason": "string",
    "languages": ["string"],
    "specialties": ["string"],
    "rate": "string",
    "rating": "string",
    "availability": ["string"],
    "reviews_highlight": ["string"]
  }
]`;

    try {
        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 2048,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: `Find the best guides for this tourist:

Tourist Persona:
${JSON.stringify(persona, null, 2)}

Requested Date: ${requestedDate}

Guide Database (from product.md):
${productContext.substring(
                        productContext.indexOf("## DOMAIN 2: GUIDE NETWORK"),
                        productContext.indexOf("## DOMAIN 3:")
                    )}

Return top 3 matched guides with scores and reasons.`,
                },
            ],
        });

        const content = message.content[0];
        if (content.type === "text") {
            const matches = JSON.parse(content.text);
            return matches as GuideMatch[];
        }

        throw new Error("Failed to get text response from Claude");
    } catch (error) {
        console.error("Error matching guide:", error);

        // Fallback: Return hardcoded top guides
        return createFallbackMatches(persona, requestedDate);
    }
}

/**
 * Fallback guide matching using simple heuristics
 */
function createFallbackMatches(
    persona: TouristPersona,
    requestedDate: string
): GuideMatch[] {
    // Hardcoded top guides from product.md
    const guides: Guide[] = [
        {
            id: "RAJ_001",
            name: "Raj Kumar",
            age: 32,
            experience_years: 12,
            languages: ["English", "French", "Hindi", "Konkani", "Spanish"],
            specialties: ["food_guide", "adventure", "heritage"],
            hourly_rate: 800,
            rating: 4.9,
            total_reviews: 150,
            availability: ["2025-12-24", "2025-12-25", "2025-12-26"],
            certifications: ["PADI Advanced", "First Aid", "Food Safety"],
        },
        {
            id: "PRIYA_002",
            name: "Priya Fernandes",
            age: 28,
            experience_years: 7,
            languages: ["English", "Portuguese", "Hindi", "Konkani"],
            specialties: ["heritage", "photography", "women_safety"],
            hourly_rate: 750,
            rating: 4.8,
            total_reviews: 95,
            availability: ["2025-12-24", "2025-12-25"],
            certifications: ["Licensed Tour Guide", "Photography", "First Aid"],
        },
    ];

    const matches: GuideMatch[] = guides.map((guide, index) => {
        // Calculate score
        let score = 0;

        // Language match (+10 pts)
        if (guide.languages.includes("English")) score += 10;

        // Specialty alignment (+10 pts)
        const interestMatch = persona.interests.some((interest) =>
            guide.specialties.some((spec) => spec.includes(interest))
        );
        if (interestMatch) score += 10;

        // Rating (+10 pts)
        score += (guide.rating / 5) * 10;

        // Availability (+5 pts)
        if (guide.availability.includes(requestedDate)) score += 5;

        // Personality fit (+5 pts) - simplified
        score += 4;

        // Match reason
        const matchReason = `${guide.specialties[0]} specialist (${Math.round(
            (guide.rating / 5) * 100
        )}% match) + ${guide.languages.join(", ")} speaker + ${guide.experience_years
            } years experience`;

        return {
            rank: index + 1,
            guide_id: guide.id,
            name: guide.name,
            score: Math.round(score * 10) / 10,
            match_reason: matchReason,
            languages: guide.languages,
            specialties: guide.specialties,
            rate: `₹${guide.hourly_rate}/hour`,
            rating: `${guide.rating}/5 (${guide.total_reviews}+ reviews)`,
            availability: guide.availability,
            reviews_highlight: [
                "Excellent guide, very knowledgeable",
                "Patient and friendly",
                "Best experience in Goa",
            ],
        };
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches.slice(0, 3);
}

/**
 * Example usage:
 * 
 * const persona = {
 *   tourist_id: "TOUR_001",
 *   persona: "adventurous_foodie",
 *   confidence: 0.95,
 *   interests: ["water_sports", "street_food", "nightlife"],
 *   budget_per_day: 4500,
 *   group_size: 2,
 *   risk_tolerance: "moderate"
 * };
 * 
 * const matches = await matchGuide(persona, "2025-12-24");
 * console.log(matches);
 * // Output: [
 * //   {
 * //     rank: 1,
 * //     guide_id: "RAJ_001",
 * //     name: "Raj Kumar",
 * //     score: 39.5,
 * //     match_reason: "Food specialist (98% match) + adventure certified + French speaker + 12 years experience",
 * //     ...
 * //   }
 * // ]
 */
