'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    courseTitle: '',
    courseDescription: '',
    examDate: '',
    peakHoursStart: '09:00',
    peakHoursEnd: '12:00',
    energySlumpStart: '14:00',
    energySlumpEnd: '16:00',
    dailyStudyHours: 6,
    preferredSessionLength: 45,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Onboarding failed');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="card-glow border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">Let's Set Up Your Study Plan</CardTitle>
            <CardDescription className="text-foreground/60">Step {step} of 3 - Tell us about your learning goals</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Course Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="courseTitle" className="text-foreground/90">Course/Subject Name</Label>
                  <Input
                    id="courseTitle"
                    name="courseTitle"
                    placeholder="e.g., Biology, French Language, MCAT"
                    value={formData.courseTitle}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription" className="text-foreground/90">Description (optional)</Label>
                  <Textarea
                    id="courseDescription"
                    name="courseDescription"
                    placeholder="What topics or chapters will you be covering?"
                    value={formData.courseDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examDate" className="text-foreground/90">Exam/Deadline Date</Label>
                  <Input
                    id="examDate"
                    name="examDate"
                    type="date"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    required
                    className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Your Energy Patterns</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="peakHoursStart" className="text-foreground/90">Peak Hours Start</Label>
                    <Input
                      id="peakHoursStart"
                      name="peakHoursStart"
                      type="time"
                      value={formData.peakHoursStart}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="peakHoursEnd" className="text-foreground/90">Peak Hours End</Label>
                    <Input
                      id="peakHoursEnd"
                      name="peakHoursEnd"
                      type="time"
                      value={formData.peakHoursEnd}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="energySlumpStart" className="text-foreground/90">Energy Slump Start</Label>
                    <Input
                      id="energySlumpStart"
                      name="energySlumpStart"
                      type="time"
                      value={formData.energySlumpStart}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="energySlumpEnd" className="text-foreground/90">Energy Slump End</Label>
                    <Input
                      id="energySlumpEnd"
                      name="energySlumpEnd"
                      type="time"
                      value={formData.energySlumpEnd}
                      onChange={handleInputChange}
                      className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Study Preferences</h3>

                <div className="space-y-2">
                  <Label htmlFor="dailyStudyHours" className="text-foreground/90">Daily Study Hours Target</Label>
                  <Input
                    id="dailyStudyHours"
                    name="dailyStudyHours"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.dailyStudyHours}
                    onChange={handleInputChange}
                    className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredSessionLength" className="text-foreground/90">Preferred Session Length (minutes)</Label>
                  <Input
                    id="preferredSessionLength"
                    name="preferredSessionLength"
                    type="number"
                    min="15"
                    max="120"
                    value={formData.preferredSessionLength}
                    onChange={handleInputChange}
                    className="bg-input border-border/50 text-foreground transition-all duration-300 focus:border-primary"
                  />
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/30">
                  <p className="text-sm text-foreground/80">
                    <strong className="text-primary">Welcome to Velocity!</strong> Your personalized adaptive study system is ready. Nova, your AI assistant, will help you stay on track and overcome planner guilt.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="border-border/50 text-foreground hover:bg-card transition-all duration-300"
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground button-glow"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Setting up...' : step === 3 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
