'use client';

import React from "react"

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, MessageCircle } from 'lucide-react';

const NOVA_RESPONSES: Record<string, string[]> = {
  // Greeting & General
  'hello': ['Hi there! Ready to conquer your studies today? I\'m Nova, your AI study companion!', 'Hey! How can I help you with your learning journey today?', 'Welcome! Let\'s make today productive together.'],
  'hi': ['Hi! What can I help you with?', 'Hello! Ready to boost your productivity?', 'Greetings! What\'s on your mind?'],
  'help': ['I can help you with: task planning, time management, study strategies, motivation, focus tips, and much more! What do you need?', 'What specific area would you like help with?', 'I\'m here to assist with your academic journey!'],
  
  // Time Management
  'how much time': ['Based on your Consistency Score and past patterns, I recommend breaking this into focused 45-minute sessions.', 'Let\'s estimate: what\'s the complexity level - beginner, intermediate, or advanced?', 'I can help calculate the optimal study time based on your learning style!'],
  'prioritize': ['Focus on high-yield topics first, especially if your exam is within 48 hours. Activate Panic Mode if needed!', 'Start with foundational concepts, then move to applications and advanced topics.', 'What subjects are most important for your upcoming assessments?'],
  'schedule': ['I can help you create a personalized schedule. Tell me your deadlines and I\'ll build your Success Roadmap!', 'Let\'s sync with your calendar - when are your exams?', 'I\'ll adjust your schedule based on your peak energy hours!'],
  
  // Focus & Productivity
  'focus': ['Try a Ghost Mode Study Sprint - race against your previous best time! It\'s incredibly motivating.', 'Let\'s activate Focus-Fuel tracking: log your sleep, hydration, and caffeine for optimal focus insights.', 'Consider enabling Deep Work Shield to block distractions.'],
  'tired': ['Your sleep tracking shows you\'re less focused after less sleep. Get 7+ hours for 30% better focus!', 'Take a 15-minute break. Hydrate and breathe. You\'ve got this!', 'Let\'s shift to a lower-intensity task for now and return when refreshed.'],
  'distracted': ['Activate Deep Work Shield to block non-academic apps.', 'Take a body-doubling session in our Ghost Study Rooms - studying with peers helps!', 'Try a 5-minute breathing exercise before diving back in.'],
  'stress': ['If it feels overwhelming, Panic Mode can simplify your focus to just survival essentials.', 'Remember: you\'re building a Consistency Score, not a Perfection Streak. Progress > perfection!', 'Let me suggest a breathing exercise or shift you to a calming task.'],
  
  // Learning & Topics
  'explain': ['Which concept would you like me to break down? I can show it as text, audio, or visual mind map!', 'I can explain this in multiple formats - visual, audio, or written. Your choice!', 'Tell me which part you\'re struggling with and I\'ll explain it step-by-step.'],
  'difficult': ['Let me find top-rated tutorials and resources for you automatically!', 'Should we break this down into smaller, easier chunks?', 'I\'m pulling resources from our Smart Resource Aggregator - videos and docs coming your way!'],
  'easy': ['Great! You\'re in flow state. Moving you to advanced applications of this topic.', 'Excellent work! Let\'s skip basic reviews and jump to challenging scenarios.', 'You\'re crushing it! Ready for the next level?'],
  
  // Voice & Input
  'voice': ['I can take voice commands for schedule updates! Say something like "reschedule my exam to next Friday" and I\'ll reorganize your whole week!', 'Use voice-to-schedule for frictionless updates throughout your day.', 'Tell me what changed and I\'ll instantly reshuffle your priorities!'],
  
  // Features
  'panic mode': ['Panic Mode strips everything down to high-yield topics and active recall when exams are 48 hours away.', 'Activate this when you\'re in crisis mode - it\'s a lifesaver for last-minute prep!', 'This mode focuses exclusively on survival essentials and maximum ROI.'],
  'ghost mode': ['Ghost Mode Study Sprints let you race against your previous best times - turning assignments into games!', 'It\'s body-doubling but with your own ghost. Super motivating!', 'Want to try a Ghost Sprint? Pick a task and let\'s beat your record!'],
  'consistency': ['Your Consistency Score rewards how quickly you return to your plan after breaks - not perfection!', 'Check your Interactive Study Heatmap for a GitHub-style overview of your dedication.', 'This metric helps you see long-term progress, not daily perfection.'],
  'biometric': ['Your wearable data shows correlations between your physical state and focus - fascinating stuff!', 'We can see your stress levels and adjust tasks accordingly.', 'Connected devices help me suggest optimal study times based on your physiology.'],
  
  // Motivation
  'motivation': ['Remember: 1% daily progress compounds to 37x improvement yearly! You\'re on the right track.', 'Break your goal into tiny wins and celebrate each one.', 'Your Consistency Score shows real progress - you\'re building momentum!'],
  'struggling': ['What specific part is challenging? Let\'s tackle it together!', 'Sometimes we need to shift our approach. What learning style works best for you?', 'You\'ve overcome challenges before - this is just another step forward.'],
  
  // General Knowledge
  'default': ['That\'s interesting! Can you tell me more? I\'m always learning to help you better.', 'I understand! How can I support you with your studies?', 'Got it! What else would you like to know?', 'That\'s a great question! Is there anything specific about your studies I can help with?', 'I hear you! Let me know if you need help with your learning goals.'],
};

export default function NovaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hey! I\'m Nova, your AI study companion. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInput(transcript);
        };
        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const getNovaResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact or partial matches
    for (const [keyword, responses] of Object.entries(NOVA_RESPONSES)) {
      if (lowerMessage.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Return random default response
    return NOVA_RESPONSES.default[Math.floor(Math.random() * NOVA_RESPONSES.default.length)];
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate Nova thinking for a moment
    setTimeout(() => {
      const response = getNovaResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 300);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <>
      {/* Nova Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-primary/30 rounded-full blur-lg glow-accent group-hover:blur-xl transition-all duration-300"></div>
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
          <MessageCircle className="w-7 h-7" />
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden glow-accent z-40">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border/50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold">
                N
              </div>
              <div>
                <h3 className="font-bold text-foreground">Nova</h3>
                <p className="text-xs text-foreground/50">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-foreground/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground/70" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border border-accent/30 text-foreground rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-border/50 p-4 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nova anything..."
              className="flex-1 bg-background border border-border/50 rounded-lg px-3 py-2 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-card hover:bg-card/80 text-foreground'
              }`}
              title="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
