'use client';

import { Gamepad2, Coins, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GameVedaPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Game VEDA
          </h1>
          <p className="text-foreground/60">Earn credits through micro games and challenges</p>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <Coins className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-sm text-foreground/60">Your Balance</p>
              <p className="text-3xl font-bold text-secondary">850 Credits</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Quick Quiz', reward: '50 Credits', time: '5 min' },
            { title: 'Flashcard Sprint', reward: '75 Credits', time: '10 min' },
            { title: 'Memory Game', reward: '100 Credits', time: '15 min' },
            { title: 'Vocab Challenge', reward: '60 Credits', time: '8 min' },
          ].map((game, idx) => (
            <div key={idx} className="card-constant-glow rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{game.title}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{game.time}</p>
                </div>
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-secondary" />
                  <p className="font-bold text-secondary">{game.reward}</p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:shadow-lg transition-all">
                  Play
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Use Credits</h2>
          <div className="space-y-3">
            {[
              'Unlock premium study materials',
              'Extend Deep Work Shield duration',
              'Get personalized study recommendations',
              'Access advanced analytics',
              'Join premium study rooms',
            ].map((use, idx) => (
              <div key={idx} className="flex gap-3 text-foreground/70">
                <span className="text-accent font-bold flex-shrink-0">✓</span>
                <span>{use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
