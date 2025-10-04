import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { answers, questions } = await request.json();

    // Format the quiz data for AI analysis
    const quizData = questions.map(question => ({
      question: question.question,
      answer: answers[question.id] || 'Not answered'
    }));

    const prompt = `
You are a professional career counselor with expertise in career assessment and guidance. 
Analyze the following career assessment quiz responses and provide comprehensive career insights.

Quiz Responses:
${quizData.map((item, index) => `${index + 1}. ${item.question}\nAnswer: ${item.answer}`).join('\n\n')}

Please provide a detailed career analysis that includes:

1. **Personality Profile**: Based on their responses, describe their work style, preferences, and personality traits.

2. **Recommended Career Paths**: Suggest 3-5 specific career fields or roles that align with their responses, with brief explanations for each.

3. **Key Strengths**: Identify their main strengths based on their preferences and answers.

4. **Areas for Development**: Suggest skills or areas they might want to focus on developing.

5. **Work Environment Fit**: Describe the ideal work environment and culture for them.

6. **Next Steps**: Provide 3-4 actionable next steps they can take to explore or advance in their recommended career paths.

Please make the analysis personal, encouraging, and actionable. Use a warm, professional tone that motivates them to take action on their career journey.
`;

    // Make request to Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a professional career counselor with years of experience in career guidance and assessment. Provide thoughtful, personalized career advice based on quiz responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status}`);
    }

    const groqData = await groqResponse.json();
    const analysis = groqData.choices[0]?.message?.content || 'Unable to generate analysis at this time.';

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error('Quiz analysis error:', error);
    
    // Fallback response if API fails
    const fallbackAnalysis = `
**Career Analysis Results**

Thank you for completing the career assessment! Based on your responses, here's a personalized analysis:

**Your Work Style Profile:**
Your responses indicate a balanced approach to work with clear preferences for how you like to operate professionally.

**Recommended Career Paths:**
• Technology & Innovation - Consider roles in software development, data analysis, or digital marketing
• Business & Management - Explore opportunities in project management, consulting, or operations
• Creative & Design - Look into roles in content creation, UX/UI design, or marketing communications
• Healthcare & Education - Consider positions in training, counseling, or healthcare administration

**Key Strengths:**
• Strong problem-solving abilities
• Good communication skills
• Adaptability to different work environments
• Goal-oriented mindset

**Next Steps:**
1. Research the recommended career paths in more detail
2. Consider informational interviews with professionals in these fields
3. Identify relevant skills to develop through courses or certifications
4. Network with professionals in your areas of interest

I'm here to help you explore these recommendations further. Feel free to ask me any questions about specific career paths, skill development, or next steps!
`;

    return NextResponse.json({ analysis: fallbackAnalysis });
  }
}

