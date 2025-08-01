import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for long AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export const collaborationAPI = {
  // Start a new collaboration session
  startCollaboration: async (userPrompt, models) => {
    const response = await apiClient.post('/api/collaborate', {
      userPrompt,
      models,
    });
    return response.data;
  },

  // Get supported models
  getSupportedModels: async () => {
    const response = await apiClient.get('/api/models');
    return response.data;
  },

  // Get collaboration status
  getCollaborationStatus: async (sessionId) => {
    const response = await apiClient.get(`/api/collaboration/${sessionId}`);
    return response.data;
  },

  // Stream collaboration updates
  streamCollaboration: (sessionId, onMessage, onError, onComplete) => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/collaboration/${sessionId}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        onError(error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      onError(error);
      eventSource.close();
    };

    eventSource.addEventListener('complete', () => {
      onComplete();
      eventSource.close();
    });

    return eventSource;
  },
};

export default apiClient; 