'use client';

import { useState } from 'react';
import { Zap, Clock, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GhostRecord {
  task: string;
  previousTime: number;
  currentTime: number;
  improvement: number;
}

export default function GhostModePage() {
  const [isSprintActive, setIsSprintActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState('Math Problem Set');
  const [sprintTime, setSprintTime] = useState(0);
  const [previousBest, setPreviousBest] = useState(45);
  
  const [records, setRecords] = useState<GhostRecord[]>([
    { task: 'Biology Chapter Review', previousTime: 60, currentTime: 52, improvement: 13 },
    { task: 'French Vocabulary', previousTime: 30, currentTime: 28, improvement: 7 },
    { task: 'Physics Problems', previousTime: 90, currentTime: 82, improvement: 9 },
  ]);

  const startSprint = () => {
    setIsSprintActive(true);
    setSprintTime(0);
  };

  const completeSprint = () => {
    setIsSprintActive(false);
    const improvement = Math.round(((previousBest - sprintTime) / previousBest) * 100);
    setRecords([
      { task: selectedTask, previousTime: previousBest, currentTime: sprintTime, improvement },
      ...records,
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Ghost Mode Study Sprints
          </h1>
          <p className="text-foreground/60">
            Race against your own ghost to build speed and focus
          </p>
        </div>

        {/* Active Sprint */}
        {isSprintActive ? (
          <div className="card-constant-glow rounded-2xl p-8 bg-gradient-to-br from-accent/10 to-primary/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedTask}</h2>
              <div className="text-7xl font-bold text-accent animate-pulse mb-4">
                {sprintTime}
              </div>
              <p className="text-foreground/60 mb-6">seconds elapsed</p>
              <p className="text-lg text-foreground/70 mb-6">
                Your ghost is at <span className="text-secondary font-bold">{previousBest}s</span> - Can you beat it?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-background/50 rounded-lg p-4 text-center border border-border/50">
                <p className="text-sm text-foreground/60 mb-1">Current Time</p>
                <p className="text-3xl font-bold text-accent">{sprintTime}s</p>
              </div>
              <div className="bg-background/50 rounded-lg p-4 text-center border border-border/50">
                <p className="text-sm text-foreground/60 mb-1">Personal Best</p>
                <p className="text-3xl font-bold text-secondary">{previousBest}s</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={completeSprint}
                className="flex-1 bg-accent text-accent-foreground hover:shadow-lg transition-all duration-300 glow-accent"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Sprint Complete
              </Button>
              <Button
                onClick={() => setIsSprintActive(false)}
                variant="outline"
                className="flex-1 border-border/50 text-foreground hover:bg-card/50"
              >
                Pause Sprint
              </Button>
            </div>
          </div>
        ) : (
          <div className="card-constant-glow rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent" />
              Start a New Sprint
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-3">
                  Select a Task
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {['Math Problem Set', 'Biology Chapter Review', 'French Vocabulary', 'Physics Problems'].map(task => (
                    <option key={task} value={task}>{task}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-3">
                  Personal Best Time (seconds)
                </label>
                <input
                  type="number"
                  value={previousBest}
                  onChange={(e) => setPreviousBest(parseInt(e.target.value) || 0)}
                  className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <Button
                onClick={startSprint}
                className="w-full bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg transition-all duration-300 glow-accent"
              >
                <Clock className="w-4 h-4 mr-2" />
                Start Sprint
              </Button>
            </div>

            {/* How It Works */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <h3 className="font-semibold text-foreground mb-4">How Ghost Mode Works</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-accent flex-shrink-0">1.</span>
                  <span>Your previous best time appears as your "ghost"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent flex-shrink-0">2.</span>
                  <span>Race against it and try to complete the task faster</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent flex-shrink-0">3.</span>
                  <span>Gamification builds speed, focus, and intrinsic motivation</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Sprint Records */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-secondary" />
            Your Sprint Records
          </h2>
          <div className="space-y-3">
            {records.map((record, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{record.task}</h3>
                  {record.improvement > 0 && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                      {record.improvement}% faster
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60">Previous</p>
                    <p className="font-semibold text-foreground">{record.previousTime}s</p>
                  </div>
                  <div className="text-foreground/40">→</div>
                  <div>
                    <p className="text-foreground/60">Current</p>
                    <p className="font-semibold text-accent">{record.currentTime}s</p>
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
