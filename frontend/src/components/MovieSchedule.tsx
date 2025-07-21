"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DatePicker from './DatePicker';
import Image from 'next/image';

interface Showtime {
  id: number;
  startTime: string;
  movie: { id: number; title: string; posterUrl: string; genre: string };
  auditorium: { format: string; };
}

interface GroupedByMovie {
  details: Showtime['movie'];
  formats: Record<string, Showtime[]>;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export default function MovieSchedule({ theaterId }: { theaterId: number }) {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/theaters/${theaterId}/showtimes?date=${selectedDate}`);
        if (!res.ok) throw new Error('Failed to fetch showtimes');
        const data = await res.json();

        
        const mappedData: Showtime[] = data.map((s: any) => ({
          ...s,
          startTime: s.startTime || s.start_time, 
        }));

        setShowtimes(mappedData);
      } catch (error) {
        console.error(error);
        setShowtimes([]);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchShowtimes();
  }, [theaterId, selectedDate]);

  const moviesByDate = useMemo(() => {
    return showtimes.reduce((acc, showtime) => {
      const movieId = showtime.movie.id;
      if (!acc[movieId]) {
        acc[movieId] = {
          details: showtime.movie,
          formats: {},
        };
      }
      const format = showtime.auditorium.format || '2D';
      if (!acc[movieId].formats[format]) {
        acc[movieId].formats[format] = [];
      }
      acc[movieId].formats[format].push(showtime);
      return acc;
    }, {} as Record<number, GroupedByMovie>);
  }, [showtimes]);

  return (
    <div>
      <div className="bg-gray-800 p-4 rounded-lg mb-8">
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {isLoading ? (
        <div className="text-center py-10">Đang tải lịch chiếu...</div>
      ) : Object.keys(moviesByDate).length > 0 ? (
        <div className="space-y-8">
          {Object.values(moviesByDate).map(({ details, formats }) => (
            <div key={details.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-700 pb-8 last:border-b-0">
              <div className="w-full md:w-40 flex-shrink-0">
                <img src={details.posterUrl} alt={details.title} className="w-full h-auto object-cover rounded-md" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{details.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{details.genre}</p>
                {Object.entries(formats).map(([format, times]) => (
                  <div key={format} className="mb-3">
                    <p className="font-semibold text-gray-300">{format}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {times.map(time => (
                        <Link key={time.id} href={`/dat-ve/${time.id}`} className="bg-gray-700 font-bold py-2 px-3 rounded-md hover:bg-sky-600 transition-colors text-sm">
                          {new Date(time.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16">
          Không có suất chiếu nào cho ngày đã chọn.
        </div>
      )}
    </div>
  );
}
