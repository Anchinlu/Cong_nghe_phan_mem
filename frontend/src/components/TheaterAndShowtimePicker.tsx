// frontend/src/components/TheaterAndShowtimePicker.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';

// Định nghĩa các kiểu dữ liệu
interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
}

interface Showtime {
  id: number;
  start_time: string;
}

interface PickerProps {
  initialTheaters: Theater[];
  movieId: string;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export default function TheaterAndShowtimePicker({ initialTheaters, movieId }: PickerProps) {

  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [selectedCity, setSelectedCity] = useState<string>('Tất cả');
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
  
  const cities = useMemo(() => ['Tất cả', ...new Set(initialTheaters.map(t => t.city))], [initialTheaters]);

  const filteredTheaters = useMemo(() => {
    if (selectedCity === 'Tất cả') return initialTheaters;
    return initialTheaters.filter(t => t.city === selectedCity);
  }, [initialTheaters, selectedCity]);

  useEffect(() => {
    if (selectedTheater) {
      setIsLoadingShowtimes(true);
      setShowtimes([]);
      const fetchShowtimes = async () => {
        try {
          const res = await fetch(`http://localhost:8080/theaters/${selectedTheater.id}/movies/${movieId}/showtimes?date=${selectedDate}`);
          if (!res.ok) throw new Error('Failed to fetch showtimes');
          const data = await res.json();
          setShowtimes(data);
        } catch (error) {
           console.error("Failed to fetch showtimes", error);
        } finally {
           setIsLoadingShowtimes(false);
        }
      };
      void fetchShowtimes();
    }
  }, [selectedTheater, selectedDate, movieId]);

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg mb-8 space-y-4">
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <div className="flex items-center space-x-4">
          <label htmlFor="city-select" className="font-semibold">Chọn thành phố:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-gray-700 p-2 rounded-md"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-sky-400 mb-4">Danh Sách Rạp</h2>
          <ul className="space-y-2">
            {filteredTheaters.map(theater => (
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
              <h3 className="text-lg font-semibold text-sky-400 mb-4">Các suất chiếu trong ngày:</h3>
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
    </>
  );
}