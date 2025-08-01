const config = require('../../config/env');

class XAIProvider {
  constructor() {
    this.apiKey = config.apiKeys.xai;
    this.baseURL = 'https://api.x.ai/v1';
  }
  
  async generateResponse(prompt, model = 'grok-beta', maxTokens = 30000) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: model
      };
    } catch (error) {
      console.error('xAI API Error:', error);
      throw new Error(`xAI API Error: ${error.message}`);
    }
  }
  
  async streamResponse(prompt, model = 'grok-beta', maxTokens = 30000) {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.body;
    } catch (error) {
      console.error('xAI Stream Error:', error);
      throw new Error(`xAI Stream Error: ${error.message}`);
    }
  }
  
  getSupportedModels() {
    return [
      'grok-beta',
      'grok-2',
      'grok-1'
    ];
  }
  
  isModelSupported(model) {
    return this.getSupportedModels().includes(model);
  }
}

module.exports = XAIProvider; 