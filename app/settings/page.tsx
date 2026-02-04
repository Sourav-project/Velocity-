'use client';

import { Settings, Bell, Shield, Mic, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Settings
          </h1>
          <p className="text-foreground/60">Customize your Velocity experience</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
            </div>
            <div className="space-y-4">
              {['Study reminders', 'Achievement unlocks', 'Friend activity'].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-foreground/70">{setting}</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Voice & Microphone */}
          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold text-foreground">Voice & Schedule</h2>
            </div>
            <p className="text-foreground/70 mb-4">
              Enable voice-to-schedule to update your plan using natural language commands
            </p>
            <Button className="bg-primary text-primary-foreground hover:shadow-lg transition-all">
              Enable Microphone Access
            </Button>
          </div>

          {/* Privacy & Security */}
          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              {['Two-factor authentication', 'App data encryption', 'Share learning data anonymously'].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-foreground/70">{setting}</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>

          {/* Biometric Integration */}
          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Wearable Integration</h2>
            </div>
            <p className="text-foreground/70 mb-4">
              Connect your fitness tracker or smartwatch to sync biometric data
            </p>
            <div className="space-y-2">
              <Button className="w-full bg-primary text-primary-foreground hover:shadow-lg transition-all">
                Connect Wearable Device
              </Button>
              <p className="text-xs text-foreground/50 text-center mt-2">
                Supports: Apple Watch, Fitbit, Garmin, Oura Ring
              </p>
            </div>
          </div>

          {/* Account */}
          <div className="card-constant-glow rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Account
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-card/50 bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full border-border/50 text-foreground hover:bg-card/50 bg-transparent">
                Export My Data
              </Button>
              <Button variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
