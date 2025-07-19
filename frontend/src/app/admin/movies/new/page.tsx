// frontend/src/app/admin/movies/new/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function NewMoviePage() {
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    durationMinutes: 120,
    releaseDate: '',
    posterUrl: '',
    genre: '',
    ageRating: '',
    trailerUrl: '',
    backdropUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...movieData,
            durationMinutes: Number(movieData.durationMinutes) 
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Thêm phim không thành công.');
      }
      
      alert('Thêm phim mới thành công!');
      router.push('/admin/movies'); 

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Thêm Phim Mới</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Tên phim</label>
          <input type="text" name="title" id="title" required value={movieData.title} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Mô tả</label>
          <textarea name="description" id="description" rows={4} required value={movieData.description} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"></textarea>
        </div>

        {/* Duration & Release Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-300">Thời lượng (phút)</label>
                <input type="number" name="durationMinutes" id="durationMinutes" required value={movieData.durationMinutes} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
            </div>
            <div>
                <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300">Ngày phát hành</label>
                <input type="date" name="releaseDate" id="releaseDate" required value={movieData.releaseDate} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
            </div>
        </div>
        
        {/* Genre & Age Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-300">Thể loại</label>
                <input type="text" name="genre" id="genre" value={movieData.genre} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
            </div>
            <div>
                <label htmlFor="ageRating" className="block text-sm font-medium text-gray-300">Giới hạn độ tuổi</label>
                <input type="text" name="ageRating" id="ageRating" value={movieData.ageRating} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
            </div>
        </div>
        
        {/* URLs */}
        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-300">URL Poster</label>
          <input type="url" name="posterUrl" id="posterUrl" value={movieData.posterUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
        </div>
         <div>
          <label htmlFor="backdropUrl" className="block text-sm font-medium text-gray-300">URL Backdrop</label>
          <input type="url" name="backdropUrl" id="backdropUrl" value={movieData.backdropUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
        </div>
         <div>
          <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-300">URL Trailer (YouTube)</label>
          <input type="url" name="trailerUrl" id="trailerUrl" value={movieData.trailerUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-white p-2"/>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/movies" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">
            Hủy
          </Link>
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Đang lưu...' : 'Lưu Phim'}
          </button>
        </div>
      </form>
    </div>
  );
}