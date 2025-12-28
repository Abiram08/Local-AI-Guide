/**
 * useVoiceRecorder Hook
 * Provides voice recording with real-time audio visualization and speech recognition
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoiceRecorderState {
    isRecording: boolean;
    isListening: boolean;
    transcript: string;
    interimTranscript: string;
    volume: number;
    duration: number;
    error: string | null;
}

export interface UseVoiceRecorderReturn extends VoiceRecorderState {
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    toggleRecording: () => Promise<void>;
    resetTranscript: () => void;
}

// Check for SpeechRecognition support
const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

export function useVoiceRecorder(): UseVoiceRecorderReturn {
    const [state, setState] = useState<VoiceRecorderState>({
        isRecording: false,
        isListening: false,
        transcript: '',
        interimTranscript: '',
        volume: 0,
        duration: 0,
        error: null
    });

    // Refs for audio context and speech recognition
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recognitionRef = useRef<any>(null);
    const animationFrameRef = useRef<number | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN'; // English India

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setState(prev => ({
                    ...prev,
                    transcript: prev.transcript + finalTranscript,
                    interimTranscript
                }));
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setState(prev => ({ ...prev, error: event.error }));
            };

            recognition.onend = () => {
                setState(prev => ({ ...prev, isListening: false }));
            };

            recognitionRef.current = recognition;
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) { }
            }
        };
    }, []);

    // Calculate volume from analyser
    const updateVolume = useCallback(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate RMS (Root Mean Square) for volume level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = (dataArray[i] - 128) / 128; // Normalize to -1..1
            sum += v * v;
        }
        const rms = Math.sqrt(sum / bufferLength);

        // Amplify and clamp for better visual response
        const amplifiedVolume = Math.min(rms * 3, 1);

        setState(prev => ({ ...prev, volume: amplifiedVolume }));

        if (state.isRecording) {
            animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
    }, [state.isRecording]);

    // Start recording
    const startRecording = useCallback(async () => {
        try {
            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // Set up audio context and analyser
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            // Start speech recognition
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setState(prev => ({ ...prev, isListening: true }));
                } catch (e) {
                    console.warn('Speech recognition already started');
                }
            }

            // Start duration timer
            const startTime = Date.now();
            durationIntervalRef.current = setInterval(() => {
                setState(prev => ({
                    ...prev,
                    duration: Math.floor((Date.now() - startTime) / 1000)
                }));
            }, 1000);

            setState(prev => ({
                ...prev,
                isRecording: true,
                error: null,
                duration: 0
            }));

            // Start volume animation loop
            animationFrameRef.current = requestAnimationFrame(updateVolume);

        } catch (err: any) {
            console.error('Failed to start recording:', err);
            setState(prev => ({
                ...prev,
                error: err.message || 'Microphone access denied'
            }));
        }
    }, [updateVolume]);

    // Stop recording
    const stopRecording = useCallback(() => {
        // Stop speech recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
        }

        // Stop media stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        // Close audio context
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // Cancel animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Clear duration interval
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        setState(prev => ({
            ...prev,
            isRecording: false,
            isListening: false,
            volume: 0,
            interimTranscript: ''
        }));
    }, []);

    // Toggle recording
    const toggleRecording = useCallback(async () => {
        if (state.isRecording) {
            stopRecording();
        } else {
            await startRecording();
        }
    }, [state.isRecording, startRecording, stopRecording]);

    // Reset transcript
    const resetTranscript = useCallback(() => {
        setState(prev => ({
            ...prev,
            transcript: '',
            interimTranscript: ''
        }));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopRecording();
        };
    }, [stopRecording]);

    return {
        ...state,
        startRecording,
        stopRecording,
        toggleRecording,
        resetTranscript
    };
}

export default useVoiceRecorder;
