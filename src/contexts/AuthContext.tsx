import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/services/supabaseClient';
import type { User } from '@/types';

type AuthContextValue = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        console.log('[Auth] init: calling supabase.auth.getUser()');
        const { data, error } = await supabase.auth.getUser();
        console.log('[Auth] getUser result:', { data, error });
        if (!mounted) return;
        if (data?.user) {
          const u = data.user;
          setUser({
            id: u.id,
            email: u.email ?? undefined,
            name: (u.user_metadata as any)?.name ?? undefined,
            avatar_url: (u.user_metadata as any)?.avatar_url ?? undefined,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] init error', err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] onAuthStateChange', { event, session });
      if (!mounted) return;
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          email: u.email ?? undefined,
          name: (u.user_metadata as any)?.name ?? undefined,
          avatar_url: (u.user_metadata as any)?.avatar_url ?? undefined,
        });
      } else {
        setUser(null);
      }
    });
    const subscription = (data as any)?.subscription;

    return () => {
      mounted = false;
      try {
        if (subscription?.unsubscribe) subscription.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return <AuthContext.Provider value={{ user, setUser, loading}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
