import React, { useState } from 'react';
import { collaborationAPI } from './utils/apiClient';
import ModelSelector from './components/ModelSelector';
import PromptInput from './components/PromptInput';
import CollaborationDisplay from './components/CollaborationDisplay';
import TokenTracker from './components/TokenTracker';
import CollaborationSummary from './components/CollaborationSummary';
import { AlertCircle, Bot, Zap } from 'lucide-react';

function App() {
  const [selectedModels, setSelectedModels] = useState({
    improver: { provider: 'openai', model: 'gpt-4o-mini' },
    generator: { provider: 'openai', model: 'gpt-4o-mini' },
    reviewer: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
  });
  
  const [collaborationState, setCollaborationState] = useState({
    isLoading: false,
    exchanges: [],
    summary: '',
    totalTokens: 0,
    finalResponse: '',
    improvedPrompt: '',
    error: null
  });

  const handleStartCollaboration = async (userPrompt) => {
    setCollaborationState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await collaborationAPI.startCollaboration(userPrompt, selectedModels);
      
      setCollaborationState({
        isLoading: false,
        exchanges: result.exchanges || [],
        summary: result.summary || '',
        totalTokens: result.totalTokens || 0,
        finalResponse: result.finalResponse || '',
        improvedPrompt: result.improvedPrompt || '',
        error: null
      });
    } catch (error) {
      console.error('Collaboration error:', error);
      setCollaborationState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.error || error.message || 'An error occurred during collaboration'
      }));
    }
  };

  const handleModelsChange = (newModels) => {
    setSelectedModels(newModels);
  };

  const responseTokens = collaborationState.exchanges.map(ex => ex.tokenCount || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                AI Collaboration Platform
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Watch AI models work together
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ModelSelector 
              onModelsChange={handleModelsChange}
              selectedModels={selectedModels}
            />
            
            <TokenTracker 
              sessionTokens={collaborationState.totalTokens}
              responseTokens={responseTokens}
              exchangeCount={collaborationState.exchanges.length}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Error Display */}
            {collaborationState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                </div>
                <p className="mt-1 text-sm text-red-700">{collaborationState.error}</p>
              </div>
            )}

            {/* Prompt Input */}
            <PromptInput 
              onSubmit={handleStartCollaboration}
              isLoading={collaborationState.isLoading}
              disabled={!selectedModels.improver || !selectedModels.generator || !selectedModels.reviewer}
            />

            {/* Collaboration Summary */}
            {collaborationState.exchanges.length > 0 && (
              <CollaborationSummary 
                summary={collaborationState.summary}
                exchanges={collaborationState.exchanges}
                totalTokens={collaborationState.totalTokens}
                finalResponse={collaborationState.finalResponse}
              />
            )}

            {/* Collaboration Display */}
            <CollaborationDisplay 
              exchanges={collaborationState.exchanges}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>AI Collaboration Platform - Watch multiple AI models work together to improve responses</p>
            <p className="mt-1">Powered by OpenAI, Google, Anthropic, and xAI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 