// src/types/index.ts
// Types partagés par l'interface d'administration web.
export interface AuthResponse {
  token: string;
  admin: {
    id: string;
    email: string;
  };
}

export interface Reservation {
  _id: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  peopleCount: number;
  comment?: string;
  source: 'client' | 'admin';
  createdAt: string;
}

export interface ReservationForm {
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  peopleCount: number;
  comment?: string;
}

export interface Settings {
  capacityMode: 'total' | 'tables';
  totalCapacity?: number;
  tables: Array<{ tableNumber: number; seats: number }>;
  maxPeoplePerReservation: number;
  reservationDelayMin: number;
  reservationDelayMax: number;
}

export interface ScheduleWindow {
  start: string;
  end: string;
}

export interface Schedule {
  _id: string;
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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
