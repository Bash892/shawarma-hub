import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('tasty_token');
    const savedUser = localStorage.getItem('tasty_user');
    if (savedToken && savedUser) {
      try {
        setAuth({
          token: savedToken,
          user: JSON.parse(savedUser),
        });
      } catch {
        localStorage.removeItem('tasty_token');
        localStorage.removeItem('tasty_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ email, password, expectedRole }) => {
    const data = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, expectedRole }),
    });

    setAuth({ token: data.token, user: data.user });
    localStorage.setItem('tasty_token', data.token);
    localStorage.setItem('tasty_user', JSON.stringify(data.user));
  };

  const registerUser = async ({ name, email, password }) => {
    const data = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    setAuth({ token: data.token, user: data.user });
    localStorage.setItem('tasty_token', data.token);
    localStorage.setItem('tasty_user', JSON.stringify(data.user));
  };

  const registerAdmin = async ({ name, email, password, adminSecret }) => {
    const data = await apiFetch('/api/auth/admin-register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, adminSecret }),
    });

    setAuth({ token: data.token, user: data.user });
    localStorage.setItem('tasty_token', data.token);
    localStorage.setItem('tasty_user', JSON.stringify(data.user));
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('tasty_token');
    localStorage.removeItem('tasty_user');
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        loading,
        login,
        registerUser,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
