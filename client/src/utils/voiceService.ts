/**
 * ElevenLabs Voice Synthesis Service
 * 
 * Provides professional Goan-accented text-to-speech for LocalVoice Goa.
 */

const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY;
const VOICE_ID = process.env.REACT_APP_ELEVENLABS_VOICE_ID;

interface VoiceSettings {
    stability: number;
    similarity_boost: number;
}

/**
 * Synthesize text into an audio URL using ElevenLabs
 */
export async function synthesizeWithElevenLabs(text: string, intent: string = 'GENERAL'): Promise<string> {
    if (!ELEVENLABS_API_KEY || !VOICE_ID) {
        console.warn('ElevenLabs API Key or Voice ID missing. Voice playback disabled.');
        throw new Error('ElevenLabs configuration missing');
    }

    // Adjust voice parameters based on intent (Domain 10)
    const voiceSettings: Record<string, VoiceSettings> = {
        FOOD: { stability: 0.6, similarity_boost: 0.75 },      // Enthusiastic
        SAFETY: { stability: 0.8, similarity_boost: 0.8 },     // Serious
        GENERAL: { stability: 0.7, similarity_boost: 0.75 }    // Balanced
    };

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_monolingual_v1',
                voice_settings: voiceSettings[intent] || voiceSettings.GENERAL
            })
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('Synthesis failed:', error);
        throw error;
    }
}

/**
 * Convenience function to play a voice response immediately
 */
export async function playVoiceResponse(text: string, intent: string = 'GENERAL'): Promise<void> {
    try {
        const audioUrl = await synthesizeWithElevenLabs(text, intent);
        const audio = new Audio(audioUrl);
        await audio.play();
    } catch (error) {
        console.error('Error playing voice response:', error);
    }
}
