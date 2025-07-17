// file: frontend/src/app/dang-ky/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
       
        const errorMessage = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(errorMessage || 'Đã có lỗi xảy ra khi đăng ký.');
      }

     
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/dang-nhap');

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
            Tạo tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Đã có tài khoản?{' '}
            <Link href="/dang-nhap" className="font-medium text-sky-400 hover:text-sky-300">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Ô Họ và Tên */}
          <div>
            <label htmlFor="fullName" className="text-sm font-bold text-gray-400 tracking-wide">
              Họ và tên
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* Ô Email */}
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-400 tracking-wide">
              Địa chỉ email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="nhapemail@gmail.com"
            />
          </div>

          {/* Ô Mật khẩu */}
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-400 tracking-wide">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-base text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ít nhất 6 ký tự"
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500 text-center font-medium">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500"
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}