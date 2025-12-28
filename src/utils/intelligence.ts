/**
 * Intelligence Utility - Intent and Personality Detection
 * 
 * Domain 10: Conversation Intelligence implementation.
 */

export function detectIntent(message: string): string {
    const msg = message.toLowerCase();
    if (/food|eat|hungry|restaurant|curry|thali|fish/.test(msg)) return 'FOOD';
    if (/safe|security|risk|danger|woman|alone|night/.test(msg)) return 'SAFETY';
    if (/when|time|peak|crowd|busy|morning|evening/.test(msg)) return 'TIMING';
    if (/culture|tradition|history|temple|festival/.test(msg)) return 'CULTURE';
    if (/cost|price|expensive|budget|fair|rupee/.test(msg)) return 'PRICE';
    if (/arambol|colva|baga|location|area/.test(msg)) return 'NEIGHBORHOOD';
    return 'GENERAL';
}

export function detectPersonality(history: any[]): { type: string, confidence: number } {
    const fullText = history.map(m => m.content).join(' ').toLowerCase();

    const types: Record<string, RegExp> = {
        ADVENTUROUS: /authentic|explore|local|adventure|risk|hidden/,
        SAFETY_CONSCIOUS: /safe|alone|woman|security|worry|concern/,
        BUDGET_AWARE: /budget|cheap|cost|price|fair|negotiate/,
        CULTURAL_LEARNER: /culture|tradition|learn|story|respect/,
        LUXURY_SEEKER: /luxury|comfort|premium|5.star/
    };

    for (const [type, pattern] of Object.entries(types)) {
        if (pattern.test(fullText)) return { type, confidence: 0.8 };
    }
    return { type: 'CURIOUS', confidence: 0.5 };
}

export function getPersonalityGuidance(personality: { type: string }): string {
    const guides: Record<string, string> = {
        ADVENTUROUS: 'Seeks authenticity, takes risks. Include: Hidden gems, local hangouts, insider tips. Tone: Casual, less warnings.',
        SAFETY_CONSCIOUS: 'Prioritizes safety. Include: Detailed safety analysis, backup plans. Tone: Direct, comprehensive.',
        BUDGET_AWARE: 'Price-sensitive. Include: Fair ranges, negotiation tips. Always show value.',
        CULTURAL_LEARNER: 'Respects traditions. Include: Historical context, cultural significance. Tone: Educational.',
        LUXURY_SEEKER: 'Comfort-focused. Include: Quality establishments that aren\'t tourist traps. Tone: Premium but authentic.'
    };
    return guides[personality.type] || 'Friendly but direct, respectful, honest about tourist traps';
}
export function injectCulturalContext(message: string): string {
    const msg = message.toLowerCase();
    if (msg.includes('food')) return 'Mention: Fish Recheado, Bebinca, Cafreal. Use "Xit Kodu" when talking about home food.';
    if (msg.includes('safe')) return 'Mention: Goan villagers are generally helpful but "Susegad" lifestyle means things close early. Remind about "Life Guards" vs "Local Guidance".';
    if (msg.includes('when')) return 'Context: Noon is hot, locals avoid the sun. Sunset "Sundowners" are a tradition. Monsoon (June-Aug) is green but risky for swimming.';
    return 'General Context: Friendly, laid-back, "Susegad" culture. Use words like "Re" (casual), "Baba/Mai" (respectful).';
}
