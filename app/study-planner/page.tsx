'use client';

import { Calendar, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudyPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Study Planner
          </h1>
          <p className="text-foreground/60">Manage your tasks and schedule intelligently</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Active Tasks', value: '12' },
            { icon: CheckCircle, label: 'Completed', value: '28' },
            { icon: Clock, label: 'Hours Planned', value: '24h' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="card-constant-glow rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-secondary" />
                  <p className="text-foreground/60 text-sm">{item.label}</p>
                </div>
                <p className="text-3xl font-bold text-foreground">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Your Study Schedule</h2>
          <div className="space-y-3">
            {[
              { task: 'Biology Chapter 5', time: '2 hours', priority: 'high' },
              { task: 'Math Problem Set', time: '1.5 hours', priority: 'medium' },
              { task: 'French Vocabulary', time: '1 hour', priority: 'low' },
            ].map((item, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.task}</p>
                  <p className="text-sm text-foreground/60">{item.time}</p>
                </div>
                <Button variant="outline" className="border-border/50 text-foreground hover:bg-card/50 bg-transparent">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
