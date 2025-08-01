const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing AI Collaboration Platform API...\n');

  try {
    // Test 1: Get supported models
    console.log('1. Testing GET /api/models...');
    const modelsResponse = await axios.get(`${API_BASE_URL}/api/models`);
    console.log('✅ Models endpoint working');
    console.log('Available models:', Object.keys(modelsResponse.data.models));
    console.log('');

    // Test 2: Health check
    console.log('2. Testing GET /health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health endpoint working');
    console.log('Status:', healthResponse.data.status);
    console.log('');

    // Test 3: Start collaboration (this will fail without API keys, but tests the endpoint)
    console.log('3. Testing POST /api/collaborate with two AI models...');
    const testPrompt = "Write a short essay about the benefits of AI collaboration";
    const testModels = {
      improver: { provider: 'openai', model: 'gpt-4o-mini' },
      generator: { provider: 'openai', model: 'gpt-4o-mini' },
      reviewer: { provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' }
    };

    try {
      const collaborationResponse = await axios.post(`${API_BASE_URL}/api/collaborate`, {
        userPrompt: testPrompt,
        models: testModels
      });
      console.log('✅ Collaboration endpoint working');
      console.log('Session ID:', collaborationResponse.data.sessionId);
      console.log('Exchanges:', collaborationResponse.data.exchanges.length);
      console.log('AI Model 1:', collaborationResponse.data.aiModel1);
      console.log('AI Model 2:', collaborationResponse.data.aiModel2);
      
      // Show exchange details
      if (collaborationResponse.data.exchanges.length > 0) {
        console.log('\n📝 Collaboration Flow:');
        collaborationResponse.data.exchanges.forEach((exchange, index) => {
          console.log(`Exchange ${index + 1}: ${exchange.model} - ${exchange.personality}`);
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('⚠️  Collaboration endpoint working (expected error due to missing API keys)');
        console.log('Error:', error.response.data.error);
      } else {
        console.log('❌ Collaboration endpoint error:', error.message);
      }
    }

    console.log('\n🎉 API tests completed!');
    console.log('\n📋 To run the full application:');
    console.log('1. Add your API keys to .env file');
    console.log('2. Run: npm run dev');
    console.log('3. Open: http://localhost:3000');
    console.log('\n🔄 New Collaboration System:');
    console.log('• Two separate AI models collaborate');
    console.log('• Each model uses different personalities');
    console.log('• Models review each other\'s work');
    console.log('• No personality is used more than once by any model');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running:');
    console.log('cd backend && npm run dev');
  }
}

// Run the test
testAPI(); 