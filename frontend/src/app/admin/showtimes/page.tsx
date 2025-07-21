"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Movie { id: number; title: string; }
interface Auditorium { id: number; name: string; theater: { id: number; name: string; }; }
interface Showtime {
  id: number;
  startTime: string;
  movie: { title: string; };
  auditorium: { name: string; theater: { name: string; }; };
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);

  const [newShowtime, setNewShowtime] = useState({ movieId: '', auditoriumId: '', startTime: '' });
  const [filter, setFilter] = useState({ theaterId: '', date: '' });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'admin') {
      if (!user) router.push('/dang-nhap');
      else router.push('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [showtimesRes, moviesRes, auditoriumsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/showtimes`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/auditoriums`)
        ]);

        if (!showtimesRes.ok || !moviesRes.ok || !auditoriumsRes.ok) {
          throw new Error('Không thể tải dữ liệu cần thiết.');
        }

        const showtimesData = await showtimesRes.json();
        const moviesData = await moviesRes.json();
        const auditoriumsData = await auditoriumsRes.json();

        setShowtimes(showtimesData);
        setMovies(moviesData);
        setAuditoriums(auditoriumsData);

      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [user, router, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewShowtime({ ...newShowtime, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const applyFilter = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.theaterId) params.append('theaterId', filter.theaterId);
      if (filter.date) params.append('date', filter.date);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/showtimes?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không thể tải suất chiếu');

      const data = await res.json();
      setShowtimes(data);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/showtimes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: Number(newShowtime.movieId),
          auditoriumId: Number(newShowtime.auditoriumId),
          startTime: newShowtime.startTime,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Thêm suất chiếu không thành công.');
      }
      const createdShowtime = await res.json();
      setShowtimes([createdShowtime, ...showtimes]);
      alert('Thêm suất chiếu thành công!');
      setNewShowtime({ movieId: '', auditoriumId: '', startTime: '' });
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleDelete = async (showtimeId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa suất chiếu này không?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/showtimes/${showtimeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Xóa suất chiếu không thành công.');

        setShowtimes(showtimes.filter(s => s.id !== showtimeId));
        alert('Đã xóa suất chiếu thành công!');
      } catch (err: unknown) {
        if (err instanceof Error) alert(err.message);
      }
    }
  };

  if (isLoading) return <div className="text-center text-white py-20">Đang tải...</div>;
  if (user?.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Suất Chiếu</h1>
        <Link href="/admin/dashboard" className="text-sky-400 hover:underline">Quay lại Dashboard</Link>
      </div>

      {/* Bộ Lọc */}
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Bộ Lọc Suất Chiếu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="theater-filter" className="block text-sm font-medium">Rạp chiếu</label>
            <select
              id="theater-filter"
              name="theaterId"
              title="Chọn rạp chiếu"
              value={filter.theaterId}
              onChange={handleFilterChange}
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            >
              <option value="">Tất cả rạp</option>
              {auditoriums
                .filter((v, i, a) => a.findIndex(t => t.theater.id === v.theater.id) === i)
                .map(a => (
                  <option key={a.theater.id} value={a.theater.id}>
                    {a.theater.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium">Ngày chiếu</label>
            <input
              id="date-filter"
              title="Chọn ngày chiếu"
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilter}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md w-full"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Form thêm mới */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Thêm Suất Chiếu Mới</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="movie-select" className="block text-sm font-medium">Phim</label>
            <select
              id="movie-select"
              name="movieId"
              title="Chọn phim"
              value={newShowtime.movieId}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            >
              <option value="">Chọn phim</option>
              {movies.map(movie => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="auditorium-select" className="block text-sm font-medium">Phòng chiếu</label>
            <select
              id="auditorium-select"
              name="auditoriumId"
              title="Chọn phòng chiếu"
              value={newShowtime.auditoriumId}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            >
              <option value="">Chọn phòng chiếu</option>
              {auditoriums.map(a => (
                <option key={a.id} value={a.id}>{a.theater.name} - {a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="start-time-input" className="block text-sm font-medium">Thời gian bắt đầu</label>
            <input
              id="start-time-input"
              title="Chọn thời gian bắt đầu"
              type="datetime-local"
              name="startTime"
              value={newShowtime.startTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            />
          </div>
          <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md h-fit">Thêm</button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Bảng danh sách */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Phim</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rạp</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Thời Gian Bắt Đầu</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {showtimes.map(showtime => (
              <tr key={showtime.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium">{showtime.movie.title}</td>
                <td className="px-6 py-4">{showtime.auditorium.theater.name} - {showtime.auditorium.name}</td>
                <td className="px-6 py-4">{new Date(showtime.startTime).toLocaleString('vi-VN')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(showtime.id)} className="text-red-500 hover:text-red-400">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
