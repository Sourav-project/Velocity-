'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OverdueTask {
  id: string;
  title: string;
  due_date: string;
  priorityScore: number;
  difficulty: number;
  importance: number;
  estimated_time: number;
}

interface CatchUpDashboardProps {
  studyPeriodId: string;
}

export function CatchUpDashboard({ studyPeriodId }: CatchUpDashboardProps) {
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRedistribution, setShowRedistribution] = useState(false);

  useEffect(() => {
    const fetchCatchUp = async () => {
      try {
        const response = await fetch('/api/catch-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studyPeriodId }),
        });

        if (!response.ok) throw new Error('Failed to fetch catch-up data');

        const data = await response.json();
        setOverdueTasks(data.overdueTasks || []);

        if (data.totalOverdue > 0) {
          setShowRedistribution(true);
        }
      } catch (err) {
        setError('Failed to load catch-up data');
        console.error('[v0] Catch-up error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatchUp();
  }, [studyPeriodId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-gray-500 text-center">Checking for overdue tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (overdueTasks.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <p className="text-green-700 font-medium">All caught up! No overdue tasks.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyLevel = (priority: number) => {
    if (priority > 100) return { level: 'critical', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    if (priority > 70) return { level: 'high', color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
    return { level: 'medium', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle };
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You have {overdueTasks.length} overdue task(s) that need redistribution. Nova's Catch-Up Engine can
          reorganize these intelligently!
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Overdue Tasks ({overdueTasks.length})
            {showRedistribution && (
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Redistribute Tasks
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overdueTasks.map((task) => {
              const { color } = getUrgencyLevel(task.priorityScore);
              const daysOverdue = Math.ceil(
                (new Date().getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={task.id} className={`p-4 rounded-lg border ${color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{task.title}</h4>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{daysOverdue} days overdue</Badge>
                        <Badge variant="outline">Priority: {task.priorityScore.toFixed(1)}</Badge>
                      </div>
                      <p className="text-xs mt-2 opacity-75">
                        Originally due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {task.estimated_time}
                        <span className="text-xs ml-1">min</span>
                      </p>
                      <p className="text-xs opacity-75">Difficulty: {task.difficulty}/10</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">How the Catch-Up Engine Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900">
          <p>
            📊 <strong>Priority Calculation:</strong> Each overdue task is scored using P = (Difficulty ×
            Importance) / Days Overdue
          </p>
          <p>
            🔄 <strong>Smart Redistribution:</strong> Tasks are redistributed across your remaining days,
            respecting your daily study capacity
          </p>
          <p>
            ⚡ <strong>Energy-Based Scheduling:</strong> High-priority tasks are scheduled during your peak hours
          </p>
          <p>
            🎯 <strong>Planner Guilt Relief:</strong> No more "late" status – just intelligent rescheduling!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
