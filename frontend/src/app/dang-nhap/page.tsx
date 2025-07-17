// file: frontend/src/app/dang-nhap/page.tsx
"use client"; 

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

   const { login } = useAuth(); 
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setError('');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
     
      throw new Error(data.message || 'Đã có lỗi xảy ra khi đăng nhập.');
    }
        login(data.access_token);
        router.push('/'); 
    
    console.log('Đăng nhập thành công, nhận được token:', data.access_token);
    alert('Đăng nhập thành công!');

  } catch (err: unknown) {
    if (err instanceof Error) {
        setError(err.message);
    } else {
        setError('Đã có lỗi xảy ra.');
    }
}
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Chưa có tài khoản?{' '}
            <Link href="/dang-ky" className="font-medium text-sky-400 hover:text-sky-300">
              Đăng ký tại đây
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Vùng cho Email */}
          <div className="relative">
            <label htmlFor="email" className="text-sm font-bold text-gray-400 tracking-wide">
              Địa chỉ email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="nhapemail@gmail.com"
            />
          </div>

          {/* Vùng cho Mật khẩu */}
          <div className="mt-8 content-center">
            <label htmlFor="password" className="text-sm font-bold text-gray-400 tracking-wide">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Nhập mật khẩu"
            />
          </div>
          {/* Thêm dòng này để hiển thị lỗi */}
            {error && (
             <p className="text-sm text-red-500 text-center font-medium">{error}</p>
            )}
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}