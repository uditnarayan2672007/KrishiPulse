import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check local storage for persistent demo user
    const savedDemo = localStorage.getItem('krishipulse_demo_user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setIsDemoUser(true);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('krishipulse_demo_user');
      }
    }

    if (isSupabaseConfigured) {
      // Real Supabase session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // If Supabase not yet configured, provide demo user default
      const defaultUser = {
        id: 'kp-farmer-001',
        email: 'farmer@krishipulse.org',
        user_metadata: { fullName: 'Ramesh Patel' },
        role: 'FARMER',
      };
      setUser(defaultUser);
      setIsDemoUser(true);
      setLoading(false);
    }
  }, []);

  const loginWithDemo = (customName = 'Ramesh Patel', email = 'farmer@krishipulse.org') => {
    const demoUser = {
      id: 'demo-user-' + Date.now(),
      email,
      user_metadata: { fullName: customName },
      role: 'FARMER',
    };
    setUser(demoUser);
    setIsDemoUser(true);
    localStorage.setItem('krishipulse_demo_user', JSON.stringify(demoUser));
    return { success: true };
  };

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      return loginWithDemo('Agricultural Demo User', email);
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsDemoUser(false);
    localStorage.removeItem('krishipulse_demo_user');
    return data;
  };

  const register = async (email, password, fullName) => {
    if (!isSupabaseConfigured) {
      return loginWithDemo(fullName || 'New Farmer', email);
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName },
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setIsDemoUser(false);
    localStorage.removeItem('krishipulse_demo_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemoUser,
        isSupabaseConfigured,
        login,
        register,
        loginWithDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
