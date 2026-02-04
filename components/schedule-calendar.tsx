'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  due_date: string;
  status: string;
  intensity: string;
}

interface ScheduleCalendarProps {
  tasks: Task[];
  examDate?: string;
}

export function ScheduleCalendar({ tasks, examDate }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const dateKey = format(new Date(task.due_date), 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(task);
    });
    return map;
  }, [tasks]);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isExamDate = (date: Date) => {
    return examDate ? isSameDay(date, new Date(examDate)) : false;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Study Schedule
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            {format(currentDate, 'MMMM yyyy')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {Array.from({ length: days[0].getDay() }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {days.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayTasks = tasksByDate.get(dateKey) || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isExam = isExamDate(day);

              return (
                <div
                  key={dateKey}
                  className={`p-2 rounded-lg border-2 min-h-[100px] flex flex-col ${
                    isCurrentMonth
                      ? isExam
                        ? 'bg-purple-50 border-purple-300'
                        : 'bg-white border-gray-200'
                      : 'bg-gray-50 border-gray-100 opacity-50'
                  }`}
                >
                  <span
                    className={`text-sm font-semibold mb-1 ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>

                  {isExam && (
                    <Badge className="bg-purple-600 text-white mb-1 text-xs w-fit">Exam</Badge>
                  )}

                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded border ${getIntensityColor(task.intensity)} truncate`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>

                  {dayTasks.length > 0 && (
                    <Badge variant="outline" className="text-xs w-fit mt-1">
                      {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm font-semibold text-gray-700">Intensity Legend:</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300" />
                <span className="text-xs text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                <span className="text-xs text-gray-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300" />
                <span className="text-xs text-gray-600">Exam Day</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
