// file: frontend/src/contexts/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho user được giải mã từ token
interface User {
  id: number;
  email: string;
  role: string;
}

// Định nghĩa kiểu cho những gì Context sẽ cung cấp
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ id: payload.sub, email: payload.email, role: payload.role });
        setToken(storedToken);
      } catch { 
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const login = (newToken: string) => {
   
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    try {
      
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: payload.sub, email: payload.email, role: payload.role });
    } catch { 
      setUser(null);
    }
  };

  const logout = () => {
    
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Tạo một custom hook để dễ dàng sử dụng context ở các component khác
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}