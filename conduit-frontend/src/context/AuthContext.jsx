import { createContext, useContext, useState, useEffect } from 'react';
import agent from '../api/agent';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      agent.Auth.current()
        .then(({ user }) => setCurrentUser(user))
        .catch(() => localStorage.removeItem('jwt'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { user } = await agent.Auth.login(email, password);
    localStorage.setItem('jwt', user.token);
    setCurrentUser(user);
    return user;
  };

  const register = async (username, email, password) => {
    const { user } = await agent.Auth.register(username, email, password);
    localStorage.setItem('jwt', user.token);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
  };

  const updateUser = (user) => {
    localStorage.setItem('jwt', user.token);
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
