require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKeys: {
    openai: process.env.OPENAI_API_KEY,
    google: process.env.GOOGLE_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    xai: process.env.XAI_API_KEY
  },
  limits: {
    maxSessionTokens: parseInt(process.env.MAX_SESSION_TOKENS) || 1000000,
    maxResponseTokens: parseInt(process.env.MAX_RESPONSE_TOKENS) || 30000,
    maxAIExchanges: parseInt(process.env.MAX_AI_EXCHANGES) || 6
  }
};

module.exports = config; 