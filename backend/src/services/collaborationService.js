const TokenService = require('./tokenService');
const PersonalityService = require('./personalityService');
const PromptService = require('./promptService');
const { parseAIResponse } = require('../utils/markupParser');
const OpenAIProvider = require('./aiProviders/openai');
const AnthropicProvider = require('./aiProviders/anthropic');
const GoogleProvider = require('./aiProviders/google');
const XAIProvider = require('./aiProviders/xai');
const { v4: uuidv4 } = require('uuid');

class CollaborationService {
  constructor() {
    this.tokenService = new TokenService();
    this.personalityService = new PersonalityService();
    this.promptService = new PromptService();
    this.providers = {
      openai: new OpenAIProvider(),
      anthropic: new AnthropicProvider(),
      google: new GoogleProvider(),
      xai: new XAIProvider()
    };
  }
  
  getProvider(providerName) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new Error(`Unsupported provider: ${providerName}`);
    }
    return provider;
  }
  
  async startCollaboration(userPrompt, models, apiKeys) {
    const sessionId = uuidv4();
    const conversation = {
      sessionId,
      improvedPrompt: '',
      exchanges: [],
      tokenUsage: 0,
      finalResponse: '',
      summary: '',
      aiModel1: models.generator, // First AI model
      aiModel2: models.reviewer || models.generator, // Second AI model (can be same or different)
      model1Personalities: [], // Track personalities used by model 1
      model2Personalities: [] // Track personalities used by model 2
    };
    
    try {
      // 1. Improve prompt
      console.log('Step 1: Improving prompt...');
      conversation.improvedPrompt = await this.improvePrompt(userPrompt, models.improver, apiKeys);
      
      // 2. Initial generation by AI Model 1
      console.log('Step 2: Generating initial response with AI Model 1...');
      const initialResponse = await this.generateInitial(conversation.improvedPrompt, conversation.aiModel1, apiKeys);
      conversation.exchanges.push(initialResponse);
      conversation.model1Personalities.push('INITIAL_GENERATOR');
      
      // 3. Collaboration cycle (max 6 exchanges)
      console.log('Step 3: Starting collaboration cycle...');
      let iteration = 1;
      let currentResponse = initialResponse.response;
      let currentModel = conversation.aiModel2; // Start with model 2 reviewing model 1's work
      let currentModelPersonalities = conversation.model2Personalities;
      let previousModelPersonalities = conversation.model1Personalities;
      let isModel1Turn = false; // Track whose turn it is
      
      while (iteration < 6 && !this.isReady(conversation.exchanges[conversation.exchanges.length - 1])) {
        // Get next available personality for current model
        const personality = this.getNextAvailablePersonality(currentModelPersonalities, iteration);
        
        const exchange = await this.processIteration(
          conversation.improvedPrompt,
          currentResponse,
          conversation.exchanges,
          personality,
          iteration,
          currentModel,
          apiKeys,
          isModel1Turn ? 'AI Model 1' : 'AI Model 2',
          isModel1Turn ? 'AI Model 2' : 'AI Model 1'
        );
        
        conversation.exchanges.push(exchange);
        currentResponse = exchange.revised_response || exchange.response;
        currentModelPersonalities.push(personality);
        iteration++;
        
        // Switch models for next iteration
        if (isModel1Turn) {
          currentModel = conversation.aiModel2;
          currentModelPersonalities = conversation.model2Personalities;
          previousModelPersonalities = conversation.model1Personalities;
        } else {
          currentModel = conversation.aiModel1;
          currentModelPersonalities = conversation.model1Personalities;
          previousModelPersonalities = conversation.model2Personalities;
        }
        isModel1Turn = !isModel1Turn;
        
        // Check token limits
        if (!this.tokenService.validateTokenUsage(exchange.tokenCount || 0)) {
          console.log('Token limit reached, stopping collaboration');
          break;
        }
      }
      
      // 4. Generate summary
      console.log('Step 4: Generating summary...');
      conversation.summary = await this.generateSummary(conversation.exchanges, conversation.aiModel1, apiKeys);
      conversation.finalResponse = currentResponse;
      conversation.totalTokens = this.tokenService.getSessionTokens();
      
      return conversation;
    } catch (error) {
      console.error('Collaboration error:', error);
      throw error;
    }
  }
  
  getNextAvailablePersonality(usedPersonalities, iteration) {
    const allPersonalities = this.personalityService.getAllPersonalities();
    const availablePersonalities = allPersonalities.filter(p => !usedPersonalities.includes(p));
    
    if (availablePersonalities.length === 0) {
      return 'FINAL_POLISH'; // Fallback if all personalities used
    }
    
    // Return the first available personality, or cycle through them
    return availablePersonalities[0];
  }
  
  async improvePrompt(userPrompt, modelConfig, apiKeys) {
    const provider = this.getProvider(modelConfig.provider);
    const prompt = this.promptService.generatePromptImproverPrompt(userPrompt);
    
    const response = await provider.generateResponse(prompt, modelConfig.model);
    const tokenCount = this.tokenService.countTokens(prompt + response.content);
    
    if (!this.tokenService.validateTokenUsage(tokenCount)) {
      throw new Error('Token limit exceeded during prompt improvement');
    }
    
    this.tokenService.addTokens(tokenCount);
    return response.content.trim();
  }
  
  async generateInitial(improvedPrompt, modelConfig, apiKeys) {
    const provider = this.getProvider(modelConfig.provider);
    const prompt = this.promptService.generateInitialGeneratorPrompt(improvedPrompt);
    
    const response = await provider.generateResponse(prompt, modelConfig.model);
    const parsedResponse = parseAIResponse(response.content);
    const tokenCount = this.tokenService.countTokens(prompt + response.content);
    
    if (!this.tokenService.validateTokenUsage(tokenCount)) {
      throw new Error('Token limit exceeded during initial generation');
    }
    
    this.tokenService.addTokens(tokenCount);
    
    return {
      personality: 'INITIAL_GENERATOR',
      response: parsedResponse.response || response.content,
      thoughts: parsedResponse.thoughts || '',
      confidence_score: parsedResponse.confidence_score || 5,
      collaboration_note: parsedResponse.collaboration_note || '',
      ready_status: parsedResponse.ready_status || 'NOT_READY',
      tokenCount,
      timestamp: new Date().toISOString(),
      model: 'AI Model 1'
    };
  }
  
  async processIteration(improvedPrompt, currentResponse, exchanges, personality, iteration, modelConfig, apiKeys, currentModelName, otherModelName) {
    const provider = this.getProvider(modelConfig.provider);
    const previousExchange = exchanges[exchanges.length - 1];
    const conversationHistory = this.buildConversationHistory(exchanges);
    
    let prompt;
    if (personality === 'CRITICAL_REVIEWER') {
      prompt = this.promptService.generateCriticalReviewerPrompt(
        improvedPrompt,
        previousExchange.response,
        previousExchange.thoughts,
        previousExchange.collaboration_note,
        previousExchange.confidence_score,
        conversationHistory,
        currentModelName,
        otherModelName
      );
    } else {
      prompt = this.promptService.generatePersonalityPrompt(
        improvedPrompt,
        currentResponse,
        conversationHistory,
        personality,
        iteration,
        previousExchange.personality,
        previousExchange.confidence_score,
        currentModelName,
        otherModelName
      );
    }
    
    const response = await provider.generateResponse(prompt, modelConfig.model);
    const parsedResponse = parseAIResponse(response.content);
    const tokenCount = this.tokenService.countTokens(prompt + response.content);
    
    if (!this.tokenService.validateTokenUsage(tokenCount)) {
      throw new Error('Token limit exceeded during iteration');
    }
    
    this.tokenService.addTokens(tokenCount);
    
    return {
      personality,
      response: parsedResponse.response || response.content,
      revised_response: parsedResponse.revised_response || parsedResponse.response || response.content,
      thoughts: parsedResponse.thoughts || '',
      confidence_score: parsedResponse.confidence_score || 5,
      collaboration_note: parsedResponse.collaboration_note || '',
      ready_status: parsedResponse.ready_status || 'NOT_READY',
      personality_focus: parsedResponse.personality_focus || '',
      analysis: parsedResponse.analysis || '',
      changes_made: parsedResponse.changes_made || '',
      review: parsedResponse.review || '',
      improvements_needed: parsedResponse.improvements_needed || '',
      tokenCount,
      timestamp: new Date().toISOString(),
      model: currentModelName
    };
  }
  
  async generateSummary(exchanges, modelConfig, apiKeys) {
    const provider = this.getProvider(modelConfig.provider);
    const prompt = this.promptService.generateSummaryPrompt(exchanges);
    
    const response = await provider.generateResponse(prompt, modelConfig.model, 1000);
    const tokenCount = this.tokenService.countTokens(prompt + response.content);
    
    if (!this.tokenService.validateTokenUsage(tokenCount)) {
      return 'Summary generation skipped due to token limits.';
    }
    
    this.tokenService.addTokens(tokenCount);
    return response.content.trim();
  }
  
  buildConversationHistory(exchanges) {
    return exchanges.map((exchange, index) => {
      return `Exchange ${index + 1} (${exchange.model} - ${exchange.personality}):
Response: ${exchange.response}
Thoughts: ${exchange.thoughts}
Confidence: ${exchange.confidence_score}/10
Status: ${exchange.ready_status}`;
    }).join('\n\n');
  }
  
  isReady(exchange) {
    return exchange.ready_status === 'READY';
  }
  
  reset() {
    this.tokenService.reset();
  }
}

module.exports = CollaborationService; 