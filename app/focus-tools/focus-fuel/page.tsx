'use client';

import { useState } from 'react';
import { Activity, Droplet, Coffee, Moon, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BiometricEntry {
  date: string;
  sleep: number;
  hydration: number;
  caffeine: number;
  focusScore: number;
}

export default function FocusFuelPage() {
  const [entries, setEntries] = useState<BiometricEntry[]>([
    { date: 'Today', sleep: 7.5, hydration: 8, caffeine: 2, focusScore: 92 },
    { date: 'Yesterday', sleep: 6.5, hydration: 6, caffeine: 3, focusScore: 78 },
    { date: '2 days ago', sleep: 8, hydration: 9, caffeine: 1, focusScore: 95 },
  ]);

  const [newEntry, setNewEntry] = useState({
    sleep: 7,
    hydration: 8,
    caffeine: 2,
  });

  const calculateFocusScore = (sleep: number, hydration: number, caffeine: number) => {
    // 7+ hours sleep = +30 points
    // 8+ glasses water = +30 points
    // 1-2 cups caffeine = +40 points
    let score = 0;
    score += sleep >= 7 ? 30 : (sleep / 7) * 30;
    score += hydration >= 8 ? 30 : (hydration / 8) * 30;
    if (caffeine >= 1 && caffeine <= 2) score += 40;
    else if (caffeine < 1 || caffeine > 2) score += Math.max(0, 40 - Math.abs(caffeine - 1.5) * 20);
    return Math.round(Math.min(100, score));
  };

  const handleLogEntry = () => {
    const focusScore = calculateFocusScore(newEntry.sleep, newEntry.hydration, newEntry.caffeine);
    setEntries([
      { date: 'Today', ...newEntry, focusScore },
      ...entries.slice(0, 2),
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Focus-Fuel Tracking
          </h1>
          <p className="text-foreground/60">
            Monitor your biological variables for optimal study performance
          </p>
        </div>

        {/* Insights Card */}
        <div className="card-constant-glow rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-accent/10">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-secondary" />
            Your Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Sleep Correlation</p>
              <p className="text-2xl font-bold text-secondary">+30%</p>
              <p className="text-xs text-foreground/50 mt-1">More focus after 7+ hours</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Hydration Impact</p>
              <p className="text-2xl font-bold text-secondary">+25%</p>
              <p className="text-xs text-foreground/50 mt-1">Better performance when hydrated</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Optimal Caffeine</p>
              <p className="text-2xl font-bold text-secondary">1-2 cups</p>
              <p className="text-xs text-foreground/50 mt-1">Sweet spot for focus</p>
            </div>
          </div>
          <p className="text-sm text-foreground/70">
            Based on your data: Focus sessions are 30% more effective after 7+ hours of sleep and 8+ glasses of water per day.
          </p>
        </div>

        {/* Log Today's Entry */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Log Today's Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sleep */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
                <Moon className="w-4 h-4" />
                Hours of Sleep
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={newEntry.sleep}
                  onChange={(e) => setNewEntry({ ...newEntry, sleep: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xl font-bold text-secondary w-12 text-right">{newEntry.sleep}h</span>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                {newEntry.sleep >= 7 ? '✓ Great for focus' : 'Try for 7+ hours'}
              </p>
            </div>

            {/* Hydration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
                <Droplet className="w-4 h-4" />
                Glasses of Water
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={newEntry.hydration}
                  onChange={(e) => setNewEntry({ ...newEntry, hydration: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xl font-bold text-secondary w-12 text-right">{newEntry.hydration}</span>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                {newEntry.hydration >= 8 ? '✓ Optimal hydration' : 'Aim for 8+ glasses'}
              </p>
            </div>

            {/* Caffeine */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground/70 mb-3">
                <Coffee className="w-4 h-4" />
                Cups of Coffee
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={newEntry.caffeine}
                  onChange={(e) => setNewEntry({ ...newEntry, caffeine: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xl font-bold text-secondary w-12 text-right">{newEntry.caffeine}</span>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                {newEntry.caffeine >= 1 && newEntry.caffeine <= 2 ? '✓ Sweet spot' : 'Sweet spot: 1-2 cups'}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
            <p className="text-sm text-foreground/70 mb-3">Your Focus Score Today:</p>
            <p className="text-4xl font-bold text-accent">
              {calculateFocusScore(newEntry.sleep, newEntry.hydration, newEntry.caffeine)}%
            </p>
          </div>

          <Button
            onClick={handleLogEntry}
            className="w-full mt-6 bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all duration-300 glow-accent"
          >
            Log Entry
          </Button>
        </div>

        {/* History */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Recent History
          </h2>
          <div className="space-y-3">
            {entries.map((entry, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{entry.date}</h3>
                  <div className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold text-sm">
                    {entry.focusScore}% Focus
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60">Sleep</p>
                    <p className="font-semibold text-foreground">{entry.sleep}h</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Water</p>
                    <p className="font-semibold text-foreground">{entry.hydration} glasses</p>
                  </div>
                  <div>
                    <p className="text-foreground/60">Caffeine</p>
                    <p className="font-semibold text-foreground">{entry.caffeine} cups</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
