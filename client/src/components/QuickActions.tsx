import React from 'react';

interface QuickActionsProps {
    intent: 'FOOD' | 'SAFETY' | 'TIMING' | 'LOCATION' | 'CULTURE' | 'PRICE' | 'GENERAL';
    onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ intent, onAction }) => {
    const getActions = () => {
        switch (intent) {
            case 'FOOD':
                return [
                    { id: 'map', label: '🗺️ Show Map', primary: true },
                    { id: 'save', label: '❤️ Save This', primary: false },
                    { id: 'call', label: '📞 Call Now', primary: false },
                    { id: 'more', label: 'Tell me more', primary: false }
                ];
            case 'SAFETY':
                return [
                    { id: 'police', label: '🚨 Police', primary: true },
                    { id: 'taxi', label: '🚕 Call Taxi', primary: true },
                    { id: 'hospital', label: '🏥 Hospital', primary: false },
                    { id: 'more', label: 'Safety Tips', primary: false }
                ];
            case 'PRICE':
                return [
                    { id: 'compare', label: '💰 Compare', primary: true },
                    { id: 'history', label: '📈 History', primary: false },
                    { id: 'verify', label: '✅ Verify Price', primary: false }
                ];
            case 'TIMING':
                return [
                    { id: 'remind', label: '⏰ Set Reminder', primary: true },
                    { id: 'similar', label: 'Similar Places', primary: false }
                ];
            default:
                return [
                    { id: 'save', label: '❤️ Save', primary: true },
                    { id: 'search', label: '🔍 Similar', primary: false },
                    { id: 'share', label: '🔗 Share', primary: false }
                ];
        }
    };

    return (
        <div className="quick-actions">
            {getActions().slice(0, 3).map(action => (
                <button
                    key={action.id}
                    className={`action-btn ${action.primary ? 'primary' : 'outline'}`}
                    onClick={() => onAction(action.id)}
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
};
