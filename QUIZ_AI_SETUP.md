# Career Assessment Quiz with AI Integration

## Overview
This is a comprehensive career assessment quiz that uses AI (Groq) to provide personalized career guidance and interactive chat functionality.

## Features

### 🎯 Interactive MCQ Quiz
- 8 carefully crafted career-related questions
- Smooth animations and transitions
- Progress tracking
- Modern, responsive UI with glassmorphism design

### 🤖 AI-Powered Analysis
- Detailed career analysis based on quiz responses
- Personalized career recommendations
- Strengths and development areas identification
- Actionable next steps

### 💬 Interactive AI Chat
- Full-screen chat popup with blur background
- Context-aware responses based on quiz results
- Real-time conversation with career counselor AI
- Typing indicators and smooth animations

## Setup Instructions

### 1. Install Dependencies
The required dependencies should already be installed, but if needed:
```bash
npm install groq-sdk
```

### 2. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Generate a new API key

### 3. Environment Configuration
Create a `.env.local` file in your project root:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 4. Run the Application
```bash
npm run dev
```

Navigate to `/QuizAi` to access the career assessment quiz.

## How It Works

### Quiz Flow
1. **Start Screen**: Users see an introduction with quiz overview and benefits
2. **Assessment**: Users answer 8 multiple-choice questions about work preferences, communication style, motivation, etc.
3. **Completion**: Quiz completion screen with option to get AI feedback
4. **AI Analysis**: Responses are sent to Groq API for comprehensive career analysis
5. **Results**: Users receive detailed career insights and recommendations
6. **Chat**: Users can continue the conversation with AI for deeper guidance

### AI Integration
- **Model**: Uses Llama-3.1-8b-instant for fast, accurate responses
- **Fallback**: Includes fallback responses if API is unavailable
- **Context**: Chat maintains context from quiz responses for relevant advice

### UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Animations**: Smooth transitions using Framer Motion
- **Glassmorphism**: Modern glass-like UI elements
- **Accessibility**: Proper focus states and keyboard navigation

## File Structure
```
src/app/QuizAi/
├── page.js                     # Main quiz component
└── api/
    ├── quiz-analysis/
    │   └── route.js            # AI analysis endpoint
    └── chat/
        └── route.js            # AI chat endpoint
```

## Customization

### Adding Questions
Edit the `questions` array in `src/app/QuizAi/page.js`:
```javascript
const questions = [
  {
    id: 9,
    question: "Your new question here?",
    options: [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4"
    ]
  }
];
```

### Modifying AI Prompts
Update the prompts in the API routes:
- Quiz analysis: `src/app/api/quiz-analysis/route.js`
- Chat responses: `src/app/api/chat/route.js`

### Styling
The component uses Tailwind CSS with custom gradients and animations. Modify classes in the JSX for different styling.

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure your Groq API key is correctly set in `.env.local`
2. **Build Errors**: Make sure all dependencies are installed
3. **Styling Issues**: Verify Tailwind CSS is properly configured

### Fallback Behavior
If the Groq API is unavailable, the application provides:
- Generic but helpful career analysis
- Context-aware fallback chat responses
- Graceful error handling

## Security Notes
- API key is server-side only (not exposed to client)
- Input validation on all API endpoints
- Rate limiting should be implemented for production use

## Future Enhancements
- User authentication and result saving
- More detailed career path information
- Integration with job boards
- PDF report generation
- Multi-language support

## Support
For issues or questions, check the console for error messages and ensure your Groq API key is valid and has sufficient credits.

