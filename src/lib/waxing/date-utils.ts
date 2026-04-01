export function daysSince(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr: string): number {
  return -daysSince(dateStr);
}

export function isTomorrow(dateStr: string): boolean {
  return daysUntil(dateStr) === 1;
}

export function isTodayOrPast(dateStr: string): boolean {
  return daysUntil(dateStr) <= 0;
}

export function isReminderDue(completedAt: string): boolean {
  return daysSince(completedAt) >= 35; // 5주 = 35일
}

export function toDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function weeksAgo(completedAt: string): number {
  return Math.floor(daysSince(completedAt) / 7);
}
