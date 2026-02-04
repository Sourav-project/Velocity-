/**
 * Spaced Repetition System (SRS)
 * Automatically schedules review sessions at optimal intervals:
 * 1 day, 3 days, 7 days, and 30 days after initial study
 */

export interface SpacedRepetition {
  id?: string;
  taskId: string;
  originalStudyDate: string;
  review1Date: string; // 1 day
  review3Date: string; // 3 days
  review7Date: string; // 7 days
  review30Date: string; // 30 days
  review1Completed: boolean;
  review3Completed: boolean;
  review7Completed: boolean;
  review30Completed: boolean;
}

const REVIEW_INTERVALS = [
  { days: 1, name: '1-day review' },
  { days: 3, name: '3-day review' },
  { days: 7, name: '7-day review' },
  { days: 30, name: '30-day review' },
];

/**
 * Creates a spaced repetition schedule for a task
 */
export function createSpacedRepetitionSchedule(
  taskId: string,
  studyDate: Date = new Date()
): SpacedRepetition {
  const schedule: SpacedRepetition = {
    taskId,
    originalStudyDate: studyDate.toISOString().split('T')[0],
    review1Date: addDays(studyDate, 1),
    review3Date: addDays(studyDate, 3),
    review7Date: addDays(studyDate, 7),
    review30Date: addDays(studyDate, 30),
    review1Completed: false,
    review3Completed: false,
    review7Completed: false,
    review30Completed: false,
  };

  return schedule;
}

/**
 * Helper function to add days to a date
 */
function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

/**
 * Gets pending review sessions for today
 */
export function getTodayReviews(schedules: SpacedRepetition[]): SpacedRepetition[] {
  const today = new Date().toISOString().split('T')[0];

  return schedules.filter((schedule) => {
    if (
      !schedule.review1Completed &&
      schedule.review1Date === today
    ) {
      return true;
    }
    if (
      !schedule.review3Completed &&
      schedule.review3Date === today
    ) {
      return true;
    }
    if (
      !schedule.review7Completed &&
      schedule.review7Date === today
    ) {
      return true;
    }
    if (
      !schedule.review30Completed &&
      schedule.review30Date === today
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Gets upcoming review sessions within a specified range
 */
export function getUpcomingReviews(
  schedules: SpacedRepetition[],
  daysAhead: number = 7
): Array<SpacedRepetition & { reviewType: string; daysUntil: number }> {
  const today = new Date();
  const upcoming: Array<SpacedRepetition & { reviewType: string; daysUntil: number }> = [];

  for (const schedule of schedules) {
    // Check 1-day review
    if (!schedule.review1Completed) {
      const reviewDate = new Date(schedule.review1Date);
      const daysUntil = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        upcoming.push({
          ...schedule,
          reviewType: '1-day review',
          daysUntil,
        });
      }
    }

    // Check 3-day review
    if (!schedule.review3Completed) {
      const reviewDate = new Date(schedule.review3Date);
      const daysUntil = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        upcoming.push({
          ...schedule,
          reviewType: '3-day review',
          daysUntil,
        });
      }
    }

    // Check 7-day review
    if (!schedule.review7Completed) {
      const reviewDate = new Date(schedule.review7Date);
      const daysUntil = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        upcoming.push({
          ...schedule,
          reviewType: '7-day review',
          daysUntil,
        });
      }
    }

    // Check 30-day review
    if (!schedule.review30Completed) {
      const reviewDate = new Date(schedule.review30Date);
      const daysUntil = Math.ceil((reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0 && daysUntil <= daysAhead) {
        upcoming.push({
          ...schedule,
          reviewType: '30-day review',
          daysUntil,
        });
      }
    }
  }

  // Sort by days until review
  return upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
}

/**
 * Marks a review session as completed
 */
export async function completeReview(
  scheduleId: string,
  reviewType: '1-day' | '3-day' | '7-day' | '30-day'
): Promise<boolean> {
  try {
    const updateData: Record<string, boolean> = {};

    switch (reviewType) {
      case '1-day':
        updateData.review_1_completed = true;
        break;
      case '3-day':
        updateData.review_3_completed = true;
        break;
      case '7-day':
        updateData.review_7_completed = true;
        break;
      case '30-day':
        updateData.review_30_completed = true;
        break;
    }

    const response = await fetch(`/api/spaced-repetitions/${scheduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    return response.ok;
  } catch (error) {
    console.error('[v0] Complete review error:', error);
    return false;
  }
}

/**
 * Calculates retention percentage based on completed reviews
 */
export function calculateRetention(schedule: SpacedRepetition): number {
  let completedReviews = 0;
  if (schedule.review1Completed) completedReviews++;
  if (schedule.review3Completed) completedReviews++;
  if (schedule.review7Completed) completedReviews++;
  if (schedule.review30Completed) completedReviews++;

  return (completedReviews / 4) * 100;
}

/**
 * Gets SRS statistics
 */
export function getSpacedRepetitionStats(schedules: SpacedRepetition[]): {
  totalSchedules: number;
  completedFullCycle: number;
  partiallyCompleted: number;
  notStarted: number;
  averageRetention: number;
} {
  let completedFullCycle = 0;
  let partiallyCompleted = 0;
  let notStarted = 0;
  let totalRetention = 0;

  for (const schedule of schedules) {
    const retention = calculateRetention(schedule);
    totalRetention += retention;

    if (retention === 100) {
      completedFullCycle++;
    } else if (retention > 0) {
      partiallyCompleted++;
    } else {
      notStarted++;
    }
  }

  return {
    totalSchedules: schedules.length,
    completedFullCycle,
    partiallyCompleted,
    notStarted,
    averageRetention: schedules.length > 0 ? totalRetention / schedules.length : 0,
  };
}

/**
 * Creates review tasks for a task after marking it complete
 */
export async function createReviewTasks(
  taskId: string,
  originalTaskTitle: string,
  studyPeriodId: string
): Promise<void> {
  const schedule = createSpacedRepetitionSchedule(taskId);

  // Create spaced repetition record
  try {
    const response = await fetch('/api/spaced-repetitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        originalStudyDate: schedule.originalStudyDate,
        review1Date: schedule.review1Date,
        review3Date: schedule.review3Date,
        review7Date: schedule.review7Date,
        review30Date: schedule.review30Date,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create spaced repetition schedule');
    }

    // Create review task entries
    const reviewDates = [
      { date: schedule.review1Date, label: '1-day review' },
      { date: schedule.review3Date, label: '3-day review' },
      { date: schedule.review7Date, label: '7-day review' },
      { date: schedule.review30Date, label: '30-day review' },
    ];

    for (const review of reviewDates) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyPeriodId,
          title: `${review.label}: ${originalTaskTitle}`,
          description: `Review task from original study`,
          difficulty: 3,
          importance: 7,
          estimatedTime: 20,
          dueDate: review.date,
          intensity: 'low',
          isReviewTask: true,
          originalTaskId: taskId,
        }),
      });
    }
  } catch (error) {
    console.error('[v0] Create review tasks error:', error);
  }
}
