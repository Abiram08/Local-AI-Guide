import React, { useState } from 'react';
import './App.css';
import { TouristPersona, Itinerary, SafetyAlert } from './types';

interface AppState {
    loading: boolean;
    persona: TouristPersona | null;
    itinerary: Itinerary | null;
    safetyAlerts: SafetyAlert[];
    error: string | null;
}

function App() {
    const [state, setState] = useState<AppState>({
        loading: false,
        persona: null,
        itinerary: null,
        safetyAlerts: [],
        error: null,
    });

    const [userInput, setUserInput] = useState({
        date: '2025-12-28',
        budget: 4500,
        interests: {
            beaches: 0,
            food: 0,
            water_sports: 0,
            heritage: 0,
            nightlife: 0,
        },
    });

    const handleInterestChange = (interest: string, value: number) => {
        setUserInput({
            ...userInput,
            interests: {
                ...userInput.interests,
                [interest]: value,
            },
        });
    };

    const handleGenerateItinerary = async () => {
        setState({ ...state, loading: true, error: null });

        try {
            // In production, this would call the backend API
            // For now, we'll simulate the response
            const response = await fetch('/api/orchestrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'USER_' + Date.now(),
                    date: userInput.date,
                    budget: userInput.budget,
                    appInteractions: {
                        clicks: userInput.interests,
                        searches: [],
                        time_spent: {},
                        filters_used: { budget: 'moderate', group_size: 2 },
                    },
                    start_time: '06:30',
                }),
            });

            const data = await response.json();

            setState({
                loading: false,
                persona: data.persona,
                itinerary: data.itinerary,
                safetyAlerts: data.safety_alerts,
                error: null,
            });
        } catch (error) {
            setState({
                ...state,
                loading: false,
                error: 'Failed to generate itinerary. Please try again.',
            });
        }
    };

    return (
        <div className="App">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <h1 className="logo">🏖️ GoanFlow</h1>
                    <p className="tagline">AI-Native Tourism OS for Goa</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="main">
                <div className="container">
                    {/* Input Section */}
                    {!state.itinerary && (
                        <div className="input-section">
                            <h2>Plan Your Perfect Day in Goa</h2>
                            <p className="subtitle">
                                Tell us your interests and we'll create a personalized itinerary
                                with fair prices, crowd predictions, and safety alerts.
                            </p>

                            <div className="form">
                                {/* Date Input */}
                                <div className="form-group">
                                    <label>Travel Date</label>
                                    <input
                                        type="date"
                                        value={userInput.date}
                                        onChange={(e) =>
                                            setUserInput({ ...userInput, date: e.target.value })
                                        }
                                        className="input"
                                    />
                                </div>

                                {/* Budget Input */}
                                <div className="form-group">
                                    <label>Budget (₹ per day)</label>
                                    <input
                                        type="number"
                                        value={userInput.budget}
                                        onChange={(e) =>
                                            setUserInput({
                                                ...userInput,
                                                budget: parseInt(e.target.value),
                                            })
                                        }
                                        className="input"
                                        min="1000"
                                        max="20000"
                                        step="500"
                                    />
                                    <div className="budget-display">₹{userInput.budget}</div>
                                </div>

                                {/* Interests Sliders */}
                                <div className="form-group">
                                    <label>Your Interests (slide to indicate level)</label>

                                    <div className="interest-slider">
                                        <span className="interest-label">🏖️ Beaches</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={userInput.interests.beaches}
                                            onChange={(e) =>
                                                handleInterestChange('beaches', parseInt(e.target.value))
                                            }
                                            className="slider"
                                        />
                                        <span className="interest-value">
                                            {userInput.interests.beaches}
                                        </span>
                                    </div>

                                    <div className="interest-slider">
                                        <span className="interest-label">🍽️ Food</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={userInput.interests.food}
                                            onChange={(e) =>
                                                handleInterestChange('food', parseInt(e.target.value))
                                            }
                                            className="slider"
                                        />
                                        <span className="interest-value">
                                            {userInput.interests.food}
                                        </span>
                                    </div>

                                    <div className="interest-slider">
                                        <span className="interest-label">🏄 Water Sports</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={userInput.interests.water_sports}
                                            onChange={(e) =>
                                                handleInterestChange(
                                                    'water_sports',
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="slider"
                                        />
                                        <span className="interest-value">
                                            {userInput.interests.water_sports}
                                        </span>
                                    </div>

                                    <div className="interest-slider">
                                        <span className="interest-label">🏛️ Heritage</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={userInput.interests.heritage}
                                            onChange={(e) =>
                                                handleInterestChange('heritage', parseInt(e.target.value))
                                            }
                                            className="slider"
                                        />
                                        <span className="interest-value">
                                            {userInput.interests.heritage}
                                        </span>
                                    </div>

                                    <div className="interest-slider">
                                        <span className="interest-label">🎉 Nightlife</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={userInput.interests.nightlife}
                                            onChange={(e) =>
                                                handleInterestChange('nightlife', parseInt(e.target.value))
                                            }
                                            className="slider"
                                        />
                                        <span className="interest-value">
                                            {userInput.interests.nightlife}
                                        </span>
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button
                                    onClick={handleGenerateItinerary}
                                    disabled={state.loading}
                                    className="btn-primary"
                                >
                                    {state.loading ? '🔄 Generating...' : '✨ Generate My Perfect Day'}
                                </button>

                                {state.error && <div className="error">{state.error}</div>}
                            </div>
                        </div>
                    )}

                    {/* Results Section */}
                    {state.itinerary && (
                        <div className="results-section">
                            {/* Persona Card */}
                            {state.persona && (
                                <div className="card persona-card">
                                    <h3>👤 Your Travel Persona</h3>
                                    <div className="persona-content">
                                        <div className="persona-type">{state.persona.persona}</div>
                                        <div className="persona-confidence">
                                            Confidence: {(state.persona.confidence * 100).toFixed(0)}%
                                        </div>
                                        <div className="persona-interests">
                                            <strong>Interests:</strong>{' '}
                                            {state.persona.interests.join(', ')}
                                        </div>
                                        <div className="persona-budget">
                                            <strong>Budget:</strong> ₹{state.persona.budget_per_day}/day
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Safety Alerts */}
                            {state.safetyAlerts.length > 0 && (
                                <div className="card safety-card">
                                    <h3>🛡️ Safety Alerts</h3>
                                    {state.safetyAlerts.map((alert, index) => (
                                        <div
                                            key={index}
                                            className={`alert alert-${alert.severity.toLowerCase()}`}
                                        >
                                            <div className="alert-type">{alert.type}</div>
                                            <div className="alert-message">{alert.message}</div>
                                            <div className="alert-action">
                                                <strong>Action:</strong> {alert.action}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Matched Guide */}
                            <div className="card guide-card">
                                <h3>🧑‍🤝‍🧑 Your Matched Guide</h3>
                                <div className="guide-content">
                                    <div className="guide-name">{state.itinerary.matched_guide.name}</div>
                                    <div className="guide-score">
                                        Match Score: {state.itinerary.matched_guide.score}/40
                                    </div>
                                    <div className="guide-reason">
                                        {state.itinerary.matched_guide.match_reason}
                                    </div>
                                    <div className="guide-details">
                                        <div>
                                            <strong>Languages:</strong>{' '}
                                            {state.itinerary.matched_guide.languages.join(', ')}
                                        </div>
                                        <div>
                                            <strong>Specialties:</strong>{' '}
                                            {state.itinerary.matched_guide.specialties.join(', ')}
                                        </div>
                                        <div>
                                            <strong>Rate:</strong> {state.itinerary.matched_guide.rate}
                                        </div>
                                        <div>
                                            <strong>Rating:</strong> {state.itinerary.matched_guide.rating}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Itinerary */}
                            <div className="card itinerary-card">
                                <h3>📋 Your Perfect Day Itinerary</h3>
                                <div className="itinerary-date">
                                    {new Date(state.itinerary.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>

                                <div className="activities">
                                    {state.itinerary.activities.map((activity, index) => (
                                        <div key={index} className="activity">
                                            <div className="activity-time">{activity.time}</div>
                                            <div className="activity-content">
                                                <div className="activity-header">
                                                    <h4>{activity.activity_name}</h4>
                                                    <span className="activity-type">{activity.type}</span>
                                                </div>
                                                <div className="activity-location">
                                                    📍 {activity.location}
                                                </div>
                                                <div className="activity-details">
                                                    <div className="detail">
                                                        <span className="detail-label">Cost:</span>
                                                        <span className="detail-value">
                                                            ₹{activity.cost}{' '}
                                                            {activity.fair_price_verified && (
                                                                <span className="verified">✓ Fair</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="detail">
                                                        <span className="detail-label">Crowd:</span>
                                                        <span className="detail-value">
                                                            {activity.crowd_status}
                                                        </span>
                                                    </div>
                                                    <div className="detail">
                                                        <span className="detail-label">Safety:</span>
                                                        <span className="detail-value">
                                                            {'⭐'.repeat(activity.safety_rating)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="activity-why">
                                                    <strong>Why:</strong> {activity.why_recommended}
                                                </div>
                                                {activity.alternatives && activity.alternatives.length > 0 && (
                                                    <div className="activity-alternatives">
                                                        <strong>Alternatives:</strong>{' '}
                                                        {activity.alternatives.join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Summary */}
                            <div className="card summary-card">
                                <h3>💡 Daily Summary</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <div className="summary-label">Total Spent</div>
                                        <div className="summary-value">
                                            ₹{state.itinerary.daily_summary.total_spent}
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <div className="summary-label">Remaining Budget</div>
                                        <div className="summary-value">
                                            ₹{state.itinerary.daily_summary.remaining_budget}
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <div className="summary-label">Guide Income</div>
                                        <div className="summary-value">
                                            ₹{state.itinerary.daily_summary.guide_income}
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <div className="summary-label">Fair Prices</div>
                                        <div className="summary-value">
                                            {state.itinerary.daily_summary.fair_prices_verified_percentage}%
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <div className="summary-label">Safety Score</div>
                                        <div className="summary-value">
                                            {state.itinerary.daily_summary.safety_score}/10
                                        </div>
                                    </div>
                                    <div className="summary-item">
                                        <div className="summary-label">Satisfaction Prediction</div>
                                        <div className="summary-value">
                                            {state.itinerary.daily_summary.satisfaction_prediction}/10
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* New Itinerary Button */}
                            <button
                                onClick={() =>
                                    setState({
                                        loading: false,
                                        persona: null,
                                        itinerary: null,
                                        safetyAlerts: [],
                                        error: null,
                                    })
                                }
                                className="btn-secondary"
                            >
                                ← Plan Another Day
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>
                        Built with ❤️ for Goa's 8 million annual tourists | Powered by 6 AI
                        Agents
                    </p>
                    <p className="footer-tech">
                        TypeScript • Claude 3.5 Sonnet • AWS Amplify Gen 2 • Kiro
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
