// file: frontend/src/components/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Cột 1: Giới thiệu và Logo */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-sky-400 mb-4">CineBooking</h3>
            <p className="text-sm">
              Trải nghiệm đặt vé xem phim nhanh chóng và tiện lợi. Luôn cập nhật những bộ phim hay nhất tại các rạp trên toàn quốc.
            </p>
          </div>

          {/* Cột 2: Về chúng tôi */}
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider">Về CineBooking</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gioi-thieu" className="hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link href="/tuyen-dung" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link href="/lien-he" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
          
          {/* Cột 3: Chăm sóc khách hàng */}
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li><p>Hotline: 1900 9999</p></li>
              <li><p>Email: support@cinebooking.com</p></li>
              <li><p>Giờ làm việc: 8:00 - 22:00</p></li>
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div>
            <h4 className="font-semibold text-white mb-4 tracking-wider">Kết nối</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
                {/* SVG Icon for Facebook */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
                {/* SVG Icon for Instagram */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.441-.645 1.441-1.44s-.646-1.44-1.441-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dòng Copyright ở dưới cùng */}
      <div className="bg-black py-4">
        <p className="container mx-auto text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CineBooking Project | Đồ án kết thúc học phần Công nghệ phần mềm.
        </p>
      </div>
    </footer>
  );
}