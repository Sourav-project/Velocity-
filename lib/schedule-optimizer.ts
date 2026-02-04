/**
 * Schedule Optimizer - Implements Cognitive Load and Energy Mapping
 * Schedules tasks during peak hours for high-intensity work,
 * and reserves low-intensity tasks for energy slumps
 */

export interface Task {
  id: string;
  title: string;
  difficulty: number; // 1-10
  importance: number; // 1-10
  estimated_time: number; // in minutes
  intensity: string; // high, medium, low
  due_date: string;
}

export interface UserEnergyProfile {
  peakHoursStart: string; // HH:MM
  peakHoursEnd: string;
  energySlumpStart: string;
  energySlumpEnd: string;
  dailyStudyHours: number;
  preferredSessionLength: number;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  energyLevel: 'high' | 'low';
}

interface ScheduledTask extends Task {
  scheduledDate: string;
  scheduledTime: string;
  sessionDuration: number;
}

/**
 * Converts time string (HH:MM) to minutes from midnight
 */
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight to time string (HH:MM)
 */
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Generates available time slots for a given day based on energy profile
 */
function generateTimeSlots(profile: UserEnergyProfile): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const peakStart = timeToMinutes(profile.peakHoursStart);
  const peakEnd = timeToMinutes(profile.peakHoursEnd);
  const slumpStart = timeToMinutes(profile.energySlumpStart);
  const slumpEnd = timeToMinutes(profile.energySlumpEnd);

  // Morning before peak hours (low energy)
  if (peakStart > 480) {
    // 8:00 AM
    slots.push({
      startTime: '08:00',
      endTime: profile.peakHoursStart,
      duration: (peakStart - 480) / 60,
      energyLevel: 'low',
    });
  }

  // Peak hours (high energy)
  slots.push({
    startTime: profile.peakHoursStart,
    endTime: profile.peakHoursEnd,
    duration: (peakEnd - peakStart) / 60,
    energyLevel: 'high',
  });

  // Between peak and slump (medium energy - assume high for demanding tasks)
  if (slumpStart > peakEnd) {
    slots.push({
      startTime: profile.peakHoursEnd,
      endTime: profile.energySlumpStart,
      duration: (slumpStart - peakEnd) / 60,
      energyLevel: 'high',
    });
  }

  // Energy slump
  slots.push({
    startTime: profile.energySlumpStart,
    endTime: profile.energySlumpEnd,
    duration: (slumpEnd - slumpStart) / 60,
    energyLevel: 'low',
  });

  // Evening after slump (medium energy - high for final push)
  if (slumpEnd < 1380) {
    // 11:00 PM
    slots.push({
      startTime: profile.energySlumpEnd,
      endTime: '23:00',
      duration: (1380 - slumpEnd) / 60,
      energyLevel: 'low',
    });
  }

  return slots;
}

/**
 * Calculates cognitive load score for a task
 * Based on difficulty, importance, and remaining time
 */
export function calculateCognitiveLoad(task: Task): number {
  const today = new Date();
  const dueDate = new Date(task.due_date);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) return 1000; // Overdue task

  // Cognitive load = (Difficulty × Importance) / Days Remaining
  const baseLoad = (task.difficulty * task.importance) / Math.max(1, daysRemaining);

  // Adjust for time estimate (longer tasks are more cognitively demanding)
  const timeMultiplier = Math.min(task.estimated_time / 45, 2); // Normalize to 45-min session
  return baseLoad * timeMultiplier;
}

/**
 * Scores a task-to-timeslot match
 * High intensity tasks score better in high-energy slots
 */
function scoreTaskSlotMatch(task: Task, slot: TimeSlot): number {
  let score = 0;

  if (task.intensity === 'high' && slot.energyLevel === 'high') {
    score += 100;
  } else if (task.intensity === 'low' && slot.energyLevel === 'low') {
    score += 100;
  } else if (task.intensity === 'medium') {
    score += 50;
  } else {
    score -= 30;
  }

  // Bonus if task fits within slot duration
  const requiredTime = Math.ceil(task.estimated_time / 60);
  if (requiredTime <= slot.duration) {
    score += 20;
  }

  return score;
}

/**
 * Optimizes task schedule based on energy levels and cognitive load
 */
export function optimizeSchedule(
  tasks: Task[],
  profile: UserEnergyProfile,
  startDate: Date,
  endDate: Date
): ScheduledTask[] {
  const scheduledTasks: ScheduledTask[] = [];

  // Sort tasks by cognitive load (highest first)
  const sortedTasks = [...tasks].sort(
    (a, b) => calculateCognitiveLoad(b) - calculateCognitiveLoad(a)
  );

  // Generate time slots for multiple days
  const slots = generateTimeSlots(profile);
  const timeSlotsByDay = new Map<string, TimeSlot[]>();

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    timeSlotsByDay.set(dateKey, [...slots]);
  }

  // Assign tasks to optimal slots
  for (const task of sortedTasks) {
    let bestSlot: { date: string; slot: TimeSlot; score: number } | null = null;

    for (const [dateKey, availableSlots] of timeSlotsByDay) {
      const slotDate = new Date(dateKey);
      if (slotDate >= new Date(task.due_date)) continue;

      for (const slot of availableSlots) {
        const score = scoreTaskSlotMatch(task, slot);
        if (!bestSlot || score > bestSlot.score) {
          bestSlot = { date: dateKey, slot, score };
        }
      }
    }

    if (bestSlot) {
      const requiredHours = Math.ceil(task.estimated_time / 60);
      if (bestSlot.slot.duration >= requiredHours) {
        scheduledTasks.push({
          ...task,
          scheduledDate: bestSlot.date,
          scheduledTime: bestSlot.slot.startTime,
          sessionDuration: Math.min(requiredHours * 60, bestSlot.slot.duration * 60),
        });

        // Remove used time from slot
        bestSlot.slot.duration -= requiredHours;
      }
    }
  }

  return scheduledTasks;
}

/**
 * Gets task recommendations for current time
 */
export function getTaskRecommendations(
  tasks: Task[],
  profile: UserEnergyProfile,
  currentTime: Date = new Date()
): Task[] {
  const slots = generateTimeSlots(profile);
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  let currentEnergyLevel: 'high' | 'low' = 'low';
  for (const slot of slots) {
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = timeToMinutes(slot.endTime);
    if (currentMinutes >= slotStart && currentMinutes < slotEnd) {
      currentEnergyLevel = slot.energyLevel;
      break;
    }
  }

  // Filter and sort tasks
  return [...tasks]
    .filter((task) => {
      if (currentEnergyLevel === 'high') {
        return task.intensity !== 'low';
      } else {
        return task.intensity === 'low' || task.intensity === 'medium';
      }
    })
    .sort((a, b) => calculateCognitiveLoad(b) - calculateCognitiveLoad(a))
    .slice(0, 5);
}
