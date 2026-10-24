import { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, payload) => {
    const res = await api.post(path, { user: payload });
    localStorage.setItem('token', res.headers.authorization);
    setUser(res.data.user);
  };

  const login = (email, password) => authenticate('/login', { email, password });
  const signup = (email, password, password_confirmation) =>
    authenticate('/signup', { email, password, password_confirmation });

  const logout = async () => {
    try {
      await api.delete('/logout');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
