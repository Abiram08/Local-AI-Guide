/**
 * TopicChips Component
 * Clean, tappable category chips for topic selection
 */

import React from 'react';
import './TopicChips.css';

interface Topic {
    id: string;
    label: string;
    icon: string;
    examples: string[];
    color: 'teal' | 'coral' | 'gold' | 'purple';
}

const topics: Topic[] = [
    {
        id: 'beaches',
        label: 'Beaches',
        icon: '🏖️',
        examples: ['Which beach?', 'Sunset spots'],
        color: 'teal'
    },
    {
        id: 'food',
        label: 'Food',
        icon: '🍽️',
        examples: ['Fish curry rice', 'Cafes'],
        color: 'coral'
    },
    {
        id: 'accommodation',
        label: 'Stays',
        icon: '🏠',
        examples: ['Hostels', 'Hotels'],
        color: 'purple'
    },
    {
        id: 'markets',
        label: 'Markets',
        icon: '🛍️',
        examples: ['Flea markets', 'Shopping'],
        color: 'gold'
    },
    {
        id: 'activities',
        label: 'Activities',
        icon: '🎯',
        examples: ['Nightlife', 'Things to do'],
        color: 'teal'
    }
];


interface TopicChipsProps {
    onSelect: (topic: string, example?: string) => void;
}

export const TopicChips: React.FC<TopicChipsProps> = ({ onSelect }) => {
    return (
        <div className="topic-chips-container">
            <p className="chips-label">Ask me about:</p>
            <div className="topic-chips">
                {topics.map(topic => (
                    <button
                        key={topic.id}
                        className={`topic-chip ${topic.color}`}
                        onClick={() => onSelect(topic.id)}
                    >
                        <span className="chip-icon">{topic.icon}</span>
                        <span className="chip-label">{topic.label}</span>
                    </button>
                ))}
            </div>

            <div className="example-questions">
                <p className="examples-label">Popular questions:</p>
                <div className="examples-list">
                    <button onClick={() => onSelect('beaches', 'Which beach should I visit?')}>
                        "Which beach should I visit?"
                    </button>
                    <button onClick={() => onSelect('food', 'Best fish curry rice?')}>
                        "Best fish curry rice?"
                    </button>
                    <button onClick={() => onSelect('activities', "What's happening tonight?")}>
                        "What's happening tonight?"
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopicChips;
