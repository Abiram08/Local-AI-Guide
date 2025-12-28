/**
 * Database Utility - RDS PostgreSQL
 * 
 * Handles persistence for LocalVoice Goa conversation history and user profiles.
 */

import { Pool } from 'pg';

// Initialize connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Save a conversation exchange to the database
 */
export async function saveConversation(
    userId: string,
    message: string,
    response: string,
    meta: { intent?: string, personality?: string }
): Promise<void> {
    try {
        await pool.query(
            'INSERT INTO conversations (user_id, message, response, intent, personality) VALUES ($1, $2, $3, $4, $5)',
            [userId, message, response, meta.intent, meta.personality]
        );
    } catch (error) {
        console.error('Error saving conversation to RDS:', error);
    }
}

/**
 * Retrieve a user's profile from the database
 */
export async function getUserProfile(userId: string): Promise<any> {
    try {
        const result = await pool.query(
            'SELECT * FROM user_profiles WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching user profile from RDS:', error);
        return null;
    }
}

/**
 * Update a user's personality type in their profile
 */
export async function updatePersonality(userId: string, newPersonality: string): Promise<void> {
    try {
        // Use an upsert logic or simple update
        await pool.query(
            'INSERT INTO user_profiles (user_id, personality_type, message_count, updated_at) ' +
            'VALUES ($1, $2, 1, NOW()) ' +
            'ON CONFLICT (user_id) DO UPDATE SET ' +
            'personality_type = $1, message_count = user_profiles.message_count + 1, updated_at = NOW()',
            [userId, newPersonality]
        );
    } catch (error) {
        console.error('Error updating user personality in RDS:', error);
    }
}

export default pool;
