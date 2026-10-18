import React, { createContext, useContext, useState, useEffect } from 'react';
import * as dataService from '../services/dataService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const session = dataService.getCurrentSession();
        if (session && session.userId) {
          const profile = await dataService.getUserById(session.userId);
          if (profile) {
            setUser({
              ...profile,
              token: session.token
            });
          } else {
            dataService.logoutUser();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const session = await dataService.loginUser(email, password);
    const profile = await dataService.getUserById(session.userId);
    const fullUser = { ...profile, token: session.token };
    setUser(fullUser);
    return fullUser;
  };

  const signup = async (name, email, password) => {
    const session = await dataService.createUser(name, email, password);
    const profile = await dataService.getUserById(session.userId);
    const fullUser = { ...profile, token: session.token };
    setUser(fullUser);
    return fullUser;
  };

  const logout = () => {
    dataService.logoutUser();
    setUser(null);
  };

  const updateProfile = async ({ name }) => {
    if (!user) throw new Error('Not logged in');
    const updated = await dataService.updateUserProfile(user.id, { name });
    setUser(prev => ({ ...prev, name: updated.name }));
    return updated;
  };

  const changePassword = async (currentPass, newPass) => {
    if (!user) throw new Error('Not logged in');
    return await dataService.changeUserPassword(user.id, currentPass, newPass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
