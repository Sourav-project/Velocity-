'use client';

import { useState } from 'react';
import { AlertTriangle, Clock, Zap, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PanicModePage() {
  const [isPanicModeActive, setIsPanicModeActive] = useState(false);
  const [hoursToExam, setHoursToExam] = useState(24);

  const activatePanicMode = () => {
    if (hoursToExam <= 48) {
      setIsPanicModeActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Panic Mode
          </h1>
          <p className="text-foreground/60">
            Emergency study mode for exams within 48 hours
          </p>
        </div>

        {/* Status Card */}
        <div className={`card-constant-glow rounded-2xl p-8 ${
          isPanicModeActive ? 'border-accent glow-accent' : ''
        }`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isPanicModeActive ? 'bg-accent/20' : 'bg-primary/20'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  isPanicModeActive ? 'text-accent animate-pulse' : 'text-primary'
                }`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {isPanicModeActive ? 'PANIC MODE ACTIVE' : 'Panic Mode Ready'}
                </h2>
                <p className="text-foreground/60 text-sm mt-1">
                  Focus on survival essentials only
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/60">Hours to Exam</p>
              <p className="text-3xl font-bold text-secondary">{hoursToExam}h</p>
            </div>
          </div>

          {!isPanicModeActive && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  How many hours until your exam?
                </label>
                <input
                  type="number"
                  value={hoursToExam}
                  onChange={(e) => setHoursToExam(parseInt(e.target.value) || 0)}
                  min="0"
                  max="168"
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {hoursToExam <= 48 && (
                <Button
                  onClick={activatePanicMode}
                  className="w-full bg-accent text-accent-foreground hover:shadow-lg transition-all duration-300 glow-accent"
                >
                  Activate Panic Mode
                </Button>
              )}
              {hoursToExam > 48 && (
                <p className="text-sm text-foreground/60 text-center py-2">
                  Panic Mode is available for exams within 48 hours
                </p>
              )}
            </div>
          )}
        </div>

        {isPanicModeActive && (
          <>
            {/* What Panic Mode Does */}
            <div className="card-constant-glow rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-accent" />
                What Panic Mode Does
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">Focus on High-Yield Topics</h4>
                  <p className="text-sm text-foreground/60">
                    Your schedule automatically filters to show only the most important 20% of material that will appear on the exam.
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">Active Recall Exercises</h4>
                  <p className="text-sm text-foreground/60">
                    Spaced repetition and active recall drills replace passive review for maximum retention in minimum time.
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">Eliminate Distractions</h4>
                  <p className="text-sm text-foreground/60">
                    Deep Work Shield activates automatically to block all non-essential apps and notifications.
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">Time Optimization</h4>
                  <p className="text-sm text-foreground/60">
                    AI recommends the optimal study schedule based on your circadian rhythm and energy patterns.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Study Plan */}
            <div className="card-constant-glow rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-secondary" />
                Your Emergency Study Plan
              </h3>
              <div className="space-y-3">
                {[
                  { time: 'Next 12 hours', task: 'Review all high-yield topics once' },
                  { time: 'Hours 12-24', task: 'Active recall and practice problems' },
                  { time: 'Final 24 hours', task: 'Quick review of weak areas' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="w-20 text-right flex-shrink-0">
                      <p className="font-bold text-secondary text-sm">{item.time}</p>
                    </div>
                    <div>
                      <p className="text-foreground">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card-constant-glow rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Pro Tips for Panic Mode
              </h3>
              <ul className="space-y-3 text-foreground/70">
                <li className="flex gap-3">
                  <span className="text-accent font-bold flex-shrink-0">•</span>
                  <span>Get 7+ hours of sleep - it's worth more than extra study time</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold flex-shrink-0">•</span>
                  <span>Use Focus-Fuel tracking to maintain optimal hydration and caffeine</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold flex-shrink-0">•</span>
                  <span>Do 5-minute breathing exercises between sessions to stay calm</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold flex-shrink-0">•</span>
                  <span>Join a Ghost Study Room for accountability and motivation</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsPanicModeActive(false)}
              variant="outline"
              className="w-full border-border/50 text-foreground hover:bg-card/50"
            >
              Deactivate Panic Mode
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
