import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

function PromptInput({ onSubmit, isLoading, disabled }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
        Enter Your Prompt
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            What would you like the AI collaboration to help you with?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your task, question, or request. The AI models will work together to provide the best possible response..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isLoading || disabled}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {prompt.length} characters
          </div>
          
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading || disabled}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
              !prompt.trim() || isLoading || disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Collaborating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Start Collaboration
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Be specific about what you want to achieve</li>
          <li>• Include context and background information</li>
          <li>• Mention your target audience or use case</li>
          <li>• Specify the desired tone or style</li>
        </ul>
      </div>
    </div>
  );
}

export default PromptInput; 