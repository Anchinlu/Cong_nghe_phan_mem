// frontend/src/components/UserMenu.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const HamburgerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition-colors"
        aria-label="User Menu"
      >
        <HamburgerIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                Chào, {user.email}
              </div>
              <Link href="/lich-su-dat-ve" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Vé của tôi
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  router.push('/');
                }}
                className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Đăng nhập
              </Link>
              <Link href="/dang-ky" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}