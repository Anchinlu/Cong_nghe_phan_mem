// file: frontend/src/components/Header.tsx

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 bg-opacity-80 text-white p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Phần Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
          CineBooking
        </Link>

        {/* Phần Menu Điều Hướng - Tạm thời ẩn trên màn hình nhỏ */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Trang chủ</Link>
          <Link href="/lich-chieu" className="hover:text-yellow-400 transition-colors">Lịch Chiếu</Link>
          <Link href="/phim" className="hover:text-yellow-400 transition-colors">Phim</Link>
        </nav>

        {/* Phần Đăng nhập */}
        <Link href="/dang-nhap" className="bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">
          Đăng nhập
        </Link>
      </div>
    </header>
  );
}