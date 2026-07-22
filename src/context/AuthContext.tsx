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

  // STRICT AUTH STATE: Default is NULL (No pre-logged user, no default owner fallback!)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      // Check active session in sessionStorage
      const sessionUser = sessionStorage.getItem('interior_active_user_session');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }
    } catch (e) {
      // Fallback null
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('interior_users', JSON.stringify(users));
  }, [users]);

  // Sync session state strictly to sessionStorage (purged on logout & tab close)
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('interior_active_user_session', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('interior_active_user_session');
      localStorage.removeItem('interior_active_user');
      localStorage.removeItem('interior_active_user_session');
    }
  }, [currentUser]);

  const login = (username: string, password?: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const found = users.find(u => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser);
    if (found) {
      // Set authenticated user
      setCurrentUser(found);
      sessionStorage.setItem('interior_active_user_session', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const loginAsRole = (role: UserRole) => {
    if (role === 'guest') {
      logout();
      return;
    }
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      sessionStorage.setItem('interior_active_user_session', JSON.stringify(found));
    }
  };

  // ZERO MISTAKE LOGOUT: Completely purge all auth tokens & state
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('interior_active_user_session');
    sessionStorage.clear();
    localStorage.removeItem('interior_active_user');
    localStorage.removeItem('interior_active_user_session');
  };

  const addUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (updated: User) => {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    if (currentUser?.id === updated.id) {
      setCurrentUser(updated);
      sessionStorage.setItem('interior_active_user_session', JSON.stringify(updated));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false; // Unauthenticated has ZERO permissions
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
