// frontend/src/components/Header.tsx
"use client";
import Link from 'next/link';
import UserMenu from './UserMenu'; 

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

export default function Header() {
  
  return (
    <header className="bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center gap-4">

        <Link href="/" className="text-2xl font-bold text-sky-400 hover:text-sky-300 transition-colors">
          CineBooking
        </Link>


        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-sky-400 transition-colors">Trang chủ</Link>
          <Link href="/phim" className="hover:text-sky-400 transition-colors">Phim</Link>
          <Link href="/cum-rap" className="hover:text-sky-400 transition-colors">Cụm Rạp</Link>
          <Link href="/tin-tuc" className="hover:text-sky-400 transition-colors">Tin Tức</Link>
        </nav>


        <div className="flex items-center gap-4">

          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Tìm kiếm phim..."
              className="bg-gray-700 rounded-full px-4 py-2 pl-10 text-sm w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}