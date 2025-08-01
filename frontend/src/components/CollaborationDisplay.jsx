import React from 'react';
import { processAIMarkup } from '../utils/markupParser';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users } from 'lucide-react';

function CollaborationDisplay({ exchanges }) {
  if (!exchanges || exchanges.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No collaboration exchanges yet. Start a collaboration to see AI models work together!</p>
      </div>
    );
  }

  return (
    <div className="collaboration-feed space-y-4 max-w-4xl mx-auto">
      {exchanges.map((exchange, index) => (
        <div key={index} className="exchange-card bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 animate-fade-in">
          <div className="personality-header flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="personality-badge px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {exchange.personality?.replace('_', ' ') || 'AI Assistant'}
              </span>
              {exchange.model && (
                <span className="model-badge px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {exchange.model}
                </span>
              )}
            </div>
            <span className="confidence-score text-lg font-semibold text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              Confidence: {exchange.confidence_score || 'N/A'}/10
            </span>
          </div>
          
          {exchange.personality_focus && (
            <div className="focus-area mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <strong className="text-yellow-800">Focus:</strong> 
              <div 
                className="mt-1 text-yellow-700"
                dangerouslySetInnerHTML={{ __html: processAIMarkup(exchange.personality_focus) }}
              />
            </div>
          )}
          
          <div className="response-content mb-4 p-4 bg-gray-50 rounded-lg border">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: processAIMarkup(exchange.revised_response || exchange.response) 
              }}
            />
          </div>
          
          {exchange.changes_made && (
            <div className="changes-made mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <strong className="text-green-800">Changes Made:</strong> 
              <div 
                className="mt-1 text-green-700"
                dangerouslySetInnerHTML={{ __html: processAIMarkup(exchange.changes_made) }}
              />
            </div>
          )}
          
          {exchange.analysis && (
            <div className="analysis mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <strong className="text-purple-800">Analysis:</strong> 
              <div 
                className="mt-1 text-purple-700"
                dangerouslySetInnerHTML={{ __html: processAIMarkup(exchange.analysis) }}
              />
            </div>
          )}
          
          <div className="thoughts text-gray-600 text-sm mb-3">
            <strong>AI Thoughts:</strong> 
            <div 
              className="mt-1"
              dangerouslySetInnerHTML={{ __html: processAIMarkup(exchange.thoughts) }}
            />
          </div>
          
          {exchange.collaboration_note && (
            <div className="collaboration-note p-3 bg-blue-50 rounded-lg border border-blue-200">
              <strong className="text-blue-800">Next Focus:</strong> 
              <div 
                className="mt-1 text-blue-700"
                dangerouslySetInnerHTML={{ __html: processAIMarkup(exchange.collaboration_note) }}
              />
            </div>
          )}
          
          <div className="exchange-footer mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span>Exchange #{index + 1}</span>
            <span className={`px-2 py-1 rounded flex items-center ${
              exchange.ready_status === 'READY' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {exchange.ready_status === 'READY' ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {exchange.ready_status || 'Processing'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CollaborationDisplay; 