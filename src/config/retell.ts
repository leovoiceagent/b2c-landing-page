/**
 * Retell AI Voice Agent Configuration
 *
 * For HVAC B2C German Landing Page
 */
export const RETELL_CONFIG = {
  // Retell API Base URL
  BASE_URL: 'https://api.retellai.com',

  // Retell API Key - Get this from your Retell Dashboard
  // Add this to your .env file as VITE_RETELL_API_KEY
  API_KEY: import.meta.env.VITE_RETELL_API_KEY || '',

  // HVAC B2C Agent ID
  // Add this to your .env file as VITE_HVAC_AGENT_ID
  DEFAULT_AGENT_ID: import.meta.env.VITE_HVAC_AGENT_ID || '',

  // Agent Configuration (German B2C)
  AGENT_NAME: 'LEO Heizungs-Assistent',

  // Sample rate for audio (24kHz is recommended for best quality)
  SAMPLE_RATE: 24000,

  // Enable backchannel (AI can make sounds like "mhm" while listening)
  ENABLE_BACKCHANNEL: true,
};

// Validate configuration
if (!RETELL_CONFIG.API_KEY) {
  console.warn('VITE_RETELL_API_KEY not found in environment variables. Voice demo will not work.');
}

if (!RETELL_CONFIG.DEFAULT_AGENT_ID) {
  console.warn('VITE_HVAC_AGENT_ID not found in environment variables. Voice demo will not work.');
}
