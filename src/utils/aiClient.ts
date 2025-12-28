/**
 * AI Client Utility - Multi-Provider Support
 * Supports Groq API (primary), AWS Bedrock (fallback), and Demo Mode
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import Groq from "groq-sdk";

// Initialize Groq client (primary - as per .env.example)
const groqClient = process.env.GROQ_API_KEY ? new Groq({
    apiKey: process.env.GROQ_API_KEY,
}) : null;

// Initialize Bedrock client (fallback)
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.BEDROCK_REGION || "us-east-1",
});

/**
 * Generate demo response when no AI providers are available
 * Follows LocalVoice Goa personality: concise, specific, local flavor
 */
function generateDemoResponse(userPrompt: string): string {
    const prompt = userPrompt.toLowerCase();

    // BEACH - Generic query → Ask for vibe preference
    if (prompt.includes('beach') && !prompt.includes('palolem') && !prompt.includes('anjuna') &&
        !prompt.includes('baga') && !prompt.includes('calangute') && !prompt.includes('arambol') &&
        !prompt.includes('vagator') && !prompt.includes('agonda') && !prompt.includes('quiet') &&
        !prompt.includes('party') && !prompt.includes('family')) {
        return JSON.stringify({
            reply: `Yaar, Goa has like 50+ beaches! What's your vibe?\n\n**Quick picks:**\n• Quiet & peaceful → **Agonda** or **Palolem** (South)\n• Party scene → **Baga** or **Anjuna** (North)\n• Family-friendly → **Colva** (clean, calm waters)\n• Sunset vibes → **Vagator** (rocky cliffs, epic views)\n\nTell me what kind of experience you want and I'll give you the real local spots! 🏖️`,
            metadata: { intent: "BEACH", needsClarification: true }
        });
    }

    // BEACH - Palolem (specific, concise)
    if (prompt.includes('palolem')) {
        return JSON.stringify({
            reply: `**Palolem Beach** - South Goa's best kept secret, boss!\n\n📍 Canacona | 67 km from Margao\n⏰ Best before 9 AM or after 4 PM\n💰 Parking ₹50 | Sunbed ₹100-200\n\nCalm crescent bay, safe swimming. Perfect for couples or chill vibes.\n\n**Pro tip:** Skip the main shacks. Walk to the far south end → **Dropadi Shack** has killer fish curry for ₹280.\n\n**Watch out:** Gets crowded Jan-Feb. October is golden.\n\nWant me to show you on the map or suggest what to do there?`,
            metadata: { intent: "BEACH", beach: "Palolem", location: "South Goa" }
        });
    }

    // BEACH - Anjuna (specific, concise)
    if (prompt.includes('anjuna')) {
        return JSON.stringify({
            reply: `**Anjuna** - The OG hippie beach, bro!\n\n📍 Bardez | 21 km from Panaji\n⏰ Sunset is unmissable (5:30-7 PM)\n💰 No entry | Parking ₹40\n\nRocky beach, not for swimming. But THE vibe for trance, markets, and sunsets.\n\n**Must do:** Wednesday Flea Market (4 PM onwards). Curlies Shack for sunset beers ₹150.\n\n**Heads up:** Beach isn't clean. Come for the energy, not the sand.\n\nYou into nightlife here or just daytime exploring?`,
            metadata: { intent: "BEACH", beach: "Anjuna", location: "North Goa" }
        });
    }

    // BEACH - Arambol
    if (prompt.includes('arambol')) {
        return JSON.stringify({
            reply: `**Arambol** - Where travelers become locals!\n\n📍 Pernem | 55 km from Panaji\n⏰ Sunset drum circle 5:30 PM daily\n💰 Budget paradise - meals ₹150-250\n\nBohemian vibe, yoga retreats, drum circles every evening at the Banyan tree.\n\n**Local secret:** Walk 10 mins north along the cliff → Sweet Water Lake. Freshwater lake next to the sea. Mind = blown.\n\n**Avoid:** Main beach on weekends. Head to Keri Beach instead (10 min scooter north).\n\nStaying here or just visiting for the day?`,
            metadata: { intent: "BEACH", beach: "Arambol", location: "North Goa" }
        });
    }

    // FOOD - Generic → Ask for specifics
    if ((prompt.includes('food') || prompt.includes('eat') || prompt.includes('restaurant') || prompt.includes('hungry')) &&
        !prompt.includes('fish') && !prompt.includes('curry') && !prompt.includes('thali') && !prompt.includes('seafood')) {
        return JSON.stringify({
            reply: `Food in Goa is SERIOUS business, yaar! What are you craving?\n\n• **Fish curry rice** → The soul of Goa\n• **Seafood** → Fresh catch, beach shacks\n• **Pork vindaloo** → Spicy Portuguese legacy\n• **Vegetarian** → Surprisingly great options\n\nAlso helpful: What's your budget? ₹200 thali or ₹800 fine dining?\n\nAnd where are you located - North or South Goa? I'll send you somewhere within 15 mins. 🍽️`,
            metadata: { intent: "FOOD", needsClarification: true }
        });
    }

    // FOOD - Fish curry rice (specific)
    if (prompt.includes('fish curry') || prompt.includes('curry rice') || (prompt.includes('fish') && prompt.includes('curry'))) {
        return JSON.stringify({
            reply: `Fish curry rice? Now you're speaking Goan, boss!\n\n**My pick:** **Ritz Classic**, Panaji\n📍 18th June Road | ₹180-220 per thali | Cash only\n\nOpen since 1969. Order *xit kodi* with *bangda* (mackerel). Grandma's recipe, no frills.\n\n**Alternative:** **Vinayak** near Mapusa Market - ₹180 kingfish thali. Locals-only spot.\n\n**Pro tip:** Go between 12:30-2 PM. Fish runs out by 3.\n\n**Avoid:** Fancy beach restaurants. They charge ₹500 for the same thing.\n\nNorth or South Goa - I can suggest closer spots?`,
            metadata: { intent: "FOOD", dish: "Fish Curry Rice", priceRange: "₹180-250" }
        });
    }

    // SEAFOOD
    if (prompt.includes('seafood')) {
        return JSON.stringify({
            reply: `Fresh seafood? Let's get you the good stuff!\n\n**My pick:** **Zeebop by the Sea**, Utorda (South)\n📍 Beachfront | ₹600-900 for two | Cards accepted\n\nPick your fish, choose your style (recheado, grilled, curry). Views are chef's kiss.\n\n**Alternative:** **Brittos**, Baga (North) - touristy but fresh. Try the butter garlic prawns ₹550.\n\n**Pro tip:** Ask for "today's catch" not menu items. Whatever the fisherman brought = freshest.\n\n**Watch out:** Avoid Monday - fewer fresh catches after Sunday markets close.\n\nWhere are you staying? I'll find something closer.`,
            metadata: { intent: "FOOD", cuisine: "Seafood", priceRange: "₹600-900 for two" }
        });
    }

    // SAFETY - Scooter rentals
    if (prompt.includes('scooter') || prompt.includes('bike') || prompt.includes('rent')) {
        return JSON.stringify({
            reply: `Scooter rental - essential Goa move, but hear me out:\n\n💰 **Fair price:** ₹300-400/day (Activa) | ₹500-700 (Bullet)\n📋 **License:** Indian or International license REQUIRED. Cops check.\n⛑️ **Helmet:** Mandatory. ₹1000 fine if caught.\n\n**Recommended:** Rent from your hotel or a shop with Google reviews. Avoid random beach guys.\n\n**Pro tip:** Check brakes, fuel gauge, take photos of any scratches BEFORE riding off.\n\n**Caution:** Goa roads are wild. Don't drink and ride - cops breathalyze at night.\n\nNeed suggestions for trusted rental spots in your area?`,
            metadata: { intent: "SAFETY", topic: "Scooter Rental", fairPrice: "₹300-400/day" }
        });
    }

    // SAFETY - Taxi fares
    if (prompt.includes('taxi') || prompt.includes('cab') || prompt.includes('transport')) {
        return JSON.stringify({
            reply: `Taxi situation in Goa - lemme save you money:\n\n**Ground rules:**\n• No Uber/Ola. Local taxi union blocked them.\n• Always negotiate BEFORE getting in\n• Fair rate: ~₹20-25 per km\n\n**Typical fares:**\n• Airport → Panaji: ₹900-1100\n• Panaji → Baga: ₹600-700\n• Calangute → Anjuna: ₹300-400\n\n**Pro tip:** Use GoaMiles app (prepaid) or ask hotel to book. Don't accept first quote - counter at 70%.\n\n**Alternative:** Rent a scooter if you're comfortable. Way cheaper.\n\nWhere are you headed? I can give you exact fare.`,
            metadata: { intent: "SAFETY", topic: "Taxi Fares" }
        });
    }

    // SAFETY - General
    if (prompt.includes('safe') || prompt.includes('danger') || prompt.includes('scam')) {
        return JSON.stringify({
            reply: `Real talk - Goa is very safe overall, but here's what matters:\n\n✅ **Safe from:** Violent crime, political unrest\n\n⚠️ **Watch for:**\n• Taxi scams → Always fix price before\n• Beach theft → Never leave bags unattended\n• Sea currents → Red flags = no swimming\n• Drink spiking → Clubs, watch your glass\n\n**Emergency:**\n• Tourist helpline: 1800-233-7777 (free)\n• Police: 100\n\n**Golden rule:** Don't trust anyone who approaches YOU selling something on the beach.\n\nWhich area are you staying? I'll give specific tips.`,
            metadata: { intent: "SAFETY", safetyLevel: "Generally Safe" }
        });
    }

    // ACTIVITIES - What's happening
    if (prompt.includes('tonight') || prompt.includes('happening') || prompt.includes('party') || prompt.includes('nightlife')) {
        return JSON.stringify({
            reply: `Nightlife check! What's your scene?\n\n🎉 **Party crowd:**\n• **Tito's Lane**, Baga - Classic tourist party strip. Entry ₹1500-2000 (includes drinks)\n• **Club Cubana**, Arpora - Hillside club, great views. ₹1000 couples\n\n🎸 **Live music:**\n• **Cavala**, Baga - Live bands, older crowd, good vibes. No cover.\n• **Curlies**, Anjuna - Trance on weekends\n\n☕ **Chill evening:**\n• **Artjuna**, Anjuna - Acoustic sets, organic food\n\n**Pro tip:** Saturday nights are busiest. Thursdays are locals' party night.\n\nNorth or South Goa tonight?`,
            metadata: { intent: "ACTIVITIES", topic: "Nightlife" }
        });
    }

    // ACTIVITIES - Sunset
    if (prompt.includes('sunset')) {
        return JSON.stringify({
            reply: `Sunset hunting? I got you!\n\n**Best spots:**\n\n🥇 **Ozran Beach** (Little Vagator) - Rocky cliffs, minimal crowds. THE local favorite.\n📍 Vagator | Free | ⏰ Reach by 5 PM\n\n🥈 **Chapora Fort** - Dil Chahta Hai vibes. 10-min climb, panoramic views.\n📍 Above Vagator | Free | Gets crowded\n\n🥉 **Palolem South End** - Quieter, kayak rentals nearby.\n\n**Pro tip:** Arambol drum circle at sunset = magical. Every. Single. Day.\n\n**Bring:** Camera, water, mosquito repellent.\n\nWant me to add food recommendations near any of these?`,
            metadata: { intent: "ACTIVITIES", topic: "Sunset Spots" }
        });
    }

    // Default WELCOME - Concise, warm
    return JSON.stringify({
        reply: `Hey! I'm your local Goa guide - not the pamphlet type, the *friend who actually lives here* type. 🌴\n\nI can help with:\n• **Beaches** → Which one matches YOUR vibe\n• **Food** → Real local spots, not tourist traps\n• **Safety** → Scooters, taxis, fair prices\n• **Activities** → What's happening today\n\n**Quick tip:** Be specific! Try *"quiet beach for couples"* or *"best fish curry near Panaji"* and I'll nail it.\n\nSo what brings you to Goa, boss?`,
        metadata: { intent: "WELCOME" }
    });
}


/**
 * Call AI model - Uses Groq API (primary), AWS Bedrock (fallback), or Demo Mode
 */
export async function callAI(
    systemPrompt: string,
    userPrompt: string,
    conversationHistory: Array<{ role: string, content: string }> = [],
    maxTokens: number = 1024
): Promise<string> {
    // Build messages array with history for context
    const messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [
        { role: "system", content: systemPrompt },
    ];

    // Add last 6 messages from history for context (to stay within limits)
    const recentHistory = conversationHistory.slice(-6);
    for (const msg of recentHistory) {
        messages.push({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
        });
    }

    // Add current message
    messages.push({ role: "user", content: userPrompt });

    // Try Groq API first (primary provider)
    if (groqClient) {
        try {
            const completion = await groqClient.chat.completions.create({
                messages,
                model: "llama-3.3-70b-versatile",
                max_tokens: maxTokens,
                temperature: 0.7,
            });

            const text = completion.choices[0]?.message?.content;
            if (!text) {
                throw new Error("No response content from Groq");
            }
            console.log("✅ AI response from Groq API");
            return text;
        } catch (error) {
            console.error("Groq API error, falling back to Bedrock:", error);
        }
    }

    // Fallback to AWS Bedrock
    try {
        const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";
        const payload = {
            anthropic_version: "bedrock-2023-06-01",
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
        };

        const command = new InvokeModelCommand({
            body: JSON.stringify(payload),
            contentType: "application/json",
            accept: "application/json",
            modelId,
        });

        const response = await bedrockClient.send(command);
        const result = JSON.parse(new TextDecoder().decode(response.body));

        const text = result.content[0]?.text;
        if (!text) {
            throw new Error("No response content from Bedrock");
        }
        console.log("✅ AI response from AWS Bedrock");
        return text;
    } catch (bedrockError) {
        console.error("Bedrock API error, falling back to Demo Mode:", bedrockError);
    }

    // Final fallback: Demo Mode
    console.log("🎭 Using Demo Mode - No AI API keys configured");
    return generateDemoResponse(userPrompt);
}

/**
 * Parse JSON response from AI
 */
export function parseAIResponse<T>(response: string): T {
    try {
        // Remove markdown code blocks if present
        let cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/```\n?/g, "");
        }

        return JSON.parse(cleaned) as T;
    } catch (error) {
        console.error("Error parsing AI response:", error);
        console.error("Raw response:", response);
        throw new Error("Failed to parse AI response as JSON");
    }
}
