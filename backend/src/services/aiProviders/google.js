const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config/env');

class GoogleProvider {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.apiKeys.google);
  }
  
  async generateResponse(prompt, model = 'gemini-1.5-pro', maxTokens = 30000) {
    try {
      const genModel = this.genAI.getGenerativeModel({ model: model });
      
      const result = await genModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        content: text,
        usage: {
          prompt_tokens: response.usageMetadata?.promptTokenCount || 0,
          completion_tokens: response.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: (response.usageMetadata?.promptTokenCount || 0) + (response.usageMetadata?.candidatesTokenCount || 0)
        },
        model: model
      };
    } catch (error) {
      console.error('Google AI API Error:', error);
      throw new Error(`Google AI API Error: ${error.message}`);
    }
  }
  
  async streamResponse(prompt, model = 'gemini-1.5-pro', maxTokens = 30000) {
    try {
      const genModel = this.genAI.getGenerativeModel({ model: model });
      
      const result = await genModel.generateContentStream(prompt);
      
      return result;
    } catch (error) {
      console.error('Google AI Stream Error:', error);
      throw new Error(`Google AI Stream Error: ${error.message}`);
    }
  }
  
  getSupportedModels() {
    return [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro'
    ];
  }
  
  isModelSupported(model) {
    return this.getSupportedModels().includes(model);
  }
}

module.exports = GoogleProvider; 