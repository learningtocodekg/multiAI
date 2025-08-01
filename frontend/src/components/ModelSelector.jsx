import React, { useState, useEffect } from 'react';
import { ChevronDown, Bot, Zap, Users } from 'lucide-react';
import { collaborationAPI } from '../utils/apiClient';

const MODEL_OPTIONS = {
  openai: [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ],
  google: [
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-pro'
  ],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229'
  ],
  xai: [
    'grok-beta',
    'grok-2',
    'grok-1'
  ]
};

const PROVIDER_NAMES = {
  openai: 'OpenAI',
  google: 'Google',
  anthropic: 'Anthropic',
  xai: 'xAI'
};

function ModelSelector({ onModelsChange, selectedModels }) {
  const [availableModels, setAvailableModels] = useState(MODEL_OPTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchAvailableModels = async () => {
    setLoading(true);
    try {
      const response = await collaborationAPI.getSupportedModels();
      if (response.models) {
        setAvailableModels(response.models);
      }
    } catch (error) {
      console.error('Failed to fetch models:', error);
      // Fallback to default models
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (role, provider, model) => {
    onModelsChange({
      ...selectedModels,
      [role]: { provider, model }
    });
  };

  const renderProviderOption = (provider, models, role) => (
    <div key={provider} className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Bot className="w-4 h-4 mr-2" />
        {PROVIDER_NAMES[provider]}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {models.map((model) => (
          <button
            key={model}
            onClick={() => handleModelChange(role, provider, model)}
            className={`p-2 text-xs rounded border transition-colors ${
              selectedModels[role]?.provider === provider && 
              selectedModels[role]?.model === model
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            {model}
          </button>
        ))}
      </div>
    </div>
  );

  const renderModelOptions = (role, title, colorClass) => (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(availableModels).map(([provider, models]) =>
          models.map((model) => (
            <button
              key={`${provider}-${model}`}
              onClick={() => handleModelChange(role, provider, model)}
              className={`p-2 text-xs rounded border transition-colors ${
                selectedModels[role]?.provider === provider && 
                selectedModels[role]?.model === model
                  ? colorClass
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {PROVIDER_NAMES[provider]}: {model}
            </button>
          ))
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Select AI Models for Collaboration
      </h2>
      
      <div className="space-y-6">
        {/* Prompt Improver */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Prompt Improver
          </h3>
          {Object.entries(availableModels).map(([provider, models]) =>
            renderProviderOption(provider, models, 'improver')
          )}
        </div>

        {/* AI Model 1 - Initial Generator */}
        <div>
          {renderModelOptions('generator', 'AI Model 1 (Initial Generator)', 'bg-green-100 border-green-300 text-green-700')}
        </div>

        {/* AI Model 2 - Reviewer */}
        <div>
          {renderModelOptions('reviewer', 'AI Model 2 (Reviewer)', 'bg-purple-100 border-purple-300 text-purple-700')}
        </div>

        {/* Current Selection Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Selection:</h4>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-600">Prompt Improver:</span>{' '}
              <span className="font-medium">
                {selectedModels.improver 
                  ? `${PROVIDER_NAMES[selectedModels.improver.provider]} - ${selectedModels.improver.model}`
                  : 'Not selected'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">AI Model 1 (Generator):</span>{' '}
              <span className="font-medium">
                {selectedModels.generator 
                  ? `${PROVIDER_NAMES[selectedModels.generator.provider]} - ${selectedModels.generator.model}`
                  : 'Not selected'
                }
              </span>
            </div>
            <div>
              <span className="text-gray-600">AI Model 2 (Reviewer):</span>{' '}
              <span className="font-medium">
                {selectedModels.reviewer 
                  ? `${PROVIDER_NAMES[selectedModels.reviewer.provider]} - ${selectedModels.reviewer.model}`
                  : 'Not selected'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Collaboration Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">How Collaboration Works:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• AI Model 1 creates the initial response</p>
            <p>• AI Model 2 reviews and improves Model 1's work</p>
            <p>• The models alternate, each using different personalities</p>
            <p>• No personality is used more than once by any model</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelSelector; 