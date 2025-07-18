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

  // --- LOGIC MỚI: NHÓM SUẤT CHIẾU THEO NGÀY, SAU ĐÓ THEO RẠP ---
  const showtimesByDateAndTheater = showtimes.reduce((acc, showtime) => {
    // Lấy ngày tháng (ví dụ: "2025-07-08") từ start_time
    const date = new Date(showtime.start_time).toISOString().split('T')[0];
    const theaterName = showtime.auditorium.theater.name;

    if (!acc[date]) {
      acc[date] = {};
    }
    if (!acc[date][theaterName]) {
      acc[date][theaterName] = [];
    }

    acc[date][theaterName].push(showtime);
    return acc;
  }, {} as Record<string, Record<string, Showtime[]>>);
  // --- KẾT THÚC LOGIC MỚI ---

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-sky-400">Lịch Chiếu</h2>
      <div className="space-y-8">
        {/* Lặp qua từng ngày */}
        {Object.entries(showtimesByDateAndTheater).map(([date, theaters]) => (
          <div key={date}>
            <h3 className="text-lg font-bold text-white bg-gray-700/50 p-2 rounded-md mb-4">
              {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
            </h3>
            <div className="space-y-6">
              {/* Trong mỗi ngày, lặp qua từng rạp */}
              {Object.entries(theaters).map(([theaterName, theaterShowtimes]) => (
                <div key={theaterName} className="bg-gray-800 p-5 rounded-lg">
                  <h4 className="text-xl font-semibold text-white mb-4">{theaterName}</h4>
                  <div className="flex flex-wrap gap-3">
                    {/* Hiển thị các giờ chiếu */}
                    {theaterShowtimes.map((showtime) => (
                      <Link
                        key={showtime.id}
                        href={`/dat-ve/${showtime.id}`}
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
        ))}
      </div>
    </div>
  );
}