const config = require('../config/env');

class TokenService {
  constructor() {
    this.sessionTokens = 0;
    this.responseTokens = [];
    this.limits = config.limits;
  }
  
  validateTokenUsage(newTokens) {
    return (this.sessionTokens + newTokens) <= this.limits.maxSessionTokens;
  }
  
  validateResponseTokens(newTokens) {
    return newTokens <= this.limits.maxResponseTokens;
  }
  
  countTokens(text) {
    // Approximate token counting (4 chars = 1 token)
    // This is a rough approximation - in production you'd want more accurate counting
    if (!text) return 0;
    return Math.ceil(text.length / 4);
  }
  
  addTokens(tokenCount) {
    this.sessionTokens += tokenCount;
    this.responseTokens.push(tokenCount);
    return this.sessionTokens;
  }
  
  getSessionTokens() {
    return this.sessionTokens;
  }
  
  getResponseTokens() {
    return this.responseTokens;
  }
  
  reset() {
    this.sessionTokens = 0;
    this.responseTokens = [];
  }
  
  getRemainingTokens() {
    return this.limits.maxSessionTokens - this.sessionTokens;
  }
  
  getAverageTokensPerResponse() {
    if (this.responseTokens.length === 0) return 0;
    return Math.round(this.responseTokens.reduce((a, b) => a + b, 0) / this.responseTokens.length);
  }
}

module.exports = TokenService; 