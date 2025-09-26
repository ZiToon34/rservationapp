// src/context/AuthContext.tsx
// Contexte global pour gérer l'authentification de l'administrateur.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthResponse } from '../types';
import { login as apiLogin, setAuthToken } from '../services/api';

interface AuthState {
  token: string | null;
  adminEmail: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = 'admin-dashboard-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, adminEmail: null, loading: true });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { token: string; adminEmail: string };
        setAuthToken(parsed.token);
        setState({ token: parsed.token, adminEmail: parsed.adminEmail, loading: false });
      } catch (_error) {
        localStorage.removeItem(STORAGE_KEY);
        setState({ token: null, adminEmail: null, loading: false });
      }
    } else {
      setState({ token: null, adminEmail: null, loading: false });
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    async login(email: string, password: string) {
      const result: AuthResponse = await apiLogin(email, password);
      setAuthToken(result.token);
      const payload = { token: result.token, adminEmail: result.admin.email };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setState({ token: result.token, adminEmail: result.admin.email, loading: false });
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setState({ token: null, adminEmail: null, loading: false });
    },
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
