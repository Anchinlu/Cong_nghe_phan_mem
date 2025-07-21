"use client";

import Link from 'next/link';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
  </svg>
);

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center gap-4">

        <Link href="/" className="text-2xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
          CineBooking
        </Link>

        <div className="flex items-center gap-4">
      
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

          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}>
              <HamburgerIcon />
            </button>
          </div>

          <UserMenu />
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-gray-800 rounded-lg p-4">
          <nav className="flex flex-col gap-3 text-base font-medium">
            <Link href="/" className="hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
            <Link href="/cum-rap" className="hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Cụm Rạp</Link>
            <Link href="/gia-ve" className="hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Giá Vé</Link>
            <Link href="/tin-tuc" className="hover:text-sky-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Tin Tức</Link>
            {user && user.role === 'admin' && (
              <Link href="/admin/dashboard" className="text-yellow-400 font-bold hover:text-yellow-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Quản Lý Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
