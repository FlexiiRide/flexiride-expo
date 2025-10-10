import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User } from '@/types';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (user: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Login error:', errorData);
        return false;
      }

      const { accessToken: receiveAccessToken, refreshToken: receiveRefreshToken, user: receiveUser } = await res.json();
      setUser(receiveUser);
      setAccessToken(receiveAccessToken);
      setRefreshToken(receiveRefreshToken);
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const signUp = useCallback(async (newUser: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Signup error:', errorData);
        return false;
      }

      const { accessToken: receiveAccessToken, refreshToken: receiveRefreshToken, user: newUserWithId } = await res.json();
      setUser(newUserWithId);
      setAccessToken(receiveAccessToken);
      setRefreshToken(receiveRefreshToken);
      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, loading, signIn, signOut, signUp }}>
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
