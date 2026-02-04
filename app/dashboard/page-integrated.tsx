'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard-header';
import { TaskList } from '@/components/task-list';
import { CreateTaskModal } from '@/components/create-task-modal';
import { NovaChat } from '@/components/nova-chat';
import { CatchUpDashboard } from '@/components/catch-up-dashboard';
import { EnergyAnalytics } from '@/components/energy-analytics';
import { SpacedRepetitionDashboard } from '@/components/spaced-repetition-dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Calendar, Zap, BookOpen, Brain } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';

interface StudyPeriod {
  id: string;
  title: string;
  exam_date: string;
  description?: string;
}

interface Task {
  id: string;
  difficulty: number;
  importance: number;
  intensity: string;
  estimated_time: number;
}

export default function DashboardIntegratedPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Student');
  const [studyPeriods, setStudyPeriods] = useState<StudyPeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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
    const fetchStudyPeriods = async () => {
      try {
        const response = await fetch('/api/study-periods');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login');
            return;
          }
          throw new Error('Failed to fetch study periods');
        }

        const data = await response.json();
        setStudyPeriods(data || []);
        if (data && data.length > 0) {
          setSelectedPeriodId(data[0].id);
        }
      } catch (err) {
        setError('Failed to load study periods');
        console.error('[v0] Fetch study periods error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyPeriods();
  }, [router]);

  const currentPeriod = studyPeriods.find((p) => p.id === selectedPeriodId);
  const daysUntilExam = currentPeriod
    ? Math.ceil((new Date(currentPeriod.exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={userName} />
        <main className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Loading your study plan...</p>
          </div>
        </main>
      </div>
    );
  }

  if (studyPeriods.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader userName={userName} />
        <main className="max-w-7xl mx-auto p-6">
          <Card className="card-glow">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <p className="text-foreground mb-4">No study periods found. Let's create your first one!</p>
              <Button
                className="bg-primary hover:bg-primary/80 button-glow text-primary-foreground"
                onClick={() => router.push('/onboarding')}
              >
                Create Study Period
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userName={userName} />

      <main className="max-w-7xl mx-auto p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Study Period Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {studyPeriods.map((period) => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriodId(period.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                selectedPeriodId === period.id
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'bg-card text-foreground border border-border hover:border-primary'
              }`}
            >
              {period.title}
            </button>
          ))}
        </div>

        {currentPeriod && (
          <>
            {/* Study Period Info Card */}
            <Card className="card-glow bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl gradient-text">{currentPeriod.title}</CardTitle>
                    {currentPeriod.description && (
                      <p className="text-sm text-foreground/70 mt-1">{currentPeriod.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary animate-glow">{Math.max(0, daysUntilExam)}</p>
                    <p className="text-sm text-foreground/60">days until exam</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Exam Date: {format(new Date(currentPeriod.exam_date), 'MMMM dd, yyyy')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="energy" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Energy</span>
                </TabsTrigger>
                <TabsTrigger value="nova">Nova</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-foreground/70">Study Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-primary">0%</p>
                      <p className="text-xs text-foreground/50 mt-1">Tasks completed</p>
                    </CardContent>
                  </Card>

                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-foreground/70">Daily Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-secondary">6h</p>
                      <p className="text-xs text-foreground/50 mt-1">Target study time</p>
                    </CardContent>
                  </Card>

                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-foreground/70">Focus Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-accent">0</p>
                      <p className="text-xs text-foreground/50 mt-1">Days consistent</p>
                    </CardContent>
                  </Card>
                </div>

                <CatchUpDashboard studyPeriodId={selectedPeriodId} />
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary/80 text-primary-foreground button-glow py-6 text-lg mb-4"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Task
                </Button>
                <TaskList
                  studyPeriodId={selectedPeriodId}
                  onTasksLoaded={(tasks) => setAllTasks(tasks)}
                />
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="card-glow">
                      <CardHeader>
                        <CardTitle className="gradient-text">Coming Soon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">Calendar view will be available soon</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <SpacedRepetitionDashboard studyPeriodId={selectedPeriodId} />
                  </div>
                </div>
              </TabsContent>

              {/* Energy Tab */}
              <TabsContent value="energy">
                <EnergyAnalytics tasks={allTasks} />
              </TabsContent>

              {/* Nova Tab */}
              <TabsContent value="nova">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <NovaChat studyPeriodId={selectedPeriodId} />
                  </div>
                  <div>
                    <Card className="card-glow border-secondary/30 bg-gradient-to-br from-secondary/10 to-primary/10">
                      <CardHeader>
                        <CardTitle className="text-base gradient-text">About Nova</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-foreground/80">
                        <p>
                          Nova is your intelligent AI study assistant powered by advanced language models. She
                          understands the Velocity system completely.
                        </p>
                        <div className="space-y-2">
                          <p className="font-semibold text-foreground">Nova can help with:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-foreground/70">
                            <li>Prioritizing tasks using the P=(D×C)/T formula</li>
                            <li>Scheduling during your peak energy hours</li>
                            <li>Overcoming planner guilt and anxiety</li>
                            <li>Understanding spaced repetition</li>
                            <li>Study tips and motivation</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        studyPeriodId={selectedPeriodId}
        onTaskCreated={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
