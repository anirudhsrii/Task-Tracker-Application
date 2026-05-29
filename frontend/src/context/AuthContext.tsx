import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5002').replace(/\/$/, '');

// Custom hook for easier consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (userData: any) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
  };

  const register = async (userData: any) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;