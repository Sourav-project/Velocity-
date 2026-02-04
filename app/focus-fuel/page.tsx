'use client';

import { Coffee, Droplet, Activity, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FocusFuelPage() {
  const metrics = [
    { icon: Coffee, label: 'Hydration Level', value: '85%', color: 'text-blue-500' },
    { icon: Droplet, label: 'Energy Levels', value: '72%', color: 'text-accent' },
    { icon: Activity, label: 'Focus Stamina', value: '91%', color: 'text-secondary' },
    { icon: Heart, label: 'Overall Wellness', value: '79%', color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Focus Fuel
          </h1>
          <p className="text-foreground/60">Track and optimize your mental and physical energy for better studying</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className="card-constant-glow rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <p className="text-sm text-foreground/60">{metric.label}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                  <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-secondary"
                      style={{ width: metric.value }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Nova's Wellness Recommendations</h2>
          <div className="space-y-4">
            {[
              { title: 'Take a 5-minute break', description: 'Your focus stamina is high but hydration is dropping', priority: 'medium' },
              { title: 'Drink water', description: 'You haven\'t logged water intake in 2 hours', priority: 'high' },
              { title: 'Move around', description: 'Light movement can boost energy by 15%', priority: 'low' },
            ].map((rec, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{rec.title}</p>
                  <p className="text-sm text-foreground/60 mt-1">{rec.description}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${
                  rec.priority === 'high' ? 'bg-accent/20 text-accent' :
                  rec.priority === 'medium' ? 'bg-secondary/20 text-secondary' :
                  'bg-primary/20 text-primary'
                }`}>
                  {rec.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Today's Activity Log</h2>
          <div className="space-y-3">
            {[
              { time: '2:45 PM', activity: 'Logged water intake', icon: Droplet },
              { time: '2:30 PM', activity: 'Completed 45-min study session', icon: Activity },
              { time: '1:00 PM', activity: 'Lunch break (30 min)', icon: Coffee },
              { time: '10:30 AM', activity: 'Started studying Biology', icon: Activity },
            ].map((log, idx) => {
              const Icon = log.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50">
                  <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{log.activity}</p>
                    <p className="text-xs text-foreground/60">{log.time}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-border/50 text-foreground hover:bg-card/50 bg-transparent">
                    Undo
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button className="bg-primary text-primary-foreground hover:shadow-lg transition-all py-6 font-semibold">
            <Droplet className="w-4 h-4 mr-2" />
            Log Water
          </Button>
          <Button className="bg-secondary text-secondary-foreground hover:shadow-lg transition-all py-6 font-semibold">
            <Coffee className="w-4 h-4 mr-2" />
            Log Break
          </Button>
          <Button className="bg-accent text-accent-foreground hover:shadow-lg transition-all py-6 font-semibold">
            <Heart className="w-4 h-4 mr-2" />
            Mood Check
          </Button>
        </div>
      </div>
    </div>
  );
}
