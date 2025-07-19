"use client";

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Stats {
  movieCount: number;
  showtimeCount: number;
  theaterCount: number;
  userCount: number;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap');
    } else if (user.role !== 'admin') {
      router.push('/');
    } else if (token) {
      const fetchStats = async () => {
        try {
          const res = await fetch('http://localhost:8080/admin/stats', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error('Không thể tải dữ liệu thống kê');
          const data = await res.json();
          setStats(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      void fetchStats();
    }
  }, [user, token, router]);

  if (isLoading) {
    return <div className="text-center text-gray-800 py-20">Đang tải trang quản trị...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <Link href="/admin/dashboard" className="hover:bg-gray-700 rounded-md p-2 transition">Dashboard</Link>
        <Link href="/admin/movies" className="hover:bg-gray-700 rounded-md p-2 transition">Quản Lý Phim</Link>
        <Link href="/admin/showtimes" className="hover:bg-gray-700 rounded-md p-2 transition">Quản Lý Suất Chiếu</Link>
        <Link href="/admin/theaters" className="hover:bg-gray-700 rounded-md p-2 transition">Quản Lý Rạp</Link>
        <Link href="/admin/users" className="hover:bg-gray-700 rounded-md p-2 transition">Quản Lý Người Dùng</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bảng Điều Khiển</h1>

        {/* Thống kê chính */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Phim</h2>
            <p className="text-3xl font-bold text-sky-500">{stats?.movieCount ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Suất Chiếu</h2>
            <p className="text-3xl font-bold text-sky-500">{stats?.showtimeCount ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Rạp</h2>
            <p className="text-3xl font-bold text-sky-500">{stats?.theaterCount ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-lg font-semibold text-gray-600">Người Dùng</h2>
            <p className="text-3xl font-bold text-sky-500">{stats?.userCount ?? 0}</p>
          </div>
        </div>

        {/* Bảng chi tiết nhanh */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Thống Kê Nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Tỉ lệ sử dụng hệ thống</p>
              <p className="text-xl font-bold text-sky-600">42%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Phim mới trong tháng</p>
              <p className="text-xl font-bold text-sky-600">+5</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 text-sm">Rạp hoạt động</p>
              <p className="text-xl font-bold text-sky-600">{stats?.theaterCount ?? 0}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
