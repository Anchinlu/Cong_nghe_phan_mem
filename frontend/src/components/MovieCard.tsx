// file: frontend/src/components/MovieCard.tsx

import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
      
      {/* BƯỚC 1: Bọc poster trong thẻ Link để có thể nhấp vào */}
      <Link href={`/phim/${movie.id}`}>
        <div className="relative w-full h-96 bg-gray-700 cursor-pointer">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={`Poster of ${movie.title}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No Poster</span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Phần Nội dung */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white truncate mb-2">{movie.title}</h3>
        
        {/* BƯỚC 2: Chỉ giữ lại 1 nút "Đặt Vé" */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <Link 
            href={`/dat-ve/${movie.id}`}
            className="w-full bg-sky-500 text-white text-center font-semibold py-2 rounded-md hover:bg-sky-600 transition-colors text-sm"
          >
            Đặt Vé
          </Link>
        </div>
      </div>
    </div>
  );
}