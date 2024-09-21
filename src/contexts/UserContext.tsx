'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  session: Session | null;
}

const UserContext = createContext<UserContextType>({ user: null, loading: true, setUser: () => {}, session: null });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((user: User | null, session: Session | null) => {
    setUser(user);
    setSession(session);
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    let authListener: { data: { subscription: { unsubscribe: () => void } } };

    const initializeAuth = async () => {
      const cachedSession = localStorage.getItem('supabase_session');
      if (cachedSession) {
        const parsedSession = JSON.parse(cachedSession);
        if (parsedSession.expires_at > Date.now() / 1000) {
          updateUser(parsedSession.user, parsedSession);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        updateUser(session?.user ?? null, session);
        if (session) {
          localStorage.setItem('supabase_session', JSON.stringify(session));
        }
      }

      authListener = supabase.auth.onAuthStateChange((event, newSession) => {
        if (mounted) {
          updateUser(newSession?.user ?? null, newSession);
          if (newSession) {
            localStorage.setItem('supabase_session', JSON.stringify(newSession));
          } else {
            localStorage.removeItem('supabase_session');
          }
        }
      });
    };

    initializeAuth();

    return () => {
      mounted = false;
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [updateUser]);

  return (
    <UserContext.Provider value={{ user, loading, setUser: (user) => updateUser(user, session), session }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);