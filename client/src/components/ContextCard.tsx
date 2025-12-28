import React from 'react';
import { Activity } from '../types';

interface ContextCardProps {
    intent: 'FOOD' | 'SAFETY' | 'TIMING' | 'LOCATION' | 'CULTURE' | 'PRICE' | 'GENERAL';
    data: any;
    onAction?: (action: string) => void;
}

export const ContextCard: React.FC<ContextCardProps> = ({ intent, data, onAction }) => {
    const getCardStyles = () => {
        switch (intent) {
            case 'SAFETY': return 'border-accent-red';
            case 'FOOD': return 'border-primary-teal';
            case 'TIMING': return 'border-accent-orange';
            default: return 'border-primary-teal';
        }
    };

    const getIcon = () => {
        switch (intent) {
            case 'FOOD': return '🍽️';
            case 'SAFETY': return '⚠️';
            case 'TIMING': return '⏰';
            case 'LOCATION': return '📍';
            case 'CULTURE': return '🏛️';
            case 'PRICE': return '💰';
            default: return '💡';
        }
    };

    return (
        <div className={`context-card ${getCardStyles()}`}>
            <div className="card-header">
                <span className="card-icon">{getIcon()}</span>
                <h3 className="card-title">{data.title || data.activity_name || 'Insight'}</h3>
            </div>

            <div className="card-body">
                {intent === 'FOOD' && (
                    <div className="food-details">
                        <div className="price-rating">
                            <span>₹{data.cost || '200-400'}</span>
                            <span className="divider">|</span>
                            <span>⭐ {data.rating || '4.5'}</span>
                        </div>
                        <p className="description">{data.why_recommended}</p>
                    </div>
                )}

                {intent === 'SAFETY' && (
                    <div className="safety-details">
                        <div className="safety-status urgent">
                            {data.message || 'Not recommended solo at night'}
                        </div>
                        <div className="moves-grid">
                            <div className="move-col safe">
                                <strong>✓ SAFE</strong>
                                <ul>
                                    <li>Stay in main areas</li>
                                    <li>Use official taxi</li>
                                </ul>
                            </div>
                            <div className="move-col risk">
                                <strong>❌ RED FLAGS</strong>
                                <ul>
                                    <li>Remote beaches</li>
                                    <li>Inland after dark</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {intent === 'TIMING' && (
                    <div className="timing-details">
                        <div className="timeline">
                            <div className="time-block best">
                                <span className="status">🟢 BEST</span>
                                <span className="range">6-9 AM</span>
                                <span className="label">(Local prime)</span>
                            </div>
                            <div className="time-block okay">
                                <span className="status">🟡 OKAY</span>
                                <span className="range">9-12 PM</span>
                            </div>
                            <div className="time-block avoid">
                                <span className="status">🔴 AVOID</span>
                                <span className="range">2-6 PM</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Default/General fallback */}
                {intent === 'GENERAL' && (
                    <p className="description">{data.why_recommended || data.message}</p>
                )}
            </div>

            {data.localMove && (
                <div className="local-move-footer">
                    <strong>💡 Local move:</strong> {data.localMove}
                </div>
            )}

            <div className="card-actions">
                <button onClick={() => onAction?.('map')}>Show Map</button>
                <button className="secondary" onClick={() => onAction?.('save')}>Save</button>
            </div>
        </div>
    );
};
