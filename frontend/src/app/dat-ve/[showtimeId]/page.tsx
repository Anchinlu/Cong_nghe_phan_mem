// frontend/src/app/dat-ve/[showtimeId]/page.tsx
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import SeatPicker from "@/components/SeatPicker";
import React from 'react';

// Định nghĩa kiểu dữ liệu trả về từ API
interface SeatLayoutData {
  seatLayout: {
    rows: number;
    cols: number;
    unavailable?: { row: number; col: number }[];
  };
  bookedSeats: { row: number; col: number }[];
}

// Hàm gọi API lấy sơ đồ ghế
async function getSeatLayout(showtimeId: string) {
    const res = await fetch(`http://backend_service:8080/showtimes/${showtimeId}/seats`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return res.json();

}

interface PageProps {
  params: { showtimeId: string }
}

export default async function BookingPage({ params }: PageProps) {
  const { showtimeId } = await Promise.resolve(params);

  const seatData = await getSeatLayout(showtimeId);

  if (!seatData || typeof seatData.ticketPrice !== 'number') {
    return <div className="text-white text-center pt-20">Không thể tải thông tin suất chiếu hoặc giá vé.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Chọn Ghế Của Bạn</h1>
      <SeatPicker 
        seatLayout={seatData.seatLayout}
        bookedSeats={seatData.bookedSeats}
        showtimeId={parseInt(showtimeId)}
        ticketPrice={seatData.ticketPrice}
      />
    </div>
  );
}