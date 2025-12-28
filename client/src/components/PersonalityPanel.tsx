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
}

export const PersonalityPanel: React.FC<PersonalityPanelProps> = ({ persona, stats, isOpen, onClose }) => {
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
                {persona ? (
                    <div className="persona-info">
                        <div className="persona-badge">{persona.persona}</div>
                        <p className="description">
                            {persona.persona === 'ADVENTUROUS' && 'Seeks authenticity, takes risks. Loves hidden gems and local hangouts.'}
                            {persona.persona === 'SAFETY_CONSCIOUS' && 'Prioritizes safety and verified local guides for solo exploration.'}
                            {persona.persona === 'CULTURAL_LEARNER' && 'Respects traditions. Interested in historical context and heritage.'}
                            {persona.persona === 'LUXURY_SEEKER' && 'Comfort-focused while seeking high-quality authentic experiences.'}
                            {persona.persona === 'BUDGET_AWARE' && 'Price-sensitive. Always looking for fair local prices and value.'}
                        </p>
                        <div className="confidence-meter">
                            <div className="meter-label">
                                <span>Confidence</span>
                                <span>{(persona.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <div className="meter-bar">
                                <div
                                    className="meter-fill"
                                    style={{ width: `${persona.confidence * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="placeholder">Start chatting to discover your persona...</p>
                )}
            </section>

            <section className="panel-section stats">
                <h4 className="section-title">
                    <span className="icon">📊</span> Live Statistics
                </h4>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="label">💬 Messages</span>
                        <span className="value">{stats.messages}</span>
                    </div>
                    <div className="stat-item">
                        <span className="label">🏠 Spots</span>
                        <span className="value">{stats.spots}</span>
                    </div>
                    <div className="stat-item wide">
                        <span className="label">📍 Neighborhoods</span>
                        <div className="tag-cloud">
                            {stats.neighborhoods.map(n => <span key={n} className="tag">{n}</span>)}
                            {stats.neighborhoods.length === 0 && <span className="placeholder">None yet</span>}
                        </div>
                    </div>
                    <div className="stat-item wide">
                        <span className="label">💰 Budget Range</span>
                        <span className="value">₹{stats.budget[0]} - ₹{stats.budget[1]}</span>
                    </div>
                </div>
            </section>
        </aside>
    );
};
