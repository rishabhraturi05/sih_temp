import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages, context } = await request.json();

    // Build context from quiz answers if available
    let contextPrompt = '';
    if (context && context.answers && context.questions) {
      const quizData = context.questions.map(question => ({
        question: question.question,
        answer: context.answers[question.id] || 'Not answered'
      }));

      contextPrompt = `
Context: The user has completed a career assessment quiz with the following responses:
${quizData.map((item, index) => `${index + 1}. ${item.question}\nAnswer: ${item.answer}`).join('\n\n')}

Based on this context, please provide relevant career guidance and answer their questions.
`;
    }

    // Prepare messages for Groq API
    const systemMessage = {
      role: 'system',
      content: `You are a professional career counselor and mentor with extensive experience in career guidance, job market trends, and professional development. You provide personalized, actionable advice to help people make informed career decisions.

${contextPrompt}

Guidelines for responses:
- Be encouraging and supportive while being realistic
- Provide specific, actionable advice
- Ask follow-up questions when appropriate to better understand their needs
- Share relevant industry insights and trends
- Help them identify concrete next steps
- Keep responses conversational but professional
- If they ask about specific companies or roles, provide helpful insights
- Focus on their growth and development`
    };

    const apiMessages = [systemMessage, ...messages];

    // Make request to Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: apiMessages,
        max_tokens: 800,
        temperature: 0.8,
        stream: false,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const response = groqData.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Could you please rephrase your question?';

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);

    // Fallback responses based on common career questions
    const userMessage = request.body?.messages?.slice(-1)[0]?.content?.toLowerCase() || '';

    let fallbackResponse = "I'm here to help with your career questions! ";

    if (userMessage.includes('salary') || userMessage.includes('pay')) {
      fallbackResponse += "Salary ranges vary significantly by location, experience, and industry. I'd recommend checking sites like Glassdoor, PayScale, or LinkedIn Salary Insights for current market data in your area.";
    } else if (userMessage.includes('skill') || userMessage.includes('learn')) {
      fallbackResponse += "Developing new skills is always a great investment! Consider online platforms like Coursera, LinkedIn Learning, or Udemy for professional development courses relevant to your career goals.";
    } else if (userMessage.includes('interview')) {
      fallbackResponse += "Interview preparation is key to success! Practice common questions, research the company thoroughly, prepare specific examples of your achievements, and don't forget to prepare thoughtful questions to ask them.";
    } else if (userMessage.includes('resume') || userMessage.includes('cv')) {
      fallbackResponse += "A strong resume should highlight your achievements with specific metrics, use relevant keywords from job descriptions, and be tailored to each position you apply for.";
    } else {
      fallbackResponse += "I'm experiencing some technical difficulties right now, but I'm still here to help! Could you please rephrase your question, and I'll do my best to provide helpful career guidance.";
    }

    return NextResponse.json({ response: fallbackResponse });
  }
}

