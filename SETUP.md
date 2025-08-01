# AI Collaboration Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- API keys for desired AI providers

### Installation

#### Option 1: Automated Installation (Recommended)

**Windows:**
```bash
install.bat
```

**macOS/Linux:**
```bash
chmod +x install.sh
./install.sh
```

#### Option 2: Manual Installation

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend && npm install && cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend && npm install && cd ..
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```

### Configuration

1. **Edit the `.env` file** and add your API keys:
   ```env
   # API Keys for AI Providers
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   XAI_API_KEY=your_xai_api_key_here
   ```

2. **You only need the API keys for providers you plan to use.**

### Running the Application

1. **Start the development servers:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to `http://localhost:3000`

3. **Test the API (optional):**
   ```bash
   node demo.js
   ```

## 🔧 Development

### Project Structure
```
ai-collaboration-platform/
├── backend/                 # Node.js + Express server
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # API route handlers
│   │   ├── services/       # Business logic
│   │   │   ├── aiProviders/ # AI provider integrations
│   │   └── utils/          # Utility functions
│   └── package.json
├── frontend/               # React + Tailwind CSS
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── utils/          # Frontend utilities
│   │   └── App.jsx         # Main app component
│   └── package.json
├── .env.example           # Environment template
├── package.json           # Root package.json
└── README.md             # Project documentation
```

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only backend
- `npm run client` - Start only frontend
- `npm run install-all` - Install all dependencies

**Backend:**
- `cd backend && npm run dev` - Start backend with nodemon
- `cd backend && npm start` - Start backend in production mode

**Frontend:**
- `cd frontend && npm start` - Start React development server
- `cd frontend && npm run build` - Build for production

### API Endpoints

- `GET /health` - Health check
- `GET /api/models` - Get supported models
- `POST /api/collaborate` - Start AI collaboration
- `GET /api/collaboration/:sessionId` - Get collaboration status
- `GET /api/collaboration/:sessionId/stream` - Stream updates

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `MAX_SESSION_TOKENS` | Max tokens per session | `1000000` |
| `MAX_RESPONSE_TOKENS` | Max tokens per response | `30000` |
| `MAX_AI_EXCHANGES` | Max AI exchanges | `6` |

## 🐛 Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**2. API key errors**
- Ensure API keys are correctly set in `.env`
- Verify API keys have sufficient credits
- Check if you have access to the selected models

**3. Frontend not connecting to backend**
- Ensure backend is running on port 3001
- Check CORS settings in backend
- Verify proxy configuration in frontend

**4. Token limit exceeded**
- Use smaller models for testing
- Check token usage in the UI
- Consider reducing response length

### Debug Mode

**Backend debugging:**
```bash
cd backend && DEBUG=* npm run dev
```

**Frontend debugging:**
- Open browser developer tools
- Check console for errors
- Verify network requests

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### API Status
```bash
curl http://localhost:3001/api/models
```

### Logs
- Backend logs appear in the terminal running the server
- Frontend logs appear in browser console
- Check for error messages and warnings

## 🔒 Security

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage and costs

### Rate Limiting
- Backend includes rate limiting (100 requests per 15 minutes)
- Monitor usage to avoid hitting limits
- Consider implementing user authentication for production

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure proper CORS origins
3. Set up HTTPS
4. Use environment variables for all configuration
5. Implement proper logging and monitoring

### Frontend Deployment
1. Build the application: `cd frontend && npm run build`
2. Serve static files from a web server
3. Configure API endpoint URLs
4. Set up proper caching headers

### Environment Setup
```env
NODE_ENV=production
PORT=3001
# Add all required API keys
OPENAI_API_KEY=your_production_key
GOOGLE_API_KEY=your_production_key
ANTHROPIC_API_KEY=your_production_key
XAI_API_KEY=your_production_key
```

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google AI Documentation](https://ai.google.dev/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 