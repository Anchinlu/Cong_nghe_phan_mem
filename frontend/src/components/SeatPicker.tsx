// frontend/src/components/SeatPicker.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa các kiểu dữ liệu
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
}

export default function SeatPicker({ seatLayout, bookedSeats, showtimeId }: SeatPickerProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const TICKET_PRICE = 75000; // Giá vé giả định

  const handleSeatClick = (seat: Seat) => {
    // Không cho phép chọn ghế đã đặt hoặc ghế không tồn tại
    if (isSeatBooked(seat) || isSeatUnavailable(seat)) return;

    // Kiểm tra xem ghế đã được chọn chưa
    if (isSeatSelected(seat)) {
     
      setSelectedSeats(selectedSeats.filter(s => !(s.row === seat.row && s.col === seat.col)));
    } else {
     
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSeatBooked = (seat: Seat) => 
    bookedSeats.some(s => s.row === seat.row && s.col === seat.col);

  const isSeatSelected = (seat: Seat) => 
    selectedSeats.some(s => s.row === seat.row && s.col === seat.col);

  const isSeatUnavailable = (seat: Seat) =>
    seatLayout.unavailable?.some(s => s.row === seat.row && s.col === seat.col);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Vui lòng chọn ít nhất một ghế.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://backend_service:8080/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Thêm Authorization header nếu cần
          // 'Authorization': `Bearer ${your_auth_token}`
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
      
      const bookingResult = await res.json();
      alert(`Đặt vé thành công! Mã đặt vé của bạn là: ${bookingResult.id}`);
      // Chuyển hướng về trang chủ hoặc trang lịch sử đặt vé
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phần màn hình */}
      <div className="w-full max-w-2xl h-2 bg-white mb-2 rounded-t-full shadow-[0_0_20px_white]"></div>
      <p className="text-white mb-6">Màn hình</p>
      
      {/* Sơ đồ ghế */}
      <div className="flex flex-col gap-2 mb-8">
        {Array.from({ length: seatLayout.rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
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

      {/* Chú thích */}
      <div className="flex justify-center gap-6 mb-8 text-white text-sm">
        <div className="flex items-center gap-2"><div className="seat seat-available"></div><span>Trống</span></div>
        <div className="flex items-center gap-2"><div className="seat seat-selected"></div><span>Đang chọn</span></div>
        <div className="flex items-center gap-2"><div className="seat seat-booked"></div><span>Đã đặt</span></div>
      </div>
      
      {/* Tóm tắt và nút đặt vé */}
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Tóm tắt đơn hàng</h3>
        <div className="text-gray-300 space-y-2 mb-4">
          <p>Số ghế đã chọn: {selectedSeats.length}</p>
          <p>Tạm tính: {(selectedSeats.length * TICKET_PRICE).toLocaleString('vi-VN')} VNĐ</p>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleBooking}
          disabled={isLoading}
          className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-500"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt Vé'}
        </button>
      </div>
    </div>
  );
}