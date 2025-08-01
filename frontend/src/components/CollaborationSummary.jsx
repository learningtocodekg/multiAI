import React from 'react';
import { BarChart3, Target, TrendingUp, Users } from 'lucide-react';

function CollaborationSummary({ summary, exchanges, totalTokens, finalResponse }) {
  if (!exchanges || exchanges.length === 0) {
    return null;
  }

  const averageConfidence = exchanges.reduce((sum, ex) => sum + (parseInt(ex.confidence_score) || 0), 0) / exchanges.length;
  const personalitiesUsed = exchanges.map(ex => ex.personality).filter(Boolean);
  const finalConfidence = exchanges[exchanges.length - 1]?.confidence_score || 0;
  const isComplete = exchanges[exchanges.length - 1]?.ready_status === 'READY';

  return (
    <div className="collaboration-summary bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
        Collaboration Summary
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-600">Final Confidence</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{finalConfidence}/10</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm text-gray-600">Personalities Used</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{personalitiesUsed.length}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm text-gray-600">Total Tokens</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{totalTokens?.toLocaleString() || 'N/A'}</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
            <span className="text-sm text-gray-600">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{averageConfidence.toFixed(1)}/10</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaboration Flow */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Collaboration Flow</h4>
          <div className="flex flex-wrap gap-2">
            {personalitiesUsed.map((personality, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
              >
                {personality.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status</h4>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isComplete 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {isComplete ? '✅ Complete' : '⏳ In Progress'}
          </div>
        </div>
      </div>
      
      {/* Summary Text */}
      {summary && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Collaboration Summary</h4>
          <div className="text-sm text-gray-600 leading-relaxed">
            {summary}
          </div>
        </div>
      )}

      {/* Final Response Preview */}
      {finalResponse && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Final Response Preview</h4>
          <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
            {finalResponse.length > 300 
              ? `${finalResponse.substring(0, 300)}...` 
              : finalResponse
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationSummary; 