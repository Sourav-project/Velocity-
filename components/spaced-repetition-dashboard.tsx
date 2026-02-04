'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewSchedule {
  id: string;
  taskId: string;
  review1Date: string;
  review3Date: string;
  review7Date: string;
  review30Date: string;
  review1Completed: boolean;
  review3Completed: boolean;
  review7Completed: boolean;
  review30Completed: boolean;
}

interface SpacedRepetitionDashboardProps {
  studyPeriodId: string;
}

export function SpacedRepetitionDashboard({ studyPeriodId }: SpacedRepetitionDashboardProps) {
  const [schedules, setSchedules] = useState<ReviewSchedule[]>([]);
  const [todayReviews, setTodayReviews] = useState<ReviewSchedule[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<ReviewSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completed: 0, total: 0, avgRetention: 0 });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('/api/spaced-repetitions');
        if (!response.ok) throw new Error('Failed to fetch schedules');

        const data = await response.json();
        setSchedules(data || []);

        // Calculate stats
        let completedCount = 0;
        let totalReviews = 0;

        data?.forEach((schedule: ReviewSchedule) => {
          if (schedule.review1Completed) completedCount++;
          if (schedule.review3Completed) completedCount++;
          if (schedule.review7Completed) completedCount++;
          if (schedule.review30Completed) completedCount++;
          totalReviews += 4;
        });

        setStats({
          completed: completedCount,
          total: totalReviews,
          avgRetention: totalReviews > 0 ? (completedCount / totalReviews) * 100 : 0,
        });

        // Find today's reviews
        const today = new Date().toISOString().split('T')[0];
        setTodayReviews(
          data?.filter((schedule: ReviewSchedule) => {
            if (
              !schedule.review1Completed &&
              schedule.review1Date === today
            )
              return true;
            if (
              !schedule.review3Completed &&
              schedule.review3Date === today
            )
              return true;
            if (
              !schedule.review7Completed &&
              schedule.review7Date === today
            )
              return true;
            if (
              !schedule.review30Completed &&
              schedule.review30Date === today
            )
              return true;
            return false;
          }) || []
        );

        // Find upcoming reviews (next 7 days)
        const currentDate = new Date();
        setUpcomingReviews(
          data
            ?.flatMap((schedule: ReviewSchedule) => {
              const reviews = [];
              if (!schedule.review1Completed) {
                const date = new Date(schedule.review1Date);
                const days = Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                if (days >= 0 && days <= 7) reviews.push(schedule);
              }
              if (!schedule.review3Completed) {
                const date = new Date(schedule.review3Date);
                const days = Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                if (days >= 0 && days <= 7) reviews.push(schedule);
              }
              if (!schedule.review7Completed) {
                const date = new Date(schedule.review7Date);
                const days = Math.ceil((date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                if (days >= 0 && days <= 7) reviews.push(schedule);
              }
              return reviews;
            }) || []
        );
      } catch (err) {
        console.error('[v0] Fetch schedules error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [studyPeriodId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-gray-500 text-center">Loading spaced repetition schedule...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.avgRetention.toFixed(0)}%</p>
            <Progress value={stats.avgRetention} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">
              {stats.completed} of {stats.total} reviews completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{todayReviews.length}</p>
            <p className="text-xs text-gray-500 mt-1">
              {todayReviews.length > 0 ? 'Review sessions due today' : 'No reviews scheduled'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{upcomingReviews.length}</p>
            <p className="text-xs text-gray-500 mt-1">Review sessions coming</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Reviews */}
      {todayReviews.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Today's Review Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayReviews.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Review scheduled</p>
                    <p className="text-sm text-gray-600">Task ID: {schedule.taskId.slice(0, 8)}...</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Complete Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reviews */}
      {upcomingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Upcoming Reviews (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReviews.slice(0, 5).map((schedule, idx) => (
                <div key={`${schedule.id}-${idx}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-1">
                      Review needed
                    </Badge>
                    <p className="text-sm text-gray-600">Task: {schedule.taskId.slice(0, 8)}...</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-gray-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SRS Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">Spaced Repetition System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-purple-900">
          <p>
            📚 <strong>Optimal Learning:</strong> Review sessions are scheduled at scientifically optimal intervals
          </p>
          <div className="ml-6 space-y-1 text-xs">
            <p>• 1 day - Reinforce immediate memory</p>
            <p>• 3 days - Strengthen recall</p>
            <p>• 7 days - Combat the forgetting curve</p>
            <p>• 30 days - Lock in long-term retention</p>
          </div>
          <p className="mt-2">
            ✅ <strong>Auto-Created Tasks:</strong> Review sessions are automatically added to your task list
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
