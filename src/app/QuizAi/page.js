'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizAI = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What type of work environment do you prefer?",
      options: [
        "Collaborative team environment",
        "Independent work with minimal supervision",
        "Fast-paced, dynamic environment",
        "Structured, organized environment"
      ]
    },
    {
      id: 2,
      question: "Which of these activities interests you most?",
      options: [
        "Solving complex problems and puzzles",
        "Creating and designing new things",
        "Helping and supporting others",
        "Leading and managing projects"
      ]
    },
    {
      id: 3,
      question: "What motivates you most in your career?",
      options: [
        "Financial stability and growth",
        "Making a positive impact on society",
        "Personal recognition and achievement",
        "Continuous learning and development"
      ]
    },
    {
      id: 4,
      question: "How do you prefer to communicate?",
      options: [
        "Written communication (emails, reports)",
        "Face-to-face conversations",
        "Presentations to groups",
        "Visual communication (charts, diagrams)"
      ]
    },
    {
      id: 5,
      question: "What's your approach to challenges?",
      options: [
        "Analyze thoroughly before acting",
        "Take immediate action and adapt",
        "Seek advice from others first",
        "Break it down into smaller steps"
      ]
    },
    {
      id: 6,
      question: "Which work schedule appeals to you?",
      options: [
        "Traditional 9-5 office hours",
        "Flexible hours with remote options",
        "Project-based with varying schedules",
        "Shift work with clear boundaries"
      ]
    },
    {
      id: 7,
      question: "What type of skills do you want to develop?",
      options: [
        "Technical and analytical skills",
        "Creative and artistic skills",
        "Leadership and management skills",
        "Communication and interpersonal skills"
      ]
    },
    {
      id: 8,
      question: "How important is work-life balance to you?",
      options: [
        "Extremely important - I prioritize personal time",
        "Important but willing to work extra when needed",
        "Somewhat important - career comes first",
        "Not very important - I'm career-focused"
      ]
    }
  ];

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleGetAIFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, questions }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.analysis);
        setShowResults(true);
        setChatMessages([
          {
            role: 'assistant',
            content: data.analysis
          }
        ]);
      } else {
        throw new Error('Failed to get AI analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setAiResponse('Sorry, there was an error analyzing your responses. Please try again.');
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...chatMessages, userMessage],
          context: { answers, questions }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error('Failed to get chat response');
      }
    } catch (error) {
      console.error('Error:', error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setAiResponse('');
    setShowChat(false);
    setChatMessages([]);
    setChatInput('');
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            🎯 Career Assessment Quiz
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Discover your ideal career path with AI-powered insights and personalized guidance
          </p>
        </motion.div>

        {/* Start Quiz Screen */}
        {!quizStarted && !quizCompleted && !showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-brain text-white text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Discover Your Career Path?</h2>
              <p className="text-slate-300 text-lg mb-6">
                Take our comprehensive 8-question assessment to get personalized career recommendations powered by AI.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <i className="fas fa-clock text-[#F39C12] text-xl mb-2"></i>
                  <p className="text-white font-semibold">5 Minutes</p>
                  <p className="text-slate-300">Quick Assessment</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <i className="fas fa-robot text-[#F39C12] text-xl mb-2"></i>
                  <p className="text-white font-semibold">AI Powered</p>
                  <p className="text-slate-300">Smart Analysis</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4">
                  <i className="fas fa-comments text-[#F39C12] text-xl mb-2"></i>
                  <p className="text-white font-semibold">Interactive Chat</p>
                  <p className="text-slate-300">Continue Discussion</p>
                </div>
              </div>
            </div>
            <button
              onClick={startQuiz}
              className="bg-[#F39C12] hover:bg-[#d7890f] text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Assessment
            </button>
          </motion.div>
        )}

        {/* Quiz Questions */}
        {quizStarted && !quizCompleted && !showResults && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div
                  className="bg-[#F39C12] h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, option)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                      answers[questions[currentQuestion].id] === option
                        ? 'border-[#F39C12] bg-[#F39C12]/20 text-white'
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-600/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-4 ${
                        answers[questions[currentQuestion].id] === option
                          ? 'border-[#F39C12] bg-[#F39C12]'
                          : 'border-slate-500'
                      }`}>
                        {answers[questions[currentQuestion].id] === option && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                        )}
                      </div>
                      {option}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={!answers[questions[currentQuestion].id]}
                className="px-6 py-3 bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                {currentQuestion === questions.length - 1 ? 'Complete Quiz' : 'Next'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Quiz Completed Screen */}
        {quizCompleted && !showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-check text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h2>
              <p className="text-slate-300 text-lg mb-6">
                Great job! You&apos;ve answered all {questions.length} questions. Now let our AI analyze your responses to provide personalized career insights.
              </p>
            </div>
            <button
              onClick={handleGetAIFeedback}
              disabled={loading}
              className="bg-[#F39C12] hover:bg-[#d7890f] text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-robot mr-2"></i>
                  Get AI Feedback
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* AI Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-[#F39C12] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-chart-line text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">Your Career Analysis</h2>
              <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-line text-left bg-slate-700/30 rounded-xl p-6">
                {aiResponse}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowChat(true)}
                className="px-6 py-3 bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <i className="fas fa-comments mr-2"></i>
                Continue Chat with AI
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
              >
                <i className="fas fa-redo mr-2"></i>
                Retake Quiz
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Chat Popup */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowChat(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-slate-800/90 backdrop-blur-lg rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl border border-slate-700"
              >
                {/* Chat Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-600">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#F39C12] rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Career Counselor AI</h3>
                  </div>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-slate-400 hover:text-white text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700 transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-[#F39C12] text-white'
                            : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    </motion.div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-slate-100 p-4 rounded-2xl">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-[#F39C12] rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#F39C12] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-[#F39C12] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="p-6 border-t border-slate-600">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about your career path..."
                      className="flex-1 p-3 bg-slate-700 text-white rounded-xl border border-slate-600 focus:border-[#F39C12] focus:outline-none placeholder-slate-400"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      className="px-6 py-3 bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizAI;
