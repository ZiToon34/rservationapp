// src/utils/date.ts
// Fonctions utilitaires pour manipuler les dates avec dayjs.
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/fr';
import type { CalendarData } from '../types';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('fr');

const PARIS_TZ = 'Europe/Paris';

export function todayParis(): dayjs.Dayjs {
  return dayjs().tz(PARIS_TZ).startOf('day');
}

export function toIsoDate(date: dayjs.Dayjs): string {
  return date.tz(PARIS_TZ).format('YYYY-MM-DD');
}

export function formatDisplayDate(date: dayjs.Dayjs): string {
  return date.tz(PARIS_TZ).format('dddd DD MMMM YYYY');
}

export function generateMonthGrid(currentMonth: dayjs.Dayjs): dayjs.Dayjs[] {
  const monthStart = currentMonth.startOf('month');
  const firstDayOfGrid = monthStart.subtract((monthStart.day() + 6) % 7, 'day');
  return Array.from({ length: 42 }, (_, index) => firstDayOfGrid.add(index, 'day'));
}

export function isDateOpen(date: dayjs.Dayjs, calendar: CalendarData): boolean {
  const schedule = calendar.schedules.find((item) => item.dayOfWeek === date.day());
  if (!schedule) {
    return false;
  }
  const special = calendar.specialDays.find((item) => date.isSame(item.date, 'day'));
  if (special) {
    return special.isOpen;
  }
  return schedule.isOpen;
}

export { dayjs, PARIS_TZ };
