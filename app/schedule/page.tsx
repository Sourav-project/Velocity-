'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { ScheduleCalendar } from '@/components/schedule-calendar';
import { DailySchedule } from '@/components/daily-schedule';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Task {
  id: string;
  title: string;
  due_date: string;
  status: string;
  intensity: string;
  estimated_time: number;
  scheduled_time?: string;
}

interface UserPreferences {
  peak_hours_start: string;
  peak_hours_end: string;
  energy_slump_start: string;
  energy_slump_end: string;
}

interface StudyPeriod {
  id: string;
  exam_date: string;
}

export default function SchedulePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [studyPeriod, setStudyPeriod] = useState<StudyPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        const user = await response.json();
        setUserName(user.full_name || user.email || 'Student');
      } catch (err) {
        console.error('[v0] Auth check error:', err);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch study periods
        const periodResponse = await fetch('/api/study-periods');
        if (!periodResponse.ok) throw new Error('Failed to fetch study periods');

        const periods = await periodResponse.json();
        if (periods.length === 0) {
          setError('No study periods found');
          return;
        }

        const period = periods[0];
        setStudyPeriod(period);

        // Fetch tasks
        const tasksResponse = await fetch(`/api/tasks?studyPeriodId=${period.id}`);
        if (!tasksResponse.ok) throw new Error('Failed to fetch tasks');

        const tasksData = await tasksResponse.json();
        setTasks(tasksData || []);

        // Fetch user preferences
        const preferencesResponse = await fetch('/api/user-preferences');
        if (preferencesResponse.ok) {
          const prefsData = await preferencesResponse.json();
          setPreferences(prefsData);
        }
      } catch (err) {
        setError('Failed to load schedule data');
        console.error('[v0] Schedule data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader userName={userName} />

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading your schedule...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <ScheduleCalendar tasks={tasks} examDate={studyPeriod?.exam_date} />
            </div>

            {/* Daily Schedule */}
            <div>
              <DailySchedule
                tasks={tasks}
                peakHoursStart={preferences?.peak_hours_start}
                peakHoursEnd={preferences?.peak_hours_end}
                energySlumpStart={preferences?.energy_slump_start}
                energySlumpEnd={preferences?.energy_slump_end}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
