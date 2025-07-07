// frontend/src/app/lich-su-dat-ve/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Định nghĩa các kiểu dữ liệu
interface Booking {
  id: number;
  total_price: number;
  createdAt: string;
  showtime: {
    start_time: string;
    movie: { title: string; posterUrl: string; };
    auditorium: { name: string; theater: { name: string; }; };
  };
  seats: { row_number: number; seat_number: number; }[];
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError('Vui lòng đăng nhập để xem lịch sử đặt vé.');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:8080/bookings/my-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Không thể tải lịch sử đặt vé.');
        }
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  if (isLoading) {
    return <div className="text-center text-white pt-20">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 pt-20">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Lịch Sử Đặt Vé</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-400">Bạn chưa có đơn đặt vé nào.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row gap-6">
              <img src={booking.showtime.movie.posterUrl} alt={booking.showtime.movie.title} className="w-full md:w-32 h-auto object-cover rounded-md" />
              
              <div className="text-gray-300">
                <h2 className="text-xl font-bold text-white">{booking.showtime.movie.title}</h2>
                <p>
                  <strong>Mã đặt vé:</strong> {booking.id}
                </p>
                <p>
                  <strong>Rạp:</strong> {booking.showtime.auditorium.theater.name} - {booking.showtime.auditorium.name}
                </p>
                <p>
                  <strong>Suất chiếu:</strong> {new Date(booking.showtime.start_time).toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Ghế:</strong> {booking.seats.map(s => `H${s.row_number}-G${s.seat_number}`).join(', ')}
                </p>
                <p>
                  <strong>Tổng tiền:</strong> {booking.total_price.toLocaleString('vi-VN')} VNĐ
                </p>
                <p>
                  <strong>Ngày đặt:</strong> {new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}