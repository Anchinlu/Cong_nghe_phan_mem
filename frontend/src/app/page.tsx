// file: frontend/src/app/page.tsx
import Hero from "@/components/Hero";
import MovieCard from "@/components/MovieCard";
import MovieTabs from "@/components/MovieTabs";

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}

// Hàm getMovies này sẽ lấy TẤT CẢ các phim từ backend
async function getAllMovies(): Promise<Movie[]> {
  try {

    const res = await fetch(`http://backend_service:8080/movies`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching movies:`, error);
    return [];
  }
}


const MovieGrid = ({ movies }: { movies: Movie[] }) => (
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
    {movies.length > 0 ? (
      movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">Chưa có phim nào trong danh mục này.</p>
    )}
  </div>
);

export default async function HomePage() {

  const allMovies = await getAllMovies();


  const nowShowingMovies = allMovies;
 
  const upcomingMovies = allMovies.slice(0, 5); 

  return (
    <div>
      <Hero />

      {/*  */}
      <MovieTabs 
        nowShowingMovies={nowShowingMovies}
        upcomingMovies={upcomingMovies}
      />
    </div>
  );
}