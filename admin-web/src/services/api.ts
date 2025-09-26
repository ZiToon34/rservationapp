// src/services/api.ts
// Service Axios pour communiquer avec l'API sécurisée.
import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  Reservation,
  ReservationForm,
  Settings,
  Schedule,
  SpecialDay,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// On stocke le token courant en mémoire pour les requêtes.
let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });
  return data.data;
}

export async function fetchReservations(date: string): Promise<Reservation[]> {
  const { data } = await apiClient.get<ApiResponse<Reservation[]>>('/admin/reservations', {
    params: { date },
  });
  return data.data;
}

export async function createAdminReservation(values: ReservationForm): Promise<Reservation> {
  const { data } = await apiClient.post<ApiResponse<Reservation>>('/admin/reservations', values);
  return data.data;
}

export async function deleteReservation(id: string): Promise<void> {
  await apiClient.delete(`/admin/reservations/${id}`);
}

export async function fetchSettings(): Promise<Settings> {
  const { data } = await apiClient.get<ApiResponse<Settings>>('/admin/settings');
  return data.data;
}

export async function updateSettings(values: Settings): Promise<Settings> {
  const { data } = await apiClient.put<ApiResponse<Settings>>('/admin/settings', values);
  return data.data;
}

export async function fetchSchedules(): Promise<Schedule[]> {
  const { data } = await apiClient.get<ApiResponse<Schedule[]>>('/admin/schedules');
  return data.data;
}

export async function updateSchedule(dayOfWeek: number, payload: Partial<Schedule>): Promise<Schedule> {
  const { data } = await apiClient.put<ApiResponse<Schedule>>(`/admin/schedules/${dayOfWeek}`, payload);
  return data.data;
}

export async function fetchSpecialDays(params?: { from?: string; to?: string }): Promise<SpecialDay[]> {
  const { data } = await apiClient.get<ApiResponse<SpecialDay[]>>('/admin/special-days', {
    params,
  });
  return data.data;
}

export async function upsertSpecialDay(day: { date: string; isOpen: boolean }): Promise<SpecialDay> {
  const { data } = await apiClient.post<ApiResponse<SpecialDay>>('/admin/special-days', day);
  return data.data;
}

export async function deleteSpecialDay(id: string): Promise<void> {
  await apiClient.delete(`/admin/special-days/${id}`);
}

export async function triggerManualPurge(): Promise<void> {
  await apiClient.post('/admin/maintenance/purge');
}
