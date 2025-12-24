/**
 * AI Client Utility
 * Supports both Anthropic Claude and Groq APIs
 */

import Groq from "groq-sdk";

// Initialize Groq client
const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

/**
 * Call AI model (Groq)
 */
export async function callAI(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number = 1024
): Promise<string> {
    try {
        const completion = await groqClient.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Groq's fastest model
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error("No response from Groq API");
        }

        return response;
    } catch (error) {
        console.error("Error calling Groq API:", error);
        throw error;
    }
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
