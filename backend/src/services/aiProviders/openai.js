const OpenAI = require('openai');
const config = require('../../config/env');

class OpenAIProvider {
  constructor() {
    this.client = new OpenAI({
      apiKey: config.apiKeys.openai
    });
  }
  
  async generateResponse(prompt, model = 'gpt-4o-mini', maxTokens = 30000) {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9
      });
      
      return {
        content: completion.choices[0].message.content,
        usage: completion.usage,
        model: model
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
  
  async streamResponse(prompt, model = 'gpt-4o-mini', maxTokens = 30000) {
    try {
      const stream = await this.client.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        stream: true
      });
      
      return stream;
    } catch (error) {
      console.error('OpenAI Stream Error:', error);
      throw new Error(`OpenAI Stream Error: ${error.message}`);
    }
  }
  
  getSupportedModels() {
    return [
      'gpt-4.1',
      'gpt-4.1-nano', 
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo'
    ];
  }
  
  isModelSupported(model) {
    return this.getSupportedModels().includes(model);
  }
}

module.exports = OpenAIProvider; 