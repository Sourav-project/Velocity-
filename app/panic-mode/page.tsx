'use client';

import { AlertCircle, Zap, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PanicModePage() {
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Panic Mode
          </h1>
          <p className="text-foreground/60">Last-minute study boost for urgent deadlines</p>
        </div>

        {!isPanicActive ? (
          <>
            <div className="card-constant-glow rounded-2xl p-8 border-accent/30">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Activate Panic Mode</h2>
                  <p className="text-foreground/70">When you're running out of time, Panic Mode redistributes your remaining time optimally across all tasks and creates an emergency study plan.</p>
                </div>
              </div>

              <div className="bg-background/50 rounded-lg p-6 border border-border/50 mb-6">
                <p className="text-sm text-foreground/60 mb-4">
                  <strong>How it works:</strong> Based on your exam/deadline and current progress, Nova will:
                </p>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Prioritize critical concepts you haven't covered</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Create ultra-focused 15-minute power sessions</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Generate high-yield summaries and cheat sheets</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>Break down complex topics into digestible chunks</span>
                  </li>
                </ul>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground hover:shadow-lg glow-accent text-lg py-6 font-semibold"
                onClick={() => setIsPanicActive(true)}
              >
                <Zap className="w-5 h-5 mr-2" />
                Activate Panic Mode
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-constant-glow rounded-xl p-6">
                <TrendingDown className="w-5 h-5 text-secondary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Aggressive Prioritization</h3>
                <p className="text-sm text-foreground/60">Only studies what you absolutely need to know for maximum exam impact</p>
              </div>
              <div className="card-constant-glow rounded-xl p-6">
                <Zap className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Maximum Efficiency</h3>
                <p className="text-sm text-foreground/60">Every minute counts - no time wasted on review or topics you've mastered</p>
              </div>
            </div>
          </>
        ) : (
          <div className="card-constant-glow rounded-2xl p-8 border-accent animate-pulse-glow">
            <div className="text-center space-y-6">
              <div className="inline-block">
                <Zap className="w-12 h-12 text-accent animate-bounce" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Panic Mode Active</h2>
              <div className="text-6xl font-bold gradient-text">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>
              <p className="text-lg text-foreground/70">Study plan created. Nova is monitoring your progress...</p>

              <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                <h3 className="font-semibold text-foreground mb-4">Emergency Study Plan</h3>
                <div className="space-y-3">
                  {[
                    { topic: 'Photosynthesis (Critical)', duration: '25 min', priority: 'URGENT' },
                    { topic: 'Cell Respiration (Review)', duration: '15 min', priority: 'HIGH' },
                    { topic: 'Mitosis/Meiosis (Summary)', duration: '10 min', priority: 'MEDIUM' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded border border-border/50">
                      <div>
                        <p className="font-semibold text-foreground">{item.topic}</p>
                        <p className="text-xs text-foreground/60">{item.duration}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        item.priority === 'URGENT' ? 'bg-accent text-accent-foreground' :
                        item.priority === 'HIGH' ? 'bg-secondary text-secondary-foreground' :
                        'bg-primary/30 text-primary'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="border-border/50 text-foreground hover:bg-card/50 bg-transparent"
                onClick={() => setIsPanicActive(false)}
              >
                Exit Panic Mode
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
