# AI Collaboration Platform - not fully tested.

A web application where two different AI models collaborate to improve responses through iterative refinement with dynamic personalities. Watch as distinct AI models work together, each using different personality modes to review and improve each other's work.

## Features

- **True Multi-Model Collaboration**: Two separate AI models work together (AI Model 1 and AI Model 2)
- **Cross-Model Review**: Each AI model reviews the other's work, not its own
- **Dynamic Personalities**: Each AI cycles through different personas without repetition
- **Real-time Streaming**: Watch the AI collaboration unfold in real-time
- **Token Management**: Tracks usage with limits (1M tokens per session, 30K per response)
- **Confidence Scoring**: Each AI response includes a confidence rating
- **Rich Markup Support**: Handles various AI response formats (Markdown, HTML, etc.)
- **Multi-Provider Support**: OpenAI, Google, Anthropic, and xAI models

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- API keys for desired AI providers

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-collaboration-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env and add your API keys
   nano .env
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Supported Models

### OpenAI
- GPT-4.1, GPT-4.1-nano, GPT-4o, GPT-4o-mini, GPT-4-turbo

### Google
- Gemini-2.5-pro, Gemini-2.5-flash, Gemini-2.0-pro, Gemini-pro

### Anthropic
- Claude-4-sonnet, Claude-3.7-sonnet, Claude-3.5-sonnet, Claude-3-haiku, Claude-3-opus

### xAI
- Grok-4, Grok-3, Grok-beta

## How It Works

1. **Prompt Improvement**: First AI enhances your original prompt
2. **Initial Generation**: AI Model 1 creates comprehensive first draft
3. **Cross-Model Collaboration**: AI Model 2 reviews AI Model 1's work, then they alternate:
   - AI Model 2 reviews AI Model 1's work with different personalities
   - AI Model 1 reviews AI Model 2's work with different personalities
   - Each model uses unique personalities that haven't been used before
   - Available personalities:
     - Critical Reviewer
     - Humanizer
     - Creativity Enhancer
     - Readability Optimizer
     - Redundancy Checker
     - Accuracy Validator
     - Completeness Auditor
     - Tone Refiner
     - Final Polish

## Collaboration Flow

```
User Prompt → Prompt Improver → AI Model 1 (Initial Draft)
                                    ↓
                              AI Model 2 (Review Draft 1)
                                    ↓
                              AI Model 1 (Review Draft 2)
                                    ↓
                              AI Model 2 (Review Draft 3)
                                    ↓
                              ... (continues until ready)
```

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_API_KEY`: Your Google AI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `XAI_API_KEY`: Your xAI API key
- `MAX_SESSION_TOKENS`: Maximum tokens per session (default: 1,000,000)
- `MAX_RESPONSE_TOKENS`: Maximum tokens per AI response (default: 30,000)
- `MAX_AI_EXCHANGES`: Maximum AI exchanges per collaboration (default: 6)

### Development vs Production
- Development: Uses `NODE_ENV=development` with detailed logging
- Production: Set `NODE_ENV=production` for optimized performance

## API Documentation

### POST /api/collaborate
Starts a new AI collaboration session with two models.

**Request:**
```json
{
  "userPrompt": "Your question or task",
  "models": {
    "improver": { "provider": "openai", "model": "gpt-4o-mini" },
    "generator": { "provider": "openai", "model": "gpt-4o-mini" },
    "reviewer": { "provider": "anthropic", "model": "claude-3-5-sonnet-20241022" }
  }
}
```

**Response:**
```json
{
  "sessionId": "unique-session-id",
  "exchanges": [...],
  "summary": "Collaboration summary",
  "totalTokens": 15000,
  "finalResponse": "Final improved response",
  "aiModel1": { "provider": "openai", "model": "gpt-4o-mini" },
  "aiModel2": { "provider": "anthropic", "model": "claude-3-5-sonnet-20241022" }
}
```

### GET /api/collaboration/:sessionId/stream
Server-sent events endpoint for real-time collaboration updates.

## Architecture

### Frontend (React + Tailwind CSS)
- Modern, responsive interface
- Real-time collaboration display showing which AI model is working
- Rich markup rendering
- Token and confidence tracking
- Model selection for two separate AI models

### Backend (Node.js + Express)
- RESTful API
- Multi-provider AI integration
- Environment-based configuration
- Structured response parsing
- Personality tracking per AI model

## Key Differences from Previous Version

- **Two Separate AI Models**: Instead of one AI with different personalities, two distinct AI models collaborate
- **Cross-Model Review**: Each AI reviews the other's work, creating genuine collaboration
- **Personality Tracking**: Each model tracks which personalities it has used to avoid repetition
- **Enhanced Prompts**: Prompts are designed to make each AI think it's reviewing another AI's work
- **Model Selection**: Users can select different models for generator and reviewer roles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

**API Key Errors**
- Ensure all required API keys are set in `.env`
- Verify API keys are valid and have sufficient credits

**Token Limit Exceeded**
- Check your session token usage in the UI
- Consider using smaller models for testing

**Model Not Available**
- Verify the model name matches supported models
- Check if you have access to the specific model

**Collaboration Issues**
- Ensure both generator and reviewer models are selected
- Check that API keys are available for both selected providers

