import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { initialUsers } from '../mock/initialData';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password?: string) => boolean;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  hasPermission: (permission: string) => boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('interior_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('interior_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged in as Owner for seamless first preview
    return initialUsers[0];
  });

  useEffect(() => {
    localStorage.setItem('interior_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('interior_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('interior_active_user');
    }
  }, [currentUser]);

  const login = (username: string): boolean => {
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      return;
    }
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return permission === 'catalog'; // Guest can only view catalog
    if (currentUser.role === 'owner' || currentUser.permissions.includes('all')) return true;
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      loginAsRole,
      logout,
      addUser,
      updateUser,
      deleteUser,
      hasPermission,
      isGuest: !currentUser
    }}>
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
