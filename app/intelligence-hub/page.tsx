'use client';

import { Brain, Upload, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IntelligenceHubPage() {
  return (
    <div className="min-h-screen bg-gradient-animated py-12 px-4 md:pl-80">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text animate-text-glow">
            Intelligence Hub
          </h1>
          <p className="text-foreground/60">AI-powered learning assistance and resources</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Upload Syllabus</h2>
            </div>
            <p className="text-foreground/60 mb-6">Let Nova extract your deadlines and create an instant Success Roadmap</p>
            <Button className="w-full bg-gradient-to-r from-accent to-primary text-white hover:shadow-lg glow-accent">
              Upload PDF or Photo
            </Button>
          </div>

          <div className="card-constant-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold text-foreground">Smart Resources</h2>
            </div>
            <p className="text-foreground/60 mb-6">Automatic tutorials, docs, and cheat sheets attached to every task</p>
            <Button className="w-full bg-primary text-primary-foreground hover:shadow-lg transition-all">
              Browse Resources
            </Button>
          </div>
        </div>

        <div className="card-constant-glow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Nova's Capabilities
          </h2>
          <ul className="space-y-3 text-foreground/70">
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>OCR & NLP to extract deadlines from syllabus photos/PDFs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>Multimodal learning - transform text to audio summaries or mind maps</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>Smart Resource Aggregator - find top-rated materials automatically</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>Automated Difficulty Scaling based on your performance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
