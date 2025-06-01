
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Firebase auth instance

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signUpWithEmail: (email: string, pass: string) => Promise<User | null>;
  signInWithEmail: (email: string, pass: string) => Promise<User | null>;
  logout: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>; // Allow manual user setting if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Represents initial auth state resolution

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth state resolved
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User | null> => {
    // No longer sets context's loading state; page component handles its own button loading state
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); // Update context user state for immediate feedback
      // onAuthStateChanged will also fire and set the user
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return null;
    }
  };

  const signUpWithEmail = async (email: string, pass: string): Promise<User | null> => {
    // No longer sets context's loading state
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(result.user); // Update context user state for immediate feedback
      return result.user;
    } catch (error: any) {
      console.error('Email sign-up error:', error);
      throw error; // Re-throw to be caught by the form
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<User | null> => {
    // No longer sets context's loading state
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      setUser(result.user); // Update context user state for immediate feedback
      return result.user;
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      throw error; // Re-throw to be caught by the form
    }
  };

  const logout = async (): Promise<void> => {
    // No longer sets context's loading state
    try {
      await firebaseSignOut(auth);
      setUser(null); // Update context user state for immediate feedback
      // onAuthStateChanged will also fire and set user to null
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
