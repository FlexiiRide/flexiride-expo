import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (user: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = async ({ children }: { children: ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);


  const signIn = async (email: string, password: string) => {

    try {
      const res = await fetch(`${API_BASE_URL}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // if backend sets cookies
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Login error:', errorData);
        return false;
        //return { errors: { server: [errorData.message || 'Invalid credentials'] } };
      }

      // Handle JWT
      const { token: receiveToken, user: receiveUser } = await res.json();
      setUser(receiveUser);
      setToken(receiveToken);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      //return { errors: { server: ['Something went wrong.'] } };
      return false;
    }


  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  const signUp = async (newUser: Omit<User, 'id'>) => {

    try {
      const res = await fetch(`${API_BASE_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser.name, email: newUser.email, password: newUser.password }),
        credentials: 'include', // if backend sets cookies
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Login error:', errorData);
        return false;
      }

      // Handle JWT
      const { token: receiveToken, user: newUserWithId } = await res.json();
      setUser(newUserWithId);
      setToken(receiveToken);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      //return { errors: { server: ['Something went wrong.'] } };
      return false;
    }

  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, signUp }}>
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
