'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Zap, Brain, Clock } from 'lucide-react';

interface Task {
  id: string;
  difficulty: number;
  importance: number;
  intensity: string;
  estimated_time: number;
  due_date: string;
}

interface EnergyAnalyticsProps {
  tasks: Task[];
  peakHoursStart?: string;
  peakHoursEnd?: string;
}

export function EnergyAnalytics({ tasks, peakHoursStart = '09:00', peakHoursEnd = '12:00' }: EnergyAnalyticsProps) {
  const analytics = useMemo(() => {
    const totalTasks = tasks.length;
    const highIntensity = tasks.filter((t) => t.intensity === 'high').length;
    const mediumIntensity = tasks.filter((t) => t.intensity === 'medium').length;
    const lowIntensity = tasks.filter((t) => t.intensity === 'low').length;

    // Calculate average cognitive load
    const avgCognitiveLoad = tasks.reduce((sum, task) => {
      const difficulty = task.difficulty || 5;
      const importance = task.importance || 5;
      return sum + difficulty * importance;
    }, 0) / Math.max(1, totalTasks);

    // Total estimated hours
    const totalMinutes = tasks.reduce((sum, task) => sum + (task.estimated_time || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Intensity distribution
    const intensityData = [
      { name: 'Low', value: lowIntensity, fill: '#22c55e' },
      { name: 'Medium', value: mediumIntensity, fill: '#eab308' },
      { name: 'High', value: highIntensity, fill: '#ef4444' },
    ];

    return {
      totalTasks,
      highIntensity,
      mediumIntensity,
      lowIntensity,
      avgCognitiveLoad: avgCognitiveLoad.toFixed(1),
      totalHours,
      intensityData,
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <Brain className="w-4 h-4" />
              Avg. Cognitive Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">{analytics.avgCognitiveLoad}</p>
            <p className="text-xs text-gray-500 mt-1">Higher = More Challenging</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{analytics.totalHours}h</p>
            <p className="text-xs text-gray-500 mt-1">Estimated Study Hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-600">
              <Zap className="w-4 h-4" />
              Peak Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{peakHoursStart}</p>
            <p className="text-xs text-gray-500 mt-1">
              Best time: {peakHoursStart}-{peakHoursEnd}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Task Intensity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Task Intensity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.intensityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          {/* Distribution Details */}
          <div className="space-y-2 mt-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">High Intensity</span>
                <span className="text-sm font-medium">{analytics.highIntensity}</span>
              </div>
              <Progress value={(analytics.highIntensity / analytics.totalTasks) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Medium Intensity</span>
                <span className="text-sm font-medium">{analytics.mediumIntensity}</span>
              </div>
              <Progress value={(analytics.mediumIntensity / analytics.totalTasks) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Low Intensity</span>
                <span className="text-sm font-medium">{analytics.lowIntensity}</span>
              </div>
              <Progress value={(analytics.lowIntensity / analytics.totalTasks) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Management Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-sm text-blue-900">Energy Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-800">
          <p>💡 Schedule high-intensity tasks during your peak hours ({peakHoursStart}-{peakHoursEnd})</p>
          <p>☕ Save low-intensity tasks for afternoon slumps</p>
          <p>⏱️ Use the Pomodoro technique: 25 min work + 5 min break</p>
          <p>🎯 Focus on quality over quantity during peak hours</p>
        </CardContent>
      </Card>
    </div>
  );
}
