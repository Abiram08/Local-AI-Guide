/**
 * Agent 4: Price Intelligence (The Shield)
 * 
 * Better Version: Uses Domain 5 of product.md for fair pricing and scams
 */

import { PriceAnalysis, CostBreakdown, OverchargeDetection } from "../types";
import { getDomain } from "../utils/kb";

/**
 * Analyze price fairness
 */
export async function analyzePrices(
    itemName: string,
    vendor: string,
    quantity: number = 1
): Promise<PriceAnalysis> {
    const domainPricing = getDomain('pricing');

    // Parse the fair pricing table from Domain 5
    // Format: | Category | Item | Cost Breakdown | Fair Price | Tourist Trap Price |
    const lines = domainPricing.split('\n');
    const itemRow = lines.find(l => l.toLowerCase().includes(itemName.toLowerCase()) && l.includes('|'));

    if (!itemRow) {
        // Fallback to heuristic if item not in DB
        return createFallbackAnalysis(itemName, vendor, quantity);
    }

    const columns = itemRow.split('|').map(c => c.trim()).filter(c => c.length > 0);
    const fairPriceStr = columns[1] || ""; // Fair Price
    const trapPriceStr = columns[2] || ""; // Tourist Trap Price
    const breakdownStr = columns[3] || ""; // Cost Breakdown

    // Parse costs from breakdown string like "Ingredients ₹80 + Labor ₹30 + Overhead ₹20"
    const ingredients = parseInt(breakdownStr.match(/Ingredients ₹(\d+)/)?.[1] || "150");
    const labor = parseInt(breakdownStr.match(/Labor ₹(\d+)/)?.[1] || "50");
    const utilities = parseInt(breakdownStr.match(/Overhead ₹(\d+)/)?.[1] || "30");

    const costBreakdown: CostBreakdown = {
        ingredients: ingredients * quantity,
        labor: labor * quantity,
        location_premium: 50 * quantity, // General location premium
        utilities: utilities * quantity,
    };

    const totalCost = costBreakdown.ingredients + costBreakdown.labor + costBreakdown.location_premium + costBreakdown.utilities;
    const fairPriceRange = fairPriceStr.replace("₹", "");

    return {
        item: itemName,
        vendor,
        cost_breakdown: costBreakdown,
        total_cost: totalCost,
        fair_markup_percentage: 30,
        fair_price_range: `₹${fairPriceRange}`,
        market_overcharge_detection: {
            typical_charged: trapPriceStr,
            overcharge_percentage: "50-150%",
        },
        goanflow_price: Math.round(totalCost * 1.15),
        recommendation: `Verified against Domain 5 Knowledge Base. Fair price is around ${fairPriceStr}.`,
    };
}

function createFallbackAnalysis(itemName: string, vendor: string, quantity: number): PriceAnalysis {
    return {
        item: itemName,
        vendor,
        cost_breakdown: { ingredients: 100, labor: 40, location_premium: 30, utilities: 20 },
        total_cost: 190,
        fair_markup_percentage: 30,
        fair_price_range: "₹250-300",
        market_overcharge_detection: { typical_charged: "₹400", overcharge_percentage: "Unknown" },
        goanflow_price: 220,
        recommendation: "Item not in primary database, using general Goan pricing heuristics.",
    };
}
