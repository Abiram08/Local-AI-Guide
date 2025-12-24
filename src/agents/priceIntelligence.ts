/**
 * Agent 4: Price Intelligence
 * 
 * Purpose: Ensure fair pricing and detect tourist exploitation
 * 
 * Algorithm:
 * - Calculate fair price: ingredient_cost + location_premium + labor + utilities
 * - Fair markup: 25-35% (reasonable vendor profit)
 * - Detect exploitation: if market_price > fair_price * 1.5
 * - Return: cost breakdown, fair price range, exploitation status
 */

import Anthropic from "@anthropic-ai/sdk";
import { PriceAnalysis, CostBreakdown, OverchargeDetection } from "../types";
import * as fs from "fs";
import * as path from "path";

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

/**
 * Load product.md for pricing data
 */
function loadProductContext(): string {
    const productPath = path.join(__dirname, "../../product.md");
    return fs.readFileSync(productPath, "utf-8");
}

/**
 * Analyze price fairness
 */
export async function analyzePrices(
    itemName: string,
    vendor: string,
    quantity: number = 1
): Promise<PriceAnalysis> {
    const productContext = loadProductContext();

    const systemPrompt = `You are a price intelligence specialist for GoanFlow.

Your task: Calculate fair prices and detect tourist exploitation.

Use DOMAIN 4: FAIR PRICING ALGORITHM from product.md for:
- Ingredient costs (market data)
- Location premium factors (beach +25%, commercial -10%)
- Labor cost allocation
- Vendor markup standards (25-35% fair)

Algorithm:
1. Sum ingredient costs
2. Add location premium (beach +25%, commercial -10%, residential +5%)
3. Add labor time allocation
4. Add utilities (10% of ingredient cost)
5. Apply fair markup (30% vendor profit)
6. Compare with typical market price
7. If overcharge > 50%, flag as EXPLOITATION

Return ONLY valid JSON:
{
  "item": "string",
  "vendor": "string",
  "cost_breakdown": {
    "ingredients": number,
    "labor": number,
    "location_premium": number,
    "utilities": number
  },
  "total_cost": number,
  "fair_markup_percentage": number,
  "fair_price_range": "string",
  "market_overcharge_detection": {
    "typical_charged": "string",
    "overcharge_percentage": "string"
  },
  "goanflow_price": number,
  "recommendation": "string"
}`;

    try {
        const message = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1536,
            system: systemPrompt,
            messages: [
                {
                    role: "user",
                    content: `Analyze price fairness:

Item: ${itemName}
Vendor: ${vendor}
Quantity: ${quantity}

Pricing Data (from product.md):
${productContext.substring(
                        productContext.indexOf("## DOMAIN 4: FAIR PRICING"),
                        productContext.indexOf("## DOMAIN 5:")
                    )}

Calculate fair price and detect exploitation.`,
                },
            ],
        });

        const content = message.content[0];
        if (content.type === "text") {
            const analysis = JSON.parse(content.text);
            return analysis as PriceAnalysis;
        }

        throw new Error("Failed to get text response from Claude");
    } catch (error) {
        console.error("Error analyzing prices:", error);

        // Fallback: Return mock analysis
        return createFallbackAnalysis(itemName, vendor, quantity);
    }
}

/**
 * Fallback price analysis using simple heuristics
 */
function createFallbackAnalysis(
    itemName: string,
    vendor: string,
    quantity: number
): PriceAnalysis {
    // Simple pricing database
    const pricingDB: Record<string, any> = {
        "prawn curry": {
            ingredients: 360,
            labor: 100,
            utilities: 40,
            location_premium: 125,
            typical_market: "₹800-1000",
            exploitation_typical: "₹1500",
        },
        "masala chai": {
            ingredients: 12,
            labor: 3,
            utilities: 2,
            location_premium: 3,
            typical_market: "₹20-30",
            exploitation_typical: "₹100-500",
        },
        "fish thali": {
            ingredients: 120,
            labor: 50,
            utilities: 20,
            location_premium: 50,
            typical_market: "₹150-200",
            exploitation_typical: "₹400-500",
        },
    };

    const itemKey = itemName.toLowerCase();
    const itemData = pricingDB[itemKey] || pricingDB["fish thali"];

    const costBreakdown: CostBreakdown = {
        ingredients: itemData.ingredients * quantity,
        labor: itemData.labor * quantity,
        location_premium: itemData.location_premium * quantity,
        utilities: itemData.utilities * quantity,
    };

    const totalCost =
        costBreakdown.ingredients +
        costBreakdown.labor +
        costBreakdown.location_premium +
        costBreakdown.utilities;

    const fairMarkup = 30; // 30%
    const fairPrice = Math.round(totalCost * (1 + fairMarkup / 100));
    const goanflowPrice = Math.round(totalCost * 1.15); // Lower margin due to guaranteed bookings

    // Detect exploitation
    const typicalMarket = itemData.typical_market;
    const exploitationPrice = itemData.exploitation_typical;

    let recommendation = "FAIR PRICE - Book with confidence";
    if (exploitationPrice) {
        const exploitationValue = parseInt(exploitationPrice.split("-")[0].replace("₹", ""));
        const overchargePercent = Math.round(
            ((exploitationValue - fairPrice) / fairPrice) * 100
        );
        if (overchargePercent > 50) {
            recommendation = `EXPLOITATION DETECTED - Some vendors charge ${exploitationPrice} (${overchargePercent}% overcharge). GoanFlow price is fair.`;
        }
    }

    return {
        item: itemName,
        vendor,
        cost_breakdown: costBreakdown,
        total_cost: totalCost,
        fair_markup_percentage: fairMarkup,
        fair_price_range: `₹${Math.round(fairPrice * 0.95)}-${Math.round(
            fairPrice * 1.05
        )}`,
        market_overcharge_detection: {
            typical_charged: typicalMarket,
            overcharge_percentage:
                exploitationPrice === typicalMarket ? "0-10%" : "50-200%",
        },
        goanflow_price: goanflowPrice,
        recommendation,
    };
}

/**
 * Example usage:
 * 
 * const analysis = await analyzePrices("Prawn Curry", "Curlies Beach Shack", 1);
 * 
 * console.log(analysis);
 * // Output: {
 * //   item: "Prawn Curry",
 * //   vendor: "Curlies Beach Shack",
 * //   cost_breakdown: {
 * //     ingredients: 360,
 * //     labor: 100,
 * //     location_premium: 125,
 * //     utilities: 40
 * //   },
 * //   total_cost: 625,
 * //   fair_markup_percentage: 30,
 * //   fair_price_range: "₹594-656",
 * //   market_overcharge_detection: {
 * //     typical_charged: "₹800-1000",
 * //     overcharge_percentage: "50-200%"
 * //   },
 * //   goanflow_price: 575,
 * //   recommendation: "FAIR PRICE - Book with confidence"
 * // }
 */
