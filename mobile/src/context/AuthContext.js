import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '../services/api';
import { deleteToken, setToken } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await deleteToken();
      setAuthToken(null);
      setUser(null);
      setLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    await setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (ime, email, password, password_confirmation) => {
    const data = await api.register({ ime, email, password, password_confirmation });
    await setToken(data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // token may already be invalid
    }
    await deleteToken();
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
