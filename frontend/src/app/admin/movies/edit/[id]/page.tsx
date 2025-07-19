"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Movie {
  title: string;
  description: string;
  durationMinutes: number;
  releaseDate: string;
  posterUrl: string;
  genre: string;
  ageRating: string;
  trailerUrl: string;
  backdropUrl: string;
}

export default function EditMoviePage() {
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  useEffect(() => {
    if (!movieId) return;

    const fetchMovie = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${movieId}`);
        if (!res.ok) throw new Error('Không thể tải thông tin phim.');
        const data = await res.json();
        data.releaseDate = new Date(data.releaseDate).toISOString().split('T')[0];
        setMovieData(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchMovie();
  }, [movieId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (movieData) {
      setMovieData(prev => ({ ...prev!, [name]: value }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError('Phiên đăng nhập hết hạn.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...movieData,
          durationMinutes: Number(movieData?.durationMinutes),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Cập nhật phim không thành công.');
      }

      alert('Cập nhật phim thành công!');
      router.push('/admin/movies');

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-white text-center py-20">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center py-20">{error}</div>;
  if (!movieData) return <div className="text-white text-center py-20">Không tìm thấy phim.</div>;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Chỉnh Sửa Phim</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto space-y-6">
        
        {/** Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Tên phim</label>
          <input 
            type="text" 
            name="title" 
            id="title"
            placeholder="Nhập tên phim"
            title="Tên phim"
            value={movieData.title} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Mô tả</label>
          <textarea 
            name="description" 
            id="description"
            placeholder="Nhập mô tả phim"
            title="Mô tả phim"
            rows={3} 
            value={movieData.description} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Duration */}
        <div>
          <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-300">Thời lượng (phút)</label>
          <input 
            type="number" 
            name="durationMinutes" 
            id="durationMinutes"
            placeholder="Nhập thời lượng phim"
            title="Thời lượng phim (phút)"
            value={movieData.durationMinutes} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Release Date */}
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-300">Ngày công chiếu</label>
          <input 
            type="date" 
            name="releaseDate" 
            id="releaseDate"
            title="Ngày công chiếu"
            value={movieData.releaseDate} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Poster URL */}
        <div>
          <label htmlFor="posterUrl" className="block text-sm font-medium text-gray-300">Poster URL</label>
          <input 
            type="text" 
            name="posterUrl" 
            id="posterUrl"
            placeholder="URL hình poster"
            title="URL Poster"
            value={movieData.posterUrl} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Backdrop URL */}
        <div>
          <label htmlFor="backdropUrl" className="block text-sm font-medium text-gray-300">Backdrop URL</label>
          <input 
            type="text" 
            name="backdropUrl" 
            id="backdropUrl"
            placeholder="URL ảnh nền (backdrop)"
            title="URL Backdrop"
            value={movieData.backdropUrl} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Genre */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-300">Thể loại</label>
          <input 
            type="text" 
            name="genre" 
            id="genre"
            placeholder="Nhập thể loại"
            title="Thể loại phim"
            value={movieData.genre} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Age Rating */}
        <div>
          <label htmlFor="ageRating" className="block text-sm font-medium text-gray-300">Giới hạn tuổi</label>
          <input 
            type="text" 
            name="ageRating" 
            id="ageRating"
            placeholder="Nhập giới hạn độ tuổi"
            title="Giới hạn độ tuổi"
            value={movieData.ageRating} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Trailer URL */}
        <div>
          <label htmlFor="trailerUrl" className="block text-sm font-medium text-gray-300">Trailer URL</label>
          <input 
            type="text" 
            name="trailerUrl" 
            id="trailerUrl"
            placeholder="URL trailer"
            title="URL Trailer"
            value={movieData.trailerUrl} 
            onChange={handleChange} 
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2" 
            required 
          />
        </div>

        {/** Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/admin/movies" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-500 transition-colors">
            Hủy
          </Link>
          <button type="submit" disabled={isLoading} className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors disabled:bg-gray-500">
            {isLoading ? 'Đang cập nhật...' : 'Cập Nhật Phim'}
          </button>
        </div>

      </form>
    </div>
  );
}
