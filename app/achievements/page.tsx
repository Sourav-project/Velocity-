'use client';

import { Award, TrendingUp, Flame } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Achievements
          </h1>
          <p className="text-foreground/60">Track your consistency and long-term progress</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="card-constant-glow rounded-xl p-6 text-center">
            <Flame className="w-8 h-8 text-accent mx-auto mb-3" />
            <p className="text-3xl font-bold text-accent mb-2">45</p>
            <p className="text-sm text-foreground/60">Day Streak</p>
          </div>
          <div className="card-constant-glow rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-3xl font-bold text-secondary mb-2">92%</p>
            <p className="text-sm text-foreground/60">Consistency Score</p>
          </div>
          <div className="card-constant-glow rounded-xl p-6 text-center animate-pulse-glow">
            <Award className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-primary mb-2">18</p>
            <p className="text-sm text-foreground/60">Badges Earned</p>
          </div>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Study Heatmap</h2>
          <div className="bg-background/50 rounded-lg p-6 border border-border/50">
            <p className="text-foreground/60 text-center mb-4">Your GitHub-style contribution graph showing dedication over time</p>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 140 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded ${
                    Math.random() > 0.3 
                      ? 'bg-accent/40' 
                      : Math.random() > 0.6 
                      ? 'bg-accent/70' 
                      : 'bg-accent'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-4 text-center">20 weeks of consistent studying</p>
          </div>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Unlocked Badges</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {['Early Bird', 'Night Owl', 'Marathon Runner', 'Perfect Week', 'Century Club', 'Never Miss'].map((badge, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50 text-center hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground text-sm">{badge}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
