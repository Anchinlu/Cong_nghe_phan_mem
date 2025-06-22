// file: frontend/src/components/MovieCard.tsx

// Ta định nghĩa lại kiểu dữ liệu Movie ở đây để component biết movie prop trông như thế nào
interface Movie {
  id: number;
  title: string;
  description: string;
  posterUrl?: string; 
}

// Component này nhận vào một prop tên là 'movie'
export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer">
      {/* Tạm thời dùng một placeholder cho ảnh poster */}
      <div className="bg-gray-700 w-full h-96">
  {movie.posterUrl ? (
    <img src={movie.posterUrl} alt={`Poster of ${movie.title}`} className="w-full h-full object-cover" />
     ) : (
    <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-500">No Poster</span>
    </div>
     )}
    </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
      </div>
    </div>
  );
}