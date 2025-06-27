// file: frontend/src/components/MovieTabs.tsx
"use client"; 

import { useState } from 'react';
import MovieCard from './MovieCard';


interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}


const MovieGrid = ({ movies }: { movies: Movie[] }) => (
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-8">
    {movies.length > 0 ? (
      movies.map(movie => <MovieCard key={movie.id} movie={movie} />)
    ) : (
      <p className="col-span-full text-center text-gray-500">Chưa có phim nào trong danh mục này.</p>
    )}
  </div>
);


interface MovieTabsProps {
  nowShowingMovies: Movie[];
  upcomingMovies: Movie[];
}

export default function MovieTabs({ nowShowingMovies, upcomingMovies }: MovieTabsProps) {

  const [activeTab, setActiveTab] = useState<'now_showing' | 'upcoming'>('now_showing');

  return (
    <section className="py-12 bg-black text-white">
     
      <div className="container mx-auto flex justify-center items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('now_showing')}
          className={`px-6 py-2 text-lg font-semibold rounded-full transition-colors duration-300 ${
            activeTab === 'now_showing' 
            ? 'bg-sky-500 text-white' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Phim Đang Chiếu
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-2 text-lg font-semibold rounded-full transition-colors duration-300 ${
            activeTab === 'upcoming' 
            ? 'bg-sky-500 text-white' 
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Phim Sắp Chiếu
        </button>
      </div>

   
      <div>
        {activeTab === 'now_showing' && <MovieGrid movies={nowShowingMovies} />}
        {activeTab === 'upcoming' && <MovieGrid movies={upcomingMovies} />}
      </div>
    </section>
  );
}