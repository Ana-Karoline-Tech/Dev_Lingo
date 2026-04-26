import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const mapUser = (supabaseUser: User): AuthUser => ({
      id: supabaseUser.id,
      email: supabaseUser.email ?? '',
      name:
        (typeof supabaseUser.user_metadata?.name === 'string' && supabaseUser.user_metadata.name) ||
        (supabaseUser.email?.split('@')[0] ?? 'Usuário'),
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser ? mapUser(sessionUser) : null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser ? mapUser(sessionUser) : null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = (nextUser: AuthUser): void => {
    setUser(nextUser);
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading]
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }

  return context;
}
