/**
 * VoiceVisualizer Component
 * Siri-like animated ball visualization with live transcript
 */

import React, { useRef, useEffect, useCallback } from 'react';
import './VoiceVisualizer.css';

interface VoiceVisualizerProps {
    isRecording: boolean;
    isSpeaking: boolean;
    volume: number;
    transcript: string;
    interimTranscript: string;
    duration: number;
    onClose: () => void;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
    isRecording,
    isSpeaking,
    volume,
    transcript,
    interimTranscript,
    duration,
    onClose
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);

    // Format duration as mm:ss
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Draw Siri-like animated ball
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Base radius and volume effect
        const baseRadius = 60;
        const maxExtra = 40;
        const currentVolume = isRecording ? volume : (isSpeaking ? 0.3 + Math.sin(Date.now() / 200) * 0.2 : 0);
        const radius = baseRadius + currentVolume * maxExtra;

        // Time-based animation parameters
        const time = Date.now() / 1000;

        // Draw multiple glowing layers
        const layers = 5;
        for (let i = layers; i >= 0; i--) {
            const layerRadius = radius * (1 + i * 0.15);
            const alpha = 0.15 - (i * 0.025);

            // Create gradient for each layer
            const gradient = ctx.createRadialGradient(
                centerX,
                centerY,
                layerRadius * 0.1,
                centerX,
                centerY,
                layerRadius
            );

            // Pulsing color based on recording state
            const hue = isRecording ? 170 : (isSpeaking ? 200 : 170);
            const saturation = 80 + currentVolume * 20;
            const lightness = 40 + currentVolume * 15;

            gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha + 0.3})`);
            gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, ${alpha + 0.1})`);
            gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 20}%, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw wavy ring effect
        const waveCount = 3;
        for (let w = 0; w < waveCount; w++) {
            const wavePhase = time * 2 + w * (Math.PI * 2 / waveCount);
            const waveRadius = radius * (1.3 + Math.sin(wavePhase) * 0.1);
            const waveAlpha = 0.3 - w * 0.08;

            ctx.strokeStyle = `hsla(170, 80%, 50%, ${waveAlpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const wobble = Math.sin(angle * 4 + time * 3 + w) * (currentVolume * 8);
                const x = centerX + Math.cos(angle) * (waveRadius + wobble);
                const y = centerY + Math.sin(angle) * (waveRadius + wobble);

                if (angle === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw inner core
        const coreGradient = ctx.createRadialGradient(
            centerX - radius * 0.2,
            centerY - radius * 0.2,
            0,
            centerX,
            centerY,
            radius * 0.5
        );
        coreGradient.addColorStop(0, 'rgba(100, 255, 255, 0.9)');
        coreGradient.addColorStop(0.5, 'rgba(32, 180, 180, 0.8)');
        coreGradient.addColorStop(1, 'rgba(32, 128, 128, 0.6)');

        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw volume level bars around the circle (for recording)
        if (isRecording) {
            const barCount = 32;
            const barWidth = 3;
            const maxBarHeight = 25;

            for (let i = 0; i < barCount; i++) {
                const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
                const barHeight = maxBarHeight * (0.3 + currentVolume * 0.7 * Math.abs(Math.sin(angle * 3 + time * 5)));

                const innerRadius = radius + 15;
                const x1 = centerX + Math.cos(angle) * innerRadius;
                const y1 = centerY + Math.sin(angle) * innerRadius;
                const x2 = centerX + Math.cos(angle) * (innerRadius + barHeight);
                const y2 = centerY + Math.sin(angle) * (innerRadius + barHeight);

                ctx.strokeStyle = `hsla(170, 80%, 60%, ${0.5 + currentVolume * 0.5})`;
                ctx.lineWidth = barWidth;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }

        // Continue animation
        animationRef.current = requestAnimationFrame(draw);
    }, [isRecording, isSpeaking, volume]);

    // Start/stop animation based on visibility
    useEffect(() => {
        if (isRecording || isSpeaking) {
            animationRef.current = requestAnimationFrame(draw);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isRecording, isSpeaking, draw]);

    // Don't render if not active
    if (!isRecording && !isSpeaking) return null;

    return (
        <div className="voice-overlay" onClick={onClose}>
            <div className="visualizer-container" onClick={e => e.stopPropagation()}>
                {/* Siri-like Canvas Animation */}
                <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="voice-canvas"
                />

                {/* Status Text */}
                <div className="voice-status">
                    {isRecording ? (
                        <>
                            <div className="recording-badge">
                                <span className="rec-dot"></span>
                                LISTENING
                            </div>
                            <div className="duration">{formatDuration(duration)}</div>
                        </>
                    ) : isSpeaking ? (
                        <div className="speaking-text">LocalVoice is speaking...</div>
                    ) : null}
                </div>

                {/* Live Transcript */}
                {isRecording && (
                    <div className="transcript-container">
                        {transcript && (
                            <p className="final-transcript">{transcript}</p>
                        )}
                        {interimTranscript && (
                            <p className="interim-transcript">{interimTranscript}</p>
                        )}
                        {!transcript && !interimTranscript && (
                            <p className="placeholder-text">Start speaking...</p>
                        )}
                    </div>
                )}

                {/* Close/Stop Button */}
                <button className="stop-btn" onClick={onClose}>
                    {isRecording ? (
                        <>
                            <span className="stop-icon">■</span>
                            Tap to Stop
                        </>
                    ) : (
                        'Close'
                    )}
                </button>

                {/* Hint Text */}
                <p className="hint-text">
                    {isRecording
                        ? "Speak naturally. I'm listening..."
                        : ""}
                </p>
            </div>
        </div>
    );
};

export default VoiceVisualizer;
