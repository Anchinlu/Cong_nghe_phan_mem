// frontend/src/components/SeatPicker.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Seat {
  row: number;
  col: number;
}
interface SeatLayout {
  rows: number;
  cols: number;
  unavailable?: Seat[];
}
interface SeatPickerProps {
  seatLayout: SeatLayout;
  bookedSeats: Seat[];
  showtimeId: number;
  ticketPrice: number; 
}

export default function SeatPicker({ seatLayout, bookedSeats, showtimeId, ticketPrice }: SeatPickerProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, token } = useAuth();

  const totalPrice = selectedSeats.length * ticketPrice;

  const handleSeatClick = (seat: Seat) => {

    if (isSeatBooked(seat) || isSeatUnavailable(seat)) return;


    if (isSeatSelected(seat)) {

      setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.col === seat.col)));
    } else {

      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSeatBooked = (seat: Seat) => bookedSeats.some(s => s.row === seat.row && s.col === seat.col);
  const isSeatSelected = (seat: Seat) => selectedSeats.some(s => s.row === seat.row && s.col === seat.col);
  const isSeatUnavailable = (seat: Seat) => seatLayout.unavailable?.some(s => s.row === seat.row && s.col === seat.col);

  const handleBooking = async () => {
    if (!user || !token) {
      alert('Vui lòng đăng nhập để đặt vé.');
      router.push('/dang-nhap');
      return;
    }
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn ít nhất một ghế.');
      return;
    }
    setError('');
    setIsLoading(true);

     try {
      const res = await fetch('http://localhost:8080/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          showtimeId,
          seats: selectedSeats.map(s => ({ row: s.row, col: s.col })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đặt vé không thành công.');
      }

      await res.json();
      alert(`Đặt vé thành công! Vui lòng kiểm tra Email để biết mã vé`);

      router.push('/');

    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('Đã xảy ra lỗi không xác định.');
  }
}
  };

  return (
    <div className="flex flex-col items-center">

      <div className="w-full max-w-2xl h-2 bg-white mb-2 rounded-t-full shadow-[0_0_20px_white]"></div>
      <p className="text-white mb-6">Màn hình</p>

      <div className="flex flex-col gap-2 mb-8">
        {Array.from({ length: seatLayout.rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {Array.from({ length: seatLayout.cols }).map((_, colIndex) => {
              const seat = { row: rowIndex + 1, col: colIndex + 1 };
              const booked = isSeatBooked(seat);
              const selected = isSeatSelected(seat);
              const unavailable = isSeatUnavailable(seat);

              let seatClass = 'seat-available';
              if (booked || unavailable) seatClass = 'seat-booked';
              if (selected) seatClass = 'seat-selected';

              return (
                <button
                  key={colIndex}
                  className={`seat ${seatClass}`}
                  onClick={() => handleSeatClick(seat)}
                  disabled={booked || unavailable}
                >
                  {colIndex + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>


      <div className="flex justify-center gap-6 mb-8 text-white text-sm">
        <div className="flex items-center gap-2"><div className="seat seat-available"></div><span>Trống</span></div>
        <div className="flex items-center gap-2"><div className="seat seat-selected"></div><span>Đang chọn</span></div>
        <div className="flex items-center gap-2"><div className="seat seat-booked"></div><span>Đã đặt</span></div>
      </div>

       <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Tóm tắt đơn hàng</h3>
        <div className="text-gray-300 space-y-2 mb-4">
          <p>Số ghế đã chọn: {selectedSeats.length}</p>
          <p className="font-bold text-lg">Tạm tính: {totalPrice.toLocaleString('vi-VN')} VNĐ</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleBooking}
          disabled={isLoading || selectedSeats.length === 0}
          className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-500"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt Vé'}
        </button>
      </div>
    </div>
  );
}