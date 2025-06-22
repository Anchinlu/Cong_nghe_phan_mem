// file: frontend/src/app/page.tsx
import Hero from "@/components/Hero";
import MovieCard from "@/components/MovieCard"; // Import component MovieCard vừa tạo

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}

async function getMovies(): Promise<Movie[]> {
  try {
    const res = await fetch('http://backend_service:8080/movies', { cache: 'no-cache' });
    if (!res.ok) {
      console.error('Failed to fetch movies:', res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export default async function HomePage() {
  const moviesFromApi = await getMovies();
  
  const posterMap: { [key: string]: string } = {
    "Pacific Rim": "/images/pacific-rim-poster.jpg",
    "Kung Fu Panda 4": "/images/kfp4-poster.jpg",
    "Godzilla x Kong: The New Empire": "/images/gzk-poster.jpg"
  };

  // Thêm posterUrl vào mỗi object phim
  const moviesWithPosters = moviesFromApi.map(movie => ({
    ...movie,
    posterUrl: posterMap[movie.title]
  }));

 return (
    <div>
      <Hero />
      <section className="p-8 md:p-12 bg-black">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Phim Đang Chiếu
        </h1>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Dùng mảng phim đã có poster để render */}
          {moviesWithPosters.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}