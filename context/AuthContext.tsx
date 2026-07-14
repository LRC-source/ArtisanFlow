
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, MembershipTier } from '../types';
import { db, Collections } from '../services/dataLayer';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasTier: (tier: MembershipTier) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Simulate fetching the authenticated user
    const loadUser = async () => {
      const users = await db.list<UserProfile>(Collections.USERS);
      if (users.length > 0) {
        setUser(users[0]);
      } else {
        // Create default admin if none exists
        const newUser: Omit<UserProfile, 'id' | 'created_date' | 'updated_date' | 'created_by'> = {
          fullName: 'Alex Artisan',
          email: 'admin@lrcflow.com',
          role: UserRole.ADMIN,
          notificationsEnabled: true
        };
        const created = await db.create<UserProfile>(Collections.USERS, newUser);
        setUser(created);
      }
    };
    loadUser();
  }, []);

  const login = () => {
    // In a real app, this would trigger Google Auth
    console.log('Login triggered');
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (role: UserRole) => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true; // Admin has all permissions
    return user.role === role;
  };

  const hasTier = (tier: MembershipTier) => {
    // This logic would check against the BusinessProfile tier
    // For now, we assume the user has access based on their profile settings
    return true; 
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole, hasTier }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
