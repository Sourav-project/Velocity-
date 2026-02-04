'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Zap } from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

interface Task {
  id: string;
  title: string;
  due_date: string;
  status: string;
  intensity: string;
  estimated_time: number;
  scheduled_time?: string;
}

interface DailyScheduleProps {
  tasks: Task[];
  peakHoursStart?: string;
  peakHoursEnd?: string;
  energySlumpStart?: string;
  energySlumpEnd?: string;
}

export function DailySchedule({
  tasks,
  peakHoursStart = '09:00',
  peakHoursEnd = '12:00',
  energySlumpStart = '14:00',
  energySlumpEnd = '16:00',
}: DailyScheduleProps) {
  const today = new Date();

  const todayTasks = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    return isToday(taskDate) || (task.scheduled_time && isToday(new Date(task.scheduled_time)));
  });

  const upcomingTasks = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    return (isTomorrow(taskDate) || taskDate > today) && taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  const overdueTasks = tasks.filter((task) => {
    const taskDate = new Date(task.due_date);
    return isYesterday(taskDate) || (taskDate < today && task.status !== 'completed');
  });

  const getIntensityBgColor = (intensity: string) => {
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

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Energy Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Your Energy Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 min-w-[120px]">Peak Hours:</div>
              <div className="flex-1 bg-green-100 rounded-lg p-3 border border-green-300">
                <p className="text-sm font-semibold text-green-900">
                  {peakHoursStart} - {peakHoursEnd}
                </p>
                <p className="text-xs text-green-700">Best time for high-intensity tasks</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700 min-w-[120px]">Energy Slump:</div>
              <div className="flex-1 bg-blue-100 rounded-lg p-3 border border-blue-300">
                <p className="text-sm font-semibold text-blue-900">
                  {energySlumpStart} - {energySlumpEnd}
                </p>
                <p className="text-xs text-blue-700">Reserve for low-intensity tasks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border-l-4 border-red-500 ${getIntensityBgColor(task.intensity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getIntensityBadge(task.intensity)}>
                          {task.intensity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimated_time} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks scheduled for today</p>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${getIntensityBgColor(task.intensity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getIntensityBadge(task.intensity)}>
                          {task.intensity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimated_time} min</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{task.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Week */}
      {upcomingTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${getIntensityBgColor(task.intensity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={getIntensityBadge(task.intensity)}>
                          {task.intensity}
                        </Badge>
                        <p className="text-xs text-gray-600">
                          Due: {format(new Date(task.due_date), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
