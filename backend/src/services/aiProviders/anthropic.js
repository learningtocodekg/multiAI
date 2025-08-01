const Anthropic = require('@anthropic-ai/sdk');
const config = require('../../config/env');

class AnthropicProvider {
  constructor() {
    this.client = new Anthropic({
      apiKey: config.apiKeys.anthropic
    });
  }
  
  async generateResponse(prompt, model = 'claude-3-5-sonnet-20241022', maxTokens = 30000) {
    try {
      const message = await this.client.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      
      return {
        content: message.content[0].text,
        usage: {
          prompt_tokens: message.usage.input_tokens,
          completion_tokens: message.usage.output_tokens,
          total_tokens: message.usage.input_tokens + message.usage.output_tokens
        },
        model: model
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Anthropic API Error: ${error.message}`);
    }
  }
  
  async streamResponse(prompt, model = 'claude-3-5-sonnet-20241022', maxTokens = 30000) {
    try {
      const stream = await this.client.messages.create({
        model: model,
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true
      });
      
      return stream;
    } catch (error) {
      console.error('Anthropic Stream Error:', error);
      throw new Error(`Anthropic Stream Error: ${error.message}`);
    }
  }
  
  getSupportedModels() {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229'
    ];
  }
  
  isModelSupported(model) {
    return this.getSupportedModels().includes(model);
  }
}

module.exports = AnthropicProvider; 