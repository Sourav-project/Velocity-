'use client';

import React from "react"

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface NovaChatProps {
  studyPeriodId: string;
}

export function NovaChat({ studyPeriodId }: NovaChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, setInput, sendMessage, isLoading, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {},
      body: {
        studyPeriodId,
      },
    }),
  });

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const suggestedPrompts = [
    'What should I focus on today?',
    'Help me prioritize my tasks',
    'I\'m feeling overwhelmed, what should I do?',
    'Explain spaced repetition to me',
  ];

  return (
    <Card className="flex flex-col h-full max-h-[600px]">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Nova - Your AI Study Assistant
        </CardTitle>
        <p className="text-xs text-gray-600 mt-1">Get personalized study guidance and overcome planner guilt</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="space-y-4 text-center py-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hi! I'm Nova</h3>
                <p className="text-sm text-gray-600 mb-4">I'm here to help you create an adaptive, stress-free study plan.</p>
              </div>

              <div className="space-y-2 pt-4">
                <p className="text-xs font-semibold text-gray-600 uppercase">Try asking:</p>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                      inputRef.current?.focus();
                    }}
                    className="w-full text-left text-sm p-2 rounded-lg hover:bg-purple-50 border border-purple-100 text-gray-700 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => {
                const isAssistant = message.role === 'assistant';
                const text = message.parts
                  ?.filter((p: any) => p.type === 'text')
                  .map((p: any) => p.text)
                  .join('') || '';

                return (
                  <div key={i} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isAssistant
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{text}</p>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-purple-100 text-purple-900 px-4 py-2 rounded-lg">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your study plan..."
              disabled={isLoading || status === 'streaming'}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || status === 'streaming'}
              className="bg-purple-600 hover:bg-purple-700"
              size="icon"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          {status === 'error' && (
            <p className="text-xs text-red-600 mt-2">Failed to send message. Please try again.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
