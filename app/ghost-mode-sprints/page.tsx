'use client';

import { Eye, Zap, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function GhostModeSprintsPage() {
  const [isGhostActive, setIsGhostActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(1200); // 20 minutes

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Ghost Mode Study Sprints
          </h1>
          <p className="text-foreground/60">Anonymous focused study sessions with real-time peer presence</p>
        </div>

        {!isGhostActive ? (
          <>
            <div className="card-constant-glow rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <Eye className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Start a Ghost Mode Sprint</h2>
                  <p className="text-foreground/70">Study with the presence of peers worldwide without distractions. See their focus timers and progress without any interaction—pure focus amplification.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <Globe className="w-5 h-5 text-secondary mb-2" />
                  <p className="font-semibold text-foreground mb-1">Global Community</p>
                  <p className="text-sm text-foreground/60">12,456 studying now</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <Users className="w-5 h-5 text-accent mb-2" />
                  <p className="font-semibold text-foreground mb-1">Your Room</p>
                  <p className="text-sm text-foreground/60">456 in Biology</p>
                </div>
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <Zap className="w-5 h-5 text-primary mb-2" />
                  <p className="font-semibold text-foreground mb-1">Focus Factor</p>
                  <p className="text-sm text-foreground/60">+34% productivity boost</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="block text-foreground/90 font-semibold">Sprint Duration</label>
                <div className="flex gap-2">
                  {[15, 25, 45, 60].map((duration) => (
                    <Button
                      key={duration}
                      variant={sessionTime === duration * 60 ? 'default' : 'outline'}
                      onClick={() => setSessionTime(duration * 60)}
                      className={sessionTime === duration * 60 ? 'bg-primary' : 'border-border/50'}
                    >
                      {duration}m
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-accent text-accent-foreground hover:shadow-lg glow-accent text-lg py-6 font-semibold"
                onClick={() => setIsGhostActive(true)}
              >
                <Eye className="w-5 h-5 mr-2" />
                Enter Ghost Mode
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="card-constant-glow rounded-xl p-6">
                <Eye className="w-5 h-5 text-secondary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">See Not Seen</h3>
                <p className="text-sm text-foreground/60">You appear as a ghost to others—your avatar shows your focus timer but not your identity</p>
              </div>
              <div className="card-constant-glow rounded-xl p-6">
                <Zap className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Body-Doubling Effect</h3>
                <p className="text-sm text-foreground/60">Experience the productivity boost of studying with others without social pressure</p>
              </div>
            </div>
          </>
        ) : (
          <div className="card-constant-glow rounded-2xl p-8 border-accent animate-pulse-glow">
            <div className="space-y-6">
              <div className="text-center">
                <Eye className="w-12 h-12 text-accent animate-bounce mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">Ghost Mode Active</h2>
                <p className="text-lg text-foreground/70">You appear as a ghost to others in the Biology Study Room</p>
              </div>

              <div className="text-center">
                <p className="text-6xl font-bold gradient-text mb-2">{Math.floor(sessionTime / 60)}:{String(sessionTime % 60).padStart(2, '0')}</p>
                <p className="text-foreground/60">Remaining in sprint</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Ghost Avatars in Room</h3>
                  <div className="space-y-2">
                    {[
                      { time: '18:32', subject: 'Biology' },
                      { time: '15:47', subject: 'Biology' },
                      { time: '12:15', subject: 'Biology' },
                    ].map((ghost, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-background/50 rounded border border-border/50">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                          👻
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">Ghost #{idx + 1}</p>
                          <p className="text-xs text-foreground/60">{ghost.time} on {ghost.subject}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Room Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/60">Avg focus timer</span>
                      <span className="font-bold text-accent">23:45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/60">Most common subject</span>
                      <span className="font-bold text-secondary">Biology</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground/60">Total studying now</span>
                      <span className="font-bold text-primary">438 minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-border/50 text-foreground hover:bg-card/50 bg-transparent"
                onClick={() => setIsGhostActive(false)}
              >
                Exit Ghost Mode
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
