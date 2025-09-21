import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: 'u_1',
    name: 'Alice Owner',
    email: 'owner@example.com',
    phone: '+94123456789',
    role: 'owner',
    avatarUrl: 'https://picsum.photos/seed/u1/100/100',
    passwordHash: 'password123',
  },
  {
    id: 'u_2',
    name: 'Bob Client',
    email: 'client@example.com',
    phone: '+94987654321',
    role: 'client',
    avatarUrl: 'https://picsum.photos/seed/u2/100/100',
    passwordHash: 'password123',
  },
  {
    id: 'u_3',
    name: 'Charlie Owner',
    email: 'charlie@example.com',
    phone: '+94112233445',
    role: 'owner',
    avatarUrl: 'https://picsum.photos/seed/u3/100/100',
    passwordHash: 'password123',
  },
  {
    id: 'u_4',
    name: 'Diana Client',
    email: 'diana@example.com',
    phone: '+94556677889',
    role: 'client',
    avatarUrl: 'https://picsum.photos/seed/u4/100/100',
    passwordHash: 'password123',
  },
];

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  signUp: (user: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const foundUser = mockUsers.find(u => u.email === email && u.passwordHash === password);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setUser(null);
  };

  const signUp = async (newUser: Omit<User, 'id'>) => {
    const newUserWithId = { ...newUser, id: `u_${mockUsers.length + 1}` };
    mockUsers.push(newUserWithId);
    setUser(newUserWithId);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, signUp }}>
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
