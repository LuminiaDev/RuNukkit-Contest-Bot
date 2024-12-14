import * as dotenv from 'dotenv';

/**
 * Configuration dotenv
 */
dotenv.config();

/**
 * Constants with .env variables
 */
export const FALLBACK_LANGUAGE = process.env.FALLBACK_LANGUAGE || '';
export const BOT_TOKEN = process.env.BOT_TOKEN || '';
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID || '';


/**
 * Check for all variables
 */
if (!FALLBACK_LANGUAGE || !BOT_TOKEN) {
    throw new Error('One of the variables is not found: (FALLBACK_LANGUAGE, BOT_TOKEN, BOT_CLIENT_ID)');
}