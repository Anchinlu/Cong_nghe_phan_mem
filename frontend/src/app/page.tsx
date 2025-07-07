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
    // SỬA Ở ĐÂY
    const res = await fetch(`http://backend_service:8080/movies?status=NOW_SHOWING`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching now showing movies:`, error);
    return [];
  }
}


async function getUpcomingMovies(): Promise<Movie[]> {
  try {
    // SỬA Ở ĐÂY
    const res = await fetch(`http://backend_service:8080/movies?status=UPCOMING`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(`Error fetching upcoming movies:`, error);
    return [];
  }
}

export default async function HomePage() {
  // Gọi đồng thời cả hai hàm để tối ưu thời gian tải
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