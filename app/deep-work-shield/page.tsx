'use client';

import { Shield, Lock, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeepWorkShieldPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Deep Work Shield
          </h1>
          <p className="text-foreground/60">Block distractions and focus on what matters</p>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Digital Barrier</h2>
          </div>
          <p className="text-foreground/70 mb-6">Enable Deep Work Shield to create a distraction-free environment</p>
          <Button className="bg-accent text-accent-foreground hover:shadow-lg glow-accent">
            <Lock className="w-4 h-4 mr-2" />
            Activate Deep Work Shield
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card-constant-glow rounded-xl p-6">
            <Bell className="w-5 h-5 text-secondary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Block Non-Academic Apps</h3>
            <p className="text-sm text-foreground/60">Automatically blocks social media and entertainment during focus sessions</p>
          </div>
          <div className="card-constant-glow rounded-xl p-6">
            <Lock className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Auto-Replies Enabled</h3>
            <p className="text-sm text-foreground/60">Sends auto-replies to messages so people know you're in deep work mode</p>
          </div>
        </div>
      </div>
    </div>
  );
}
