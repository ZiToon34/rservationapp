// src/services/api.ts
// Centralise les appels vers l'API Express.
import axios from 'axios';
import type {
  ApiResponse,
  CalendarData,
  PublicSettings,
  ReservationFormValues,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Récupère les paramètres publics (max personnes, délais...)
export async function fetchPublicSettings(): Promise<PublicSettings> {
  const { data } = await apiClient.get<ApiResponse<PublicSettings>>('/public/settings');
  return data.data;
}

// Récupère les informations d'ouverture (horaires + jours spéciaux)
export async function fetchCalendar(): Promise<CalendarData> {
  const { data } = await apiClient.get<ApiResponse<CalendarData>>('/public/calendar');
  return data.data;
}

// Récupère les créneaux disponibles pour une date et un nombre de personnes
export async function fetchAvailability(date: string, peopleCount: number): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/public/availability', {
    params: { date, peopleCount },
  });
  return data.data;
}

// Envoie une nouvelle réservation côté client
export async function createReservation(values: ReservationFormValues): Promise<string> {
  const { data } = await apiClient.post<ApiResponse<{ id: string }>>('/public/reservations', values);
  return data.data.id;
}
