/**
 * Dynamic Catch-Up Engine
 * Automatically redistributes overdue/missed tasks into remaining days
 * using the priority formula: P = (D × C) / T
 * where D = difficulty, C = importance, T = time remaining
 */

export interface Task {
  id: string;
  title: string;
  difficulty: number;
  importance: number;
  estimated_time: number;
  due_date: string;
  status: string;
}

export interface RedistributionResult {
  taskId: string;
  originalDueDate: string;
  newDueDate: string;
  priorityScore: number;
  reason: string;
}

/**
 * Calculates priority score using the formula P = (D × C) / T
 */
export function calculatePriorityScore(task: Task): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.due_date);
  dueDate.setHours(0, 0, 0, 0);

  const timeRemaining = Math.max(1, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Priority = (Difficulty × Importance) / Time Remaining
  const priority = (task.difficulty * task.importance) / timeRemaining;

  return priority;
}

/**
 * Identifies overdue and at-risk tasks
 */
export function identifyAtRiskTasks(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (task.status === 'completed') return false;

    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);

    const daysUntilDue = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    const priority = calculatePriorityScore(task);

    // At-risk if overdue OR priority > 50
    return daysUntilDue < 0 || (daysUntilDue < 3 && priority > 30);
  });
}

/**
 * Finds optimal days to redistribute task based on capacity
 */
function findOptimalRedistributionDays(
  taskEstimatedTime: number,
  startDate: Date,
  endDate: Date,
  existingTasksByDate: Map<string, number>
): string[] {
  const optimalDays: string[] = [];
  const dailyCapacity = 360; // 6 hours in minutes
  const minimumGap = 30; // minimum minutes between study sessions

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    const usedMinutes = existingTasksByDate.get(dateKey) || 0;
    const availableMinutes = dailyCapacity - usedMinutes;

    if (availableMinutes >= taskEstimatedTime + minimumGap) {
      optimalDays.push(dateKey);
      existingTasksByDate.set(dateKey, usedMinutes + taskEstimatedTime);
    }
  }

  return optimalDays;
}

/**
 * Redistributes overdue/missed tasks to upcoming days
 */
export function redistributeTasks(
  overdueTasks: Task[],
  allTasks: Task[],
  examDate: Date
): RedistributionResult[] {
  const redistributions: RedistributionResult[] = [];
  const today = new Date();

  // Calculate existing task load by date
  const tasksByDate = new Map<string, number>();
  allTasks.forEach((task) => {
    if (task.status !== 'completed') {
      const dateKey = task.due_date;
      const current = tasksByDate.get(dateKey) || 0;
      tasksByDate.set(dateKey, current + (task.estimated_time || 0));
    }
  });

  // Sort tasks by priority (highest first)
  const sortedTasks = [...overdueTasks].sort((a, b) => {
    const priorityA = calculatePriorityScore(a);
    const priorityB = calculatePriorityScore(b);
    return priorityB - priorityA;
  });

  // Redistribute each task
  for (const task of sortedTasks) {
    const originalDueDate = new Date(task.due_date);
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow

    // Calculate buffer days before exam (usually 3-5 days for revision)
    const examBuffer = 3;
    const redistributionEndDate = new Date(examDate);
    redistributionEndDate.setDate(redistributionEndDate.getDate() - examBuffer);

    const optimalDays = findOptimalRedistributionDays(
      task.estimated_time || 0,
      startDate,
      redistributionEndDate,
      tasksByDate
    );

    if (optimalDays.length > 0) {
      const newDueDate = optimalDays[Math.floor(optimalDays.length / 2)]; // Middle day for even distribution
      const priority = calculatePriorityScore(task);

      redistributions.push({
        taskId: task.id,
        originalDueDate: task.due_date,
        newDueDate,
        priorityScore: parseFloat(priority.toFixed(2)),
        reason: `High priority (${priority.toFixed(1)}) - redistributed from overdue date`,
      });
    }
  }

  return redistributions;
}

/**
 * Generates a catch-up plan with specific recommendations
 */
export function generateCatchUpPlan(
  overdueTasks: Task[],
  allTasks: Task[],
  examDate: Date
): {
  redistributions: RedistributionResult[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
} {
  const redistributions = redistributeTasks(overdueTasks, allTasks, examDate);

  // Calculate urgency based on task volume and priority
  const totalPriority = overdueTasks.reduce((sum, task) => sum + calculatePriorityScore(task), 0);
  const avgPriority = totalPriority / Math.max(1, overdueTasks.length);

  let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (avgPriority > 100) urgencyLevel = 'critical';
  else if (avgPriority > 70) urgencyLevel = 'high';
  else if (avgPriority > 40) urgencyLevel = 'medium';

  // Generate recommendations
  const recommendations: string[] = [];

  if (overdueTasks.length > 5) {
    recommendations.push(`You have ${overdueTasks.length} overdue tasks. Start with the highest priority ones.`);
  }

  if (avgPriority > 50) {
    recommendations.push('These are high-priority items. Consider breaking them into smaller sessions.');
  }

  recommendations.push('Use energy-based scheduling to optimize study sessions during peak hours.');

  if (examDate) {
    const daysUntilExam = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExam < 7) {
      recommendations.push(`Only ${daysUntilExam} days until exam! Focus on the most critical topics.`);
    }
  }

  return {
    redistributions,
    recommendations,
    urgencyLevel,
  };
}

/**
 * Applies redistribution and updates task due dates
 */
export async function applyRedistribution(redistribution: RedistributionResult): Promise<boolean> {
  try {
    const response = await fetch(`/api/tasks/${redistribution.taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        due_date: redistribution.newDueDate,
        status: 'pending', // Reset status to pending
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    // Log the redistribution
    await fetch('/api/redistribution-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: redistribution.taskId,
        original_due_date: redistribution.originalDueDate,
        new_due_date: redistribution.newDueDate,
        priority_score: redistribution.priorityScore,
        reason: redistribution.reason,
      }),
    });

    return true;
  } catch (error) {
    console.error('[v0] Redistribution error:', error);
    return false;
  }
}
