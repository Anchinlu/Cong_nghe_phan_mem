// frontend/src/app/chon-rap/[movieId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Định nghĩa các kiểu dữ liệu
interface Theater {
  id: number;
  name: string;
  address: string;
}

interface Showtime {
  id: number;
  start_time: string;
}

export default function SelectTheaterPage({ params }: { params: { movieId: string } }) {

  const { movieId } = params;

  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);

  // Lấy danh sách tất cả các rạp khi component được tải
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const res = await fetch('http://localhost:8080/theaters');
        if (!res.ok) throw new Error('Failed to fetch theaters');
        const data = await res.json();
        setTheaters(data);
      } catch (error) {
        console.error("Failed to fetch theaters", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  // Lấy danh sách suất chiếu khi người dùng chọn một rạp
  useEffect(() => {
    if (selectedTheater) {
      setIsLoadingShowtimes(true);
      setShowtimes([]);
      const fetchShowtimes = async () => {
        try {
        
          const res = await fetch(`http://localhost:8080/theaters/${selectedTheater.id}/movies/${movieId}/showtimes`);
          if (!res.ok) throw new Error('Failed to fetch showtimes');
          const data = await res.json();
          setShowtimes(data);
        } catch (error) {
           console.error("Failed to fetch showtimes", error);
        } finally {
           setIsLoadingShowtimes(false);
        }
      };
      fetchShowtimes();
    }
  }, [selectedTheater, movieId]); 

  if (isLoading) {
    return <div className="text-white text-center pt-20">Đang tải danh sách rạp...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Chọn Rạp Chiếu</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột chọn rạp */}
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-sky-400 mb-4">Danh Sách Rạp</h2>
          <ul className="space-y-2">
            {theaters.map(theater => (
              <li key={theater.id}>
                <button
                  onClick={() => setSelectedTheater(theater)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${selectedTheater?.id === theater.id ? 'bg-sky-500 text-white' : 'hover:bg-gray-700'}`}
                >
                  {theater.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

       
        <div className="md:col-span-2">
          {selectedTheater ? (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedTheater.name}</h2>
              <p className="text-gray-400 mb-6">{selectedTheater.address}</p>
              <h3 className="text-lg font-semibold text-sky-400 mb-4">Các suất chiếu trong hôm nay:</h3>
              {isLoadingShowtimes ? (
                <p className="text-gray-400">Đang tải suất chiếu...</p>
              ) : showtimes.length > 0 ? (
                 <div className="flex flex-wrap gap-3">
                    {showtimes.map(showtime => (
                       <Link
                          key={showtime.id}
                          href={`/dat-ve/${showtime.id}`}
                          className="bg-gray-700 font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors"
                       >
                          {new Date(showtime.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                       </Link>
                    ))}
                 </div>
              ) : (
                 <p className="text-gray-500">Không có suất chiếu nào cho phim này tại rạp đã chọn.</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg min-h-[200px]">
              <p className="text-gray-500">Vui lòng chọn một rạp để xem lịch chiếu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}