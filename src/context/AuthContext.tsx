import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types/portfolio';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'foliocraft_user_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure not legacy demo user
        if (parsed && parsed.email && !parsed.email.includes('alex.rivera@devfolio.tech')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load user auth', e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const trimmedEmail = email.trim();
    const cleanName = name?.trim() || trimmedEmail.split('@')[0] || 'Developer';
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: trimmedEmail,
      avatar: '',
      role: 'Software Engineer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
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
