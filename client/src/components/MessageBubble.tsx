/**
 * MessageBubble Component
 * Clean, modern chat message display with markdown-like rendering
 */

import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    onVoice?: () => void;
    onSave?: () => void;
    onRemove?: () => void;
    isSaved?: boolean;
}

// Simple markdown-like parser for chat messages
const parseContent = (content: string) => {
    // Split by line breaks and process
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
        if (currentList.length > 0 && listType) {
            const ListTag = listType;
            elements.push(
                <ListTag key={`list-${elements.length}`} className="content-list">
                    {currentList.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ListTag>
            );
            currentList = [];
            listType = null;
        }
    };

    lines.forEach((line, i) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith('## ')) {
            flushList();
            const text = trimmed.replace(/^## /, '').replace(/[#️⃣🏖️🍽️🎸🛡️⏰🏝️🌴💡🎯🏆]/g, '').trim();
            const emoji = trimmed.match(/[🏖️🍽️🎸🛡️⏰🏝️🌴💡🎯🏆]/)?.[0];
            elements.push(
                <h2 key={i} className="msg-heading">
                    {emoji && <span className="heading-icon">{emoji}</span>}
                    {text}
                </h2>
            );
            return;
        }

        if (trimmed.startsWith('### ')) {
            flushList();
            const text = trimmed.replace(/^### /, '').replace(/[🏆📍⚠️✅🎵🌅📞🗓️]/g, '').trim();
            elements.push(<h3 key={i} className="msg-subheading">{text}</h3>);
            return;
        }

        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (listType !== 'ul') flushList();
            listType = 'ul';
            currentList.push(trimmed.replace(/^[-*] /, ''));
            return;
        }

        if (/^\d+\. /.test(trimmed)) {
            if (listType !== 'ol') flushList();
            listType = 'ol';
            currentList.push(trimmed.replace(/^\d+\. /, ''));
            return;
        }

        // Table detection (simple)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            flushList();
            // Skip table separator rows
            if (trimmed.includes('---')) return;

            const cells = trimmed.split('|').filter(c => c.trim());
            const isHeader = i === 0 || (lines[i - 1]?.trim().startsWith('**') || lines[i + 1]?.includes('---'));

            if (isHeader && cells.length >= 2) {
                elements.push(
                    <div key={i} className="table-row header">
                        {cells.map((cell, ci) => (
                            <span key={ci} className="table-cell">{cell.trim()}</span>
                        ))}
                    </div>
                );
            } else {
                elements.push(
                    <div key={i} className="table-row">
                        {cells.map((cell, ci) => (
                            <span key={ci} className="table-cell">{cell.trim()}</span>
                        ))}
                    </div>
                );
            }
            return;
        }

        // Regular paragraph
        flushList();
        if (trimmed) {
            // Parse inline formatting
            let processed = trimmed
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>');

            elements.push(
                <p key={i} className="msg-paragraph" dangerouslySetInnerHTML={{ __html: processed }} />
            );
        }
    });

    flushList();
    return elements;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    role,
    content,
    timestamp,
    onVoice,
    onSave,
    onRemove,
    isSaved
}) => {
    const isUser = role === 'user';

    return (
        <div className={`message-bubble ${role}`}>
            {!isUser && (
                <div className="avatar">
                    <span>🌴</span>
                </div>
            )}

            <div className="bubble-content">
                <div className="bubble-body">
                    {isUser ? (
                        <p className="user-text">{content}</p>
                    ) : (
                        <div className="assistant-text">
                            {parseContent(content)}
                        </div>
                    )}
                </div>

                <div className="bubble-footer">
                    <span className="timestamp">
                        {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {!isUser && (
                        <div className="bubble-actions">
                            {onVoice && (
                                <button className="bubble-action" onClick={onVoice} title="Listen">
                                    🔊
                                </button>
                            )}
                            {onSave && (
                                <button
                                    className={`bubble-action ${isSaved ? 'saved' : ''}`}
                                    onClick={onSave}
                                    title={isSaved ? "Unsave" : "Save"}
                                >
                                    {isSaved ? '❤️' : '🤍'}
                                </button>
                            )}
                            {onRemove && (
                                <button className="bubble-action delete" onClick={onRemove} title="Remove">
                                    🗑️
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
