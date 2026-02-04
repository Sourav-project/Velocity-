'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format, isPast, isSameDay } from 'date-fns';

interface Task {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: string;
  difficulty: number;
  importance: number;
  estimated_time: number;
  intensity: string;
}

interface TaskListProps {
  studyPeriodId: string;
  onTasksLoaded?: (tasks: Task[]) => void;
}

export function TaskList({ studyPeriodId, onTasksLoaded }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?studyPeriodId=${studyPeriodId}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        setTasks(data || []);
        onTasksLoaded?.(data || []);
      } catch (err) {
        setError('Failed to load tasks');
        console.error('[v0] Task fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [studyPeriodId, onTasksLoaded]);

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('[v0] Task update error:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('[v0] Task delete error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-50';
      case 'medium':
        return 'bg-yellow-50';
      case 'low':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  const priorityScore = (difficulty: number, importance: number, daysUntilDue: number) => {
    if (daysUntilDue <= 0) return 999;
    return (difficulty * importance) / daysUntilDue;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    const daysA = Math.ceil((dateA.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const daysB = Math.ceil((dateB.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const priorityA = priorityScore(a.difficulty, a.importance, daysA);
    const priorityB = priorityScore(b.difficulty, b.importance, daysB);

    return priorityB - priorityA;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks ({sortedTasks.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks yet. Create one to get started!</p>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const dueDate = new Date(task.due_date);
              const isOverdue = isPast(dueDate) && task.status !== 'completed';
              const isToday = isSameDay(dueDate, new Date());

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${getIntensityColor(task.intensity)} flex items-start gap-4`}
                >
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={(checked) =>
                      handleTaskStatusChange(task.id, checked ? 'completed' : 'pending')
                    }
                    className="mt-1"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-medium ${
                            task.status === 'completed'
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600">{task.subject}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimated_time} min</span>
                      </div>
                      <div>
                        Difficulty: <span className="font-medium">{task.difficulty}/10</span>
                      </div>
                      <div>
                        Importance: <span className="font-medium">{task.importance}/10</span>
                      </div>
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span>Overdue</span>
                        </div>
                      )}
                      {isToday && (
                        <Badge className="bg-blue-100 text-blue-800">Due Today</Badge>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Due: {format(dueDate, 'MMM dd, yyyy')}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
