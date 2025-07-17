export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import TrailerPlayer from '@/components/TrailerPlayer';
import ShowtimeList from '@/components/ShowtimeList'; 
import React from 'react';
import Image from 'next/image';

// Định nghĩa các kiểu dữ liệu
interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
  trailerUrl?: string;
  backdropUrl?: string;
  genre?: string;
  durationMinutes?: number;
  ageRating?: string;
  subtitleInfo?: string;
  releaseDate?: string;
}

interface Showtime {
  id: number;
  start_time: string;
  auditorium: {
    name: string;
    theater: {
      name: string;
    };
  };
}

// Hàm lấy thông tin phim
async function getMovieById(id: string): Promise<Movie | null> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return res.json();
}

async function getShowtimesByMovieId(id: string): Promise<Showtime[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}/showtimes`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);

  const [movie, showtimes] = await Promise.all([
    getMovieById(id),
    getShowtimesByMovieId(id),
  ]);

  if (!movie) {
    return <div className="text-white text-center pt-20">Không tìm thấy phim hoặc có lỗi xảy ra.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Phần Trailer */}
      <div className="relative h-[56.25vw] max-h-[80vh] bg-gray-900">
        <Image 
          src={movie.backdropUrl || movie.posterUrl || '/fallback.jpg'} 
          alt={`Backdrop of ${movie.title}`} 
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <TrailerPlayer trailerUrl={movie.trailerUrl} />
        </div>
      </div>

      {/* Phần Thông tin chi tiết */}
      <div className="container mx-auto p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Cột trái: Poster và Nút đặt vé */}
          <div className="md:col-span-3">
            <Image 
              src={movie.posterUrl || '/fallback.jpg'} 
              alt={`Poster of ${movie.title}`} 
              width={300}
              height={450}
              className="rounded-lg w-full mb-4 object-cover"
            />
            <Link href={`/dat-ve/${movie.id}`} className="w-full bg-sky-500 text-white text-center font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg block">
              Đặt Vé
            </Link>
          </div>

          {/* Cột phải: Thông tin phim và Lịch chiếu */}
          <div className="md:col-span-9">
            <h1 className="text-4xl font-black mb-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-gray-400">
              {movie.ageRating && <span className="border border-gray-500 px-2 py-0.5 rounded-md text-sm">{movie.ageRating}</span>}
              {movie.durationMinutes && <span>{movie.durationMinutes} phút</span>}
              {movie.genre && <span>{movie.genre}</span>}
              {movie.subtitleInfo && <span>{movie.subtitleInfo}</span>}
            </div>
            <h2 className="text-xl font-bold mt-8 mb-2">Nội dung phim</h2>
            <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            
            {/* Lịch chiếu */}
            <ShowtimeList showtimes={showtimes} />
          </div>
        </div>
      </div>
    </div>
  );
}
