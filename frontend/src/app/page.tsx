// file: frontend/src/app/page.tsx
import Hero from "@/components/Hero";

import MovieTabs from "@/components/MovieTabs";

interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string;
}

// Hàm lấy phim ĐANG CHIẾU
async function getNowShowingMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?status=NOW_SHOWING`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching now showing movies:`, error);
    return [];
  }
}


async function getUpcomingMovies(): Promise<Movie[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies?status=UPCOMING`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching upcoming movies:`, error);
    return [];
  }
}

export default async function HomePage() {
  const [nowShowingMovies, upcomingMovies] = await Promise.all([
    getNowShowingMovies(),
    getUpcomingMovies(),
  ]);

  return (
    <div>
      <Hero />
      
      {/* Truyền hai danh sách phim riêng biệt vào MovieTabs */}
      <MovieTabs 
        nowShowingMovies={nowShowingMovies}
        upcomingMovies={upcomingMovies}
      />
    </div>
  );
}