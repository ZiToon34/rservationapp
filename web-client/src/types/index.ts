// src/types/index.ts
// Définition des types partagés dans l'application web.
export interface PublicSettings {
  maxPeoplePerReservation: number;
  reservationDelayMin: number;
  reservationDelayMax: number;
}

export interface ScheduleWindow {
  start: string;
  end: string;
}

export interface Schedule {
  dayOfWeek: number;
  lunch: ScheduleWindow;
  dinner: ScheduleWindow;
  isOpen: boolean;
}

export interface SpecialDay {
  _id: string;
  date: string;
  isOpen: boolean;
}

export interface CalendarData {
  schedules: Schedule[];
  specialDays: SpecialDay[];
}

export interface AvailabilityResponse {
  success: boolean;
  data: string[];
}

export interface ReservationFormValues {
  date: string;
  time: string;
  peopleCount: number;
  name: string;
  email: string;
  phone: string;
  comment?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
