// frontend/src/app/phim/[id]/page.tsx
import Link from 'next/link';
import TrailerPlayer from '@/components/TrailerPlayer';
import ShowtimeList from '@/components/ShowtimeList';
import Image from 'next/image';

// Các interface và hàm fetch giữ nguyên
async function getMovieById(id: string) {
    const res = await fetch(`http://backend_service:8080/movies/${id}`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return res.json();
}
async function getShowtimesByMovieId(id: string) {
    const res = await fetch(`http://backend_service:8080/movies/${id}/showtimes`, { cache: 'no-cache' });
    if (!res.ok) return [];
    return res.json();
}

export default async function MovieDetailPage(props: { params: { id: string } }) {
  const { params } = await Promise.resolve(props); 
  const { id } = params; 

  const [movie, showtimes] = await Promise.all([
    getMovieById(id),
    getShowtimesByMovieId(id),
  ]);

  if (!movie) {
    return <div className="text-white text-center pt-20">Không tìm thấy phim hoặc có lỗi xảy ra.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="relative h-[56.25vw] max-h-[80vh] bg-gray-900">
        {movie.backdropUrl && <Image src={movie.backdropUrl} alt={`Backdrop of ${movie.title}`} layout="fill" objectFit="cover" className="opacity-50" priority />}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <TrailerPlayer trailerUrl={movie.trailerUrl} />
        </div>
      </div>
      <div className="container mx-auto p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            {movie.posterUrl && <Image src={movie.posterUrl} alt={`Poster of ${movie.title}`} width={500} height={750} className="rounded-lg w-full h-auto mb-4" />}
            <Link href={`/chon-rap/${movie.id}`} className="w-full bg-sky-500 text-white text-center font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors text-lg block">
              Đặt Vé
            </Link>
          </div>
          <div className="md:col-span-9">
            <h1 className="text-4xl font-black mb-4">{movie.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-gray-400">
              {movie.ageRating && <span className="border border-gray-500 px-2 py-0.5 rounded-md text-sm">{movie.ageRating}</span>}
              {movie.durationMinutes && <span>{movie.durationMinutes} phút</span>}
              {movie.genre && <span>{movie.genre}</span>}
            </div>
            <h2 className="text-xl font-bold mt-8 mb-2">Nội dung phim</h2>
            <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            <ShowtimeList showtimes={showtimes} />
          </div>
        </div>
      </div>
    </div>
  );
}