'use client';

import { Users, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StudyRoomsPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Ghost Study Rooms
          </h1>
          <p className="text-foreground/60">Virtual body-doubling with peers studying the same subjects</p>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-accent" />
            Active Study Rooms
          </h2>
          <div className="space-y-3">
            {['Biology Study Group', 'Math Prep', 'French Conversation'].map((room, idx) => (
              <div key={idx} className="bg-background/50 rounded-lg p-4 border border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{room}</p>
                    <p className="text-sm text-foreground/60">3 people studying</p>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:shadow-lg transition-all">
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-secondary" />
            How It Works
          </h2>
          <ul className="space-y-3 text-foreground/70">
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">1.</span>
              <span>See focus timers of peers studying globally</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">2.</span>
              <span>Watch ghost avatars of others in their study sessions</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">3.</span>
              <span>Experience body-doubling effect without active interaction</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
