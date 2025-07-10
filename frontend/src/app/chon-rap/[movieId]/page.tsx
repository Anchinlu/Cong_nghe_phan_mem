// frontend/src/app/chon-rap/[movieId]/page.tsx
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
  auditorium: {
    name: string;
    format: string;
    theater: Theater;
  };
}

// Định nghĩa cấu trúc cho dữ liệu đã được nhóm lại
interface GroupedShowtimes {
  details: Theater;
  formats: Record<string, Showtime[]>;
}

// Hàm để định dạng ngày thành chuỗi YYYY-MM-DD
const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export default function SelectTheaterPage({ params }: { params: { movieId: string } }) {
  const { movieId } = params;

  const [allShowtimes, setAllShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [selectedCity, setSelectedCity] = useState<string>('Tất cả');
  const [isLoading, setIsLoading] = useState(true);

  // Lấy danh sách suất chiếu dựa trên bộ lọc
  useEffect(() => {
    setIsLoading(true);
    const fetchShowtimes = async () => {
      const url = new URL('http://localhost:8080/showtimes/search');
      url.searchParams.append('movieId', movieId);
      url.searchParams.append('date', selectedDate);
      if (selectedCity !== 'Tất cả') {
        url.searchParams.append('city', selectedCity);
      }

      try {
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch showtimes');
        const data = await res.json();
        setAllShowtimes(data);
      } catch (error) {
        console.error(error);
        setAllShowtimes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId, selectedDate, selectedCity]);

  // Lọc và nhóm dữ liệu để hiển thị
  const cities = useMemo(() => ['Tất cả', ...new Set(allShowtimes.map(s => s.auditorium.theater.city))], [allShowtimes]);
  
  const showtimesByTheater = useMemo(() => {
    return allShowtimes.reduce((acc, showtime) => {
      const theaterId = showtime.auditorium.theater.id;
      if (!acc[theaterId]) {
        acc[theaterId] = {
          details: showtime.auditorium.theater,
          formats: {},
        };
      }
      const format = showtime.auditorium.format || '2D';
      if (!acc[theaterId].formats[format]) {
        acc[theaterId].formats[format] = [];
      }
      acc[theaterId].formats[format].push(showtime);
      return acc;
    }, {} as Record<number, GroupedShowtimes>); 
  }, [allShowtimes]);

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Lịch Chiếu Phim</h1>
      
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

      {isLoading ? (
        <div className="text-center">Đang tải lịch chiếu...</div>
      ) : Object.keys(showtimesByTheater).length > 0 ? (
        <div className="space-y-6">
          {Object.values(showtimesByTheater).map(({ details, formats }) => (
            <div key={details.id} className="bg-gray-800 p-5 rounded-lg">
              <h2 className="text-xl font-bold text-sky-400 mb-2">{details.name}</h2>
              <p className="text-sm text-gray-400 mb-4">{details.address}</p>
              
              {Object.entries(formats).map(([format, times]) => (
                <div key={format} className="mb-3">
                  <p className="font-semibold text-gray-300">{format}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {times.map(time => (
                      <Link key={time.id} href={`/dat-ve/${time.id}`} className="bg-gray-700 font-bold py-2 px-4 rounded-md hover:bg-sky-600 transition-colors">
                        {new Date(time.start_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400">Không có suất chiếu nào phù hợp với lựa chọn của bạn.</div>
      )}
    </div>
  );
}