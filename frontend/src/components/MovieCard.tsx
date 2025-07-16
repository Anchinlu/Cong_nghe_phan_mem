// file: frontend/src/components/MovieCard.tsx

import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
      
   
      <Link href={`/phim/${movie.id}`}>
        <div className="relative w-full h-96 bg-gray-700 cursor-pointer">
          {movie.posterUrl ? (
            <Image 
              src={movie.posterUrl}
              alt={`Poster of ${movie.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
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

        <div className="mt-auto pt-4 flex flex-col gap-2">
          <Link 
            href={`/chon-rap/${movie.id}`} 
            className="w-full bg-sky-500 text-white text-center font-semibold py-2 rounded-md hover:bg-sky-600 transition-colors text-sm"
          >
            Đặt Vé
          </Link>
        </div>
      </div>
    </div>
  );
}