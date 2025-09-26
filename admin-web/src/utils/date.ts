// src/utils/date.ts
// Fonctions utilitaires time-zone pour l'interface admin.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/fr';
import type { Schedule, SpecialDay } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('fr');

const PARIS_TZ = 'Europe/Paris';

export function todayParis() {
  return dayjs().tz(PARIS_TZ).startOf('day');
}

export function toIsoDate(date: dayjs.Dayjs): string {
  return date.tz(PARIS_TZ).format('YYYY-MM-DD');
}

export function generateMonthGrid(month: dayjs.Dayjs): dayjs.Dayjs[] {
  const start = month.startOf('month');
  const first = start.subtract((start.day() + 6) % 7, 'day');
  return Array.from({ length: 42 }, (_, index) => first.add(index, 'day'));
}

export function isDateOpenByDefault(date: dayjs.Dayjs, schedules: Schedule[]): boolean {
  const daySchedule = schedules.find((item) => item.dayOfWeek === date.day());
  return daySchedule ? daySchedule.isOpen : false;
}

export function overrideWithSpecialDay(
  date: dayjs.Dayjs,
  specialDays: SpecialDay[],
): boolean | null {
  const found = specialDays.find((item) => date.isSame(item.date, 'day'));
  if (!found) return null;
  return found.isOpen;
}

export { dayjs };
