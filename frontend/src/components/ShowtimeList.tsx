// frontend/src/components/ShowtimeList.tsx
import Link from 'next/link';

interface Showtime {
  id: number;
  start_time: string;
  auditorium: {
    name: string;
    theater: {
      name: string;
    };
  };
}

interface ShowtimeListProps {
  showtimes: Showtime[];
}

export default function ShowtimeList({ showtimes }: ShowtimeListProps) {
  if (showtimes.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <p className="text-center text-gray-400">Hiện tại chưa có suất chiếu cho phim này.</p>
      </div>
    );
  }

  // Nhóm các suất chiếu theo cụm rạp
  const showtimesByTheater: { [key: string]: Showtime[] } = showtimes.reduce((acc, showtime) => {
    const theaterName = showtime.auditorium.theater.name;
    if (!acc[theaterName]) {
      acc[theaterName] = [];
    }
    acc[theaterName].push(showtime);
    return acc;
  }, {} as { [key: string]: Showtime[] });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-sky-400">Lịch Chiếu</h2>
      <div className="space-y-6">
        {Object.entries(showtimesByTheater).map(([theaterName, theaterShowtimes]) => (
          <div key={theaterName} className="bg-gray-800 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">{theaterName}</h3>
            <div className="flex flex-wrap gap-3">
              {theaterShowtimes.map((showtime) => (
                <Link
                  key={showtime.id}
                  href={`/dat-ve/${showtime.id}`} // Điều hướng đến trang đặt vé
                  className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 transition-colors"
                >
                  {new Date(showtime.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}