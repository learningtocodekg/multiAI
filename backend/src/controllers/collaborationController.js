const CollaborationService = require('../services/collaborationService');
const config = require('../config/env');

class CollaborationController {
  constructor() {
    this.collaborationService = new CollaborationService();
  }
  
  async startCollaboration(req, res) {
    try {
      const { userPrompt, models } = req.body;
      
      // Validate input
      if (!userPrompt || !models) {
        return res.status(400).json({
          error: 'Missing required fields: userPrompt and models'
        });
      }
      
      if (!models.improver || !models.generator) {
        return res.status(400).json({
          error: 'Missing required model configurations: improver and generator'
        });
      }
      
      // Set reviewer model to generator if not provided (backward compatibility)
      if (!models.reviewer) {
        models.reviewer = models.generator;
      }
      
      // Validate API keys
      const apiKeys = {
        openai: config.apiKeys.openai,
        google: config.apiKeys.google,
        anthropic: config.apiKeys.anthropic,
        xai: config.apiKeys.xai
      };
      
      // Check if required API keys are available
      const requiredProviders = [models.improver.provider, models.generator.provider, models.reviewer.provider];
      const missingKeys = requiredProviders.filter(provider => !apiKeys[provider]);
      
      if (missingKeys.length > 0) {
        return res.status(400).json({
          error: `Missing API keys for providers: ${missingKeys.join(', ')}`
        });
      }
      
      // Reset service for new session
      this.collaborationService.reset();
      
      // Start collaboration
      const result = await this.collaborationService.startCollaboration(userPrompt, models, apiKeys);
      
      res.json({
        sessionId: result.sessionId,
        exchanges: result.exchanges,
        summary: result.summary,
        totalTokens: result.totalTokens,
        finalResponse: result.finalResponse,
        improvedPrompt: result.improvedPrompt,
        aiModel1: result.aiModel1,
        aiModel2: result.aiModel2
      });
      
    } catch (error) {
      console.error('Collaboration controller error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  async getSupportedModels(req, res) {
    try {
      const models = {
        openai: this.collaborationService.getProvider('openai').getSupportedModels(),
        google: this.collaborationService.getProvider('google').getSupportedModels(),
        anthropic: this.collaborationService.getProvider('anthropic').getSupportedModels(),
        xai: this.collaborationService.getProvider('xai').getSupportedModels()
      };
      
      res.json({ models });
    } catch (error) {
      console.error('Get models error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  async getCollaborationStatus(req, res) {
    try {
      const { sessionId } = req.params;
      
      // For now, return basic status
      // In a real implementation, you'd store session data
      res.json({
        sessionId,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
  
  async streamCollaboration(req, res) {
    try {
      const { sessionId } = req.params;
      
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });
      
      // Send initial connection message
      res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);
      
      // In a real implementation, you'd stream real-time updates
      // For now, we'll just send a completion message
      setTimeout(() => {
        res.write(`data: ${JSON.stringify({ type: 'complete', sessionId })}\n\n`);
        res.end();
      }, 1000);
      
    } catch (error) {
      console.error('Stream error:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    }
  }
}

module.exports = CollaborationController; 