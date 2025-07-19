// frontend/src/components/Header.tsx
"use client";

import Link from 'next/link';
import UserMenu from './UserMenu'; 
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center gap-4">

        <Link href="/" className="text-2xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
          CineBooking
        </Link>

        <div className="flex items-center gap-6">

          <nav className="hidden lg:flex items-center gap-6 text-lg font-normal pr-6">
            <Link href="/" className="hover:text-sky-400 transition-colors">Trang chủ</Link>
            <Link href="/cum-rap" className="hover:text-sky-400 transition-colors">Cụm Rạp</Link>
            <Link href="/gia-ve" className="hover:text-sky-400 transition-colors">Giá Vé</Link>
            <Link href="/tin-tuc" className="hover:text-sky-400 transition-colors">Tin Tức</Link>
             {user && user.role === 'admin' && (
            <Link href="/admin/dashboard" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors">
              Quản Lý Admin
            </Link>
          )}
          </nav>

          <UserMenu />
        </div>

      </div>
    </header>
  );
}
