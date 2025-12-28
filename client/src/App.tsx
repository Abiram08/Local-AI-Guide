import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { TouristPersona } from './types';
import { playVoiceResponse } from './utils/voiceService';
import { PersonalityPanel } from './components/PersonalityPanel';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { useVoiceRecorder } from './hooks/useVoiceRecorder';
import { MessageBubble } from './components/MessageBubble';
import { TopicChips } from './components/TopicChips';
import { MapExplore } from './components/MapExplore';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    intent?: 'FOOD' | 'SAFETY' | 'TIMING' | 'LOCATION' | 'CULTURE' | 'PRICE' | 'GENERAL';
    data?: any;
    timestamp: Date;
    showChips?: boolean;
}

// Helper function to get default welcome message
function getDefaultMessages(): ChatMessage[] {
    return [{
        id: '1',
        role: 'assistant',
        content: "## 👋 Welcome to GoanFlow!\n\nI'm your personal local guide. Not the tourist pamphlet kind — the *friend who knows the hidden lanes* kind.\n\n### What brings you to Goa today?",
        timestamp: new Date(),
        showChips: true
    }];
}

function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() =>
        (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    );
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('explore');

    // State for saved messages
    const [savedMessages, setSavedMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('savedMessages');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
            } catch {
                return [];
            }
        }
        return [];
    });

    // Load messages from localStorage or use default welcome message
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
            } catch {
                return getDefaultMessages();
            }
        }
        return getDefaultMessages();
    });

    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [persona, setPersona] = useState<TouristPersona | null>(null);
    const [stats, setStats] = useState({
        messages: 1,
        spots: 0,
        neighborhoods: [] as string[],
        budget: [0, 0] as [number, number]
    });

    // Voice states
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Voice recorder hook
    const voiceRecorder = useVoiceRecorder();

    // Save theme to localStorage and apply to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 1) { // Don't save just the welcome message
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    // Save savedMessages to localStorage
    useEffect(() => {
        localStorage.setItem('savedMessages', JSON.stringify(savedMessages));
    }, [savedMessages]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    // Send message to API
    const sendMessage = useCallback(async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const newUserMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    userId: 'PRO_USER_001',
                    conversationHistory: messages.map(m => ({ role: m.role, content: m.content }))
                }),
            });

            const data = await response.json();

            const assistMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply,
                intent: data.meta?.intent,
                data: data.meta?.data,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistMsg]);
            setPersona(data.detectedPersona);
            setStats(prev => ({
                ...prev,
                messages: prev.messages + 2,
                neighborhoods: Array.from(new Set([...prev.neighborhoods, data.meta?.intent === 'NEIGHBORHOOD' ? data.reply.split(' ')[0] : ''].filter(Boolean)))
            }));

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Oops! Something went wrong. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    // Handle form submission
    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        await sendMessage(userInput);
    };

    // Handle topic chip selection
    const handleTopicSelect = async (topic: string, example?: string) => {
        if (example) {
            await sendMessage(example);
        } else {
            const topicQuestions: Record<string, string> = {
                beaches: 'Which beach should I visit?',
                food: 'Where can I get the best local food?',
                activities: 'What activities are happening today?',
                safety: 'Is it safe to travel around Goa?'
            };
            await sendMessage(topicQuestions[topic] || 'Tell me about Goa');
        }
    };

    // Handle voice button click
    const handleVoiceClick = async () => {
        if (voiceRecorder.isRecording) {
            voiceRecorder.stopRecording();
            const finalTranscript = voiceRecorder.transcript.trim();
            if (finalTranscript) {
                await sendMessage(finalTranscript);
                voiceRecorder.resetTranscript();
            }
        } else {
            voiceRecorder.resetTranscript();
            await voiceRecorder.startRecording();
        }
    };

    // Handle voice visualizer close
    const handleVoiceClose = async () => {
        if (voiceRecorder.isRecording) {
            voiceRecorder.stopRecording();
            const finalTranscript = voiceRecorder.transcript.trim();
            if (finalTranscript) {
                await sendMessage(finalTranscript);
                voiceRecorder.resetTranscript();
            }
        }
        setIsSpeaking(false);
    };

    // Handle message actions
    const handleVoice = (msgId: string) => {
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            setIsSpeaking(true);
            playVoiceResponse(msg.content, msg.intent || 'GENERAL');
            setTimeout(() => setIsSpeaking(false), 3000);
        }
    };

    const handleSave = (msgId: string) => {
        const msgToSave = messages.find(m => m.id === msgId);
        if (msgToSave) {
            setSavedMessages(prev => {
                const alreadySaved = prev.some(m => m.id === msgId);
                if (alreadySaved) {
                    return prev.filter(m => m.id !== msgId);
                }
                return [...prev, msgToSave];
            });
        }
    };

    const handleRemoveSaved = (msgId: string) => {
        setSavedMessages(prev => prev.filter(m => m.id !== msgId));
    };

    return (
        <div className="app-shell">
            {/* Voice Visualizer Overlay */}
            <VoiceVisualizer
                isRecording={voiceRecorder.isRecording}
                isSpeaking={isSpeaking}
                volume={voiceRecorder.volume}
                transcript={voiceRecorder.transcript}
                interimTranscript={voiceRecorder.interimTranscript}
                duration={voiceRecorder.duration}
                onClose={handleVoiceClose}
            />

            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <h1 className="logo">🏝️ <span>Goan</span>Flow</h1>
                </div>

                <nav className="header-nav">
                    <button className={activeTab === 'explore' ? 'active' : ''} onClick={() => setActiveTab('explore')}>Explore</button>
                    <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}>Saved</button>
                    <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>Map</button>
                </nav>

                <div className="header-right">
                    <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Dark mode' : 'Light mode'}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    <button className="menu-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)} title="Profile">
                        👤
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
                {activeTab === 'explore' && (
                    <div className="chat-container">
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <React.Fragment key={msg.id}>
                                    <MessageBubble
                                        role={msg.role}
                                        content={msg.content}
                                        timestamp={msg.timestamp}
                                        onVoice={msg.role === 'assistant' ? () => handleVoice(msg.id) : undefined}
                                        onSave={msg.role === 'assistant' ? () => handleSave(msg.id) : undefined}
                                        isSaved={savedMessages.some(m => m.id === msg.id)}
                                    />

                                    {/* Show topic chips on welcome message */}
                                    {msg.showChips && (
                                        <div className="chips-wrapper">
                                            <TopicChips onSelect={handleTopicSelect} />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}

                            {isLoading && (
                                <div className="loading-indicator">
                                    Thinking...
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    placeholder="Ask about beaches, food, or hidden gems..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    disabled={voiceRecorder.isRecording}
                                />
                                <button
                                    type="button"
                                    className={`voice-btn ${voiceRecorder.isRecording ? 'recording' : ''}`}
                                    onClick={handleVoiceClick}
                                    title={voiceRecorder.isRecording ? 'Stop' : 'Voice'}
                                >
                                    {voiceRecorder.isRecording ? '⏹️' : '🎙️'}
                                </button>
                                <button
                                    type="submit"
                                    className="send-btn"
                                    disabled={!userInput.trim() || voiceRecorder.isRecording}
                                >
                                    →
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="saved-container">
                        <div className="saved-header">
                            <h2>❤️ Saved Local Tips</h2>
                            <p>Hand-picked recommendations for your Goan journey.</p>
                        </div>
                        <div className="saved-list">
                            {savedMessages.length > 0 ? (
                                savedMessages.map(msg => (
                                    <div key={msg.id} className="saved-item">
                                        <MessageBubble
                                            role={msg.role}
                                            content={msg.content}
                                            timestamp={msg.timestamp}
                                            onRemove={() => handleRemoveSaved(msg.id)}
                                            isSaved={true}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="empty-saved">
                                    <p>You haven't saved any tips yet. Start exploring!</p>
                                    <button onClick={() => setActiveTab('explore')}>Start Chatting</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'map' && (
                    <div className="map-view-container">
                        <div className="map-header">
                            <h2>🗺️ Explore Goa</h2>
                            <p>Tap on markers to see details and hidden gems curated for you.</p>
                        </div>
                        <MapExplore />
                    </div>
                )}

                {/* Sidebar */}
                <PersonalityPanel
                    persona={persona}
                    stats={stats}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </main>
        </div>
    );
}

export default App;
