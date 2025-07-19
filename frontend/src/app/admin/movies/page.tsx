"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  durationMinutes: number;
}

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap'); 
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const fetchMovies = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`);
          if (!res.ok) throw new Error('Không thể tải danh sách phim.');
          const data = await res.json();
          setMovies(data);
        } catch (err: unknown) {
          if (err instanceof Error) setError(err.message);
          else setError('Lỗi không xác định');
        } finally {
          setIsLoading(false);
        }
      };
      void fetchMovies();
    }
  }, [user]);

  const handleDelete = async (movieId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa bộ phim này không?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Xóa phim không thành công.');
        }
        setMovies(movies.filter(movie => movie.id !== movieId));
        alert('Đã xóa phim thành công!');
      } catch (err: unknown) {
        if (err instanceof Error) alert(err.message);
        else alert('Lỗi không xác định');
      }
    }
  };

  if (isLoading) return <div className="text-center text-white py-20">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>;
  if (user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/admin/dashboard" className="block hover:bg-gray-700 rounded px-3 py-2">
            Dashboard
          </Link>
          <Link href="/admin/movies" className="block bg-gray-700 rounded px-3 py-2 font-bold">
            Quản Lý Phim
          </Link>
          <Link href="/admin/showtimes" className="block hover:bg-gray-700 rounded px-3 py-2">
            Quản Lý Suất Chiếu
          </Link>
          <Link href="/admin/theaters" className="block hover:bg-gray-700 rounded px-3 py-2">
            Quản Lý Rạp
          </Link>
          <Link href="/admin/users" className="block hover:bg-gray-700 rounded px-3 py-2">
            Quản Lý Người Dùng
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Quản Lý Phim</h1>
          <Link 
            href="/admin/movies/new"
            className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
          >
            Thêm Phim Mới
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Tên Phim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ngày Phát Hành</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4">{movie.id}</td>
                  <td className="px-6 py-4 font-medium">{movie.title}</td>
                  <td className="px-6 py-4">{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link href={`/admin/movies/edit/${movie.id}`} className="text-sky-400 hover:text-sky-300 mr-4">
                      Sửa
                    </Link>
                    <button 
                      onClick={() => handleDelete(movie.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
