// frontend/src/components/MovieCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  posterUrl?: string;
  releaseDate?: string;
}

interface MovieCardProps {
  movie: Movie;
  isUpcoming?: boolean; 
}

export default function MovieCard({ movie, isUpcoming = false }: MovieCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
      <Link href={`/phim/${movie.id}`}>
        <div className="relative w-full h-96 bg-gray-700 cursor-pointer">
          {movie.posterUrl ? (
            <Image 
              src={movie.posterUrl} 
              alt={`Poster of ${movie.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-500">No Poster</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white truncate mb-2">{movie.title}</h3>
        
        <div className="mt-auto pt-4">
          {isUpcoming ? (
            <div className="text-center bg-gray-700 text-yellow-400 py-2 rounded-md">
              <p className="text-xs font-semibold">Dự kiến khởi chiếu</p>
              <p className="font-bold">{new Date(movie.releaseDate!).toLocaleDateString('vi-VN')}</p>
            </div>
          ) : (
            <Link 
              href={`/chon-rap/${movie.id}`}
              className="block w-full bg-sky-500 text-white text-center font-semibold py-2 rounded-md hover:bg-sky-600 transition-colors text-sm"
            >
              Đặt Vé
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}