// src/hooks/useAvailability.ts
// Hook personnalisé pour gérer le chargement des créneaux disponibles.
import { useCallback, useEffect, useState } from 'react';
import { fetchAvailability } from '../services/api';

interface AvailabilityState {
  slots: string[];
  loading: boolean;
  error?: string;
}

export function useAvailability(date: string | null, peopleCount: number): AvailabilityState {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const loadSlots = useCallback(async () => {
    if (!date) {
      setSlots([]);
      return;
    }
    try {
      setLoading(true);
      setError(undefined);
      const data = await fetchAvailability(date, peopleCount);
      setSlots(data);
    } catch (_error) {
      setError("Impossible de récupérer les créneaux. Réessayez plus tard.");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [date, peopleCount]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  return { slots, loading, error };
}
