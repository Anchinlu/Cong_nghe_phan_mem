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

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tạo Provider Component - "Bộ não" chính
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Hàm này sẽ chạy một lần khi app được tải, để kiểm tra xem có token cũ trong localStorage không
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        // Giải mã phần payload của token để lấy thông tin user
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        setUser({ id: payload.sub, email: payload.email, role: payload.role });
        setToken(storedToken);
      } catch (e) {
        // Nếu token không hợp lệ, xóa nó đi
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  const login = (newToken: string) => {
    // Lưu token vào localStorage để "ghi nhớ" đăng nhập
    localStorage.setItem('accessToken', newToken);
    setToken(newToken);
    try {
      // Giải mã token để lấy thông tin user và cập nhật state
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: payload.sub, email: payload.email, role: payload.role });
    } catch (e) {
      setUser(null);
    }
  };

  const logout = () => {
    // Xóa token khỏi localStorage
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