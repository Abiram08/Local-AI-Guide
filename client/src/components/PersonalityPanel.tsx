import React from 'react';
import { TouristPersona } from '../types';

interface PersonalityPanelProps {
    persona: TouristPersona | null;
    stats: {
        messages: number;
        spots: number;
        neighborhoods: string[];
        budget: [number, number];
    };
    isOpen: boolean;
    onClose?: () => void;
    onClearChat?: () => void;
}

const getPersonaInfo = (persona: any): { name: string; description: string; emoji: string } => {
    const personaType = persona?.type || persona?.persona || 'EXPLORER';

    const personaMap: Record<string, { name: string; description: string; emoji: string }> = {
        'ADVENTUROUS': { name: 'Adventurer', description: 'Seeks hidden gems and authentic local experiences', emoji: '🏄' },
        'SAFETY_CONSCIOUS': { name: 'Careful Explorer', description: 'Prioritizes safety while discovering new places', emoji: '🛡️' },
        'CULTURAL_LEARNER': { name: 'Culture Enthusiast', description: 'Loves history, heritage and local traditions', emoji: '🏛️' },
        'LUXURY_SEEKER': { name: 'Comfort Traveler', description: 'Enjoys premium experiences and comfort', emoji: '✨' },
        'BUDGET_AWARE': { name: 'Smart Traveler', description: 'Finds the best value and local prices', emoji: '💰' },
        'EXPLORER': { name: 'Explorer', description: 'Discovering Goa one conversation at a time', emoji: '🧭' },
    };

    return personaMap[personaType] || personaMap['EXPLORER'];
};

export const PersonalityPanel: React.FC<PersonalityPanelProps> = ({ persona, stats, isOpen, onClose, onClearChat }) => {
    const personaInfo = getPersonaInfo(persona);

    return (
        <aside className={`personality-panel ${isOpen ? 'open' : ''}`}>
            <div className="panel-header">
                <h3 className="panel-title">Your Journey</h3>
                <button className="panel-close" onClick={onClose} title="Close">×</button>
            </div>

            <section className="panel-section personality">
                <h4 className="section-title">
                    <span className="icon">👤</span> Travel Persona
                </h4>
                <div className="persona-info">
                    <div className="persona-badge">
                        <span className="persona-emoji">{personaInfo.emoji}</span>
                        <span className="persona-name">{personaInfo.name}</span>
                    </div>
                    <p className="description">{personaInfo.description}</p>
                </div>
            </section>

            <section className="panel-section stats">
                <h4 className="section-title">
                    <span className="icon">📊</span> Session Stats
                </h4>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="label">💬 Messages</span>
                        <span className="value">{stats.messages}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">🏠 Spots Discovered</span>
                        <span className="value">{stats.spots}</span>
                    </div>
                </div>
            </section>

            <section className="panel-section actions">
                <button className="clear-chat-btn" onClick={onClearChat}>
                    🗑️ Clear Chat History
                </button>
            </section>
        </aside>
    );
};

