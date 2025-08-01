import React from 'react';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

function TokenTracker({ sessionTokens, responseTokens, exchangeCount }) {
  const sessionProgress = (sessionTokens / 1000000) * 100;
  const exchangeProgress = (exchangeCount / 6) * 100;
  
  const getSessionStatus = () => {
    if (sessionProgress >= 90) return { color: 'text-red-600', icon: AlertTriangle, status: 'Critical' };
    if (sessionProgress >= 75) return { color: 'text-orange-600', icon: AlertTriangle, status: 'Warning' };
    return { color: 'text-green-600', icon: CheckCircle, status: 'Good' };
  };

  const sessionStatus = getSessionStatus();
  const StatusIcon = sessionStatus.icon;

  return (
    <div className="token-tracker bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-blue-500" />
        Usage Statistics
      </h3>
      
      <div className="space-y-4">
        {/* Session Tokens */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Session Tokens</span>
            <span className="font-medium">{sessionTokens.toLocaleString()} / 1,000,000</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                sessionProgress >= 90 ? 'bg-red-500' :
                sessionProgress >= 75 ? 'bg-orange-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(sessionProgress, 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center mt-1">
            <StatusIcon className={`w-4 h-4 mr-1 ${sessionStatus.color}`} />
            <span className={`text-xs ${sessionStatus.color}`}>
              {sessionStatus.status} - {Math.round(sessionProgress)}% used
            </span>
          </div>
        </div>
        
        {/* AI Exchanges */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">AI Exchanges</span>
            <span className="font-medium">{exchangeCount} / 6</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${exchangeProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Average Tokens per Response */}
        {responseTokens.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Average Tokens per Response</div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.round(responseTokens.reduce((a, b) => a + b, 0) / responseTokens.length).toLocaleString()}
            </div>
          </div>
        )}

        {/* Remaining Tokens */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Remaining Tokens</div>
          <div className="text-lg font-semibold text-blue-900">
            {(1000000 - sessionTokens).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenTracker; 