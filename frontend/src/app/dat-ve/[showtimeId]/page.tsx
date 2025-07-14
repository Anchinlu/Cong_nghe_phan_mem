// frontend/src/app/dat-ve/[showtimeId]/page.tsx
import SeatPicker from "@/components/SeatPicker";
import React from 'react';

// Hàm gọi API lấy sơ đồ ghế
async function getSeatLayout(showtimeId: string) {
    const res = await fetch(`http://backend_service:8080/showtimes/${showtimeId}/seats`, { cache: 'no-cache' });
    if (!res.ok) return null;
    return res.json();

}

export default async function BookingPage({ params }: { params: { showtimeId: string } }) {
  const { showtimeId } = params; 
  const seatData = await getSeatLayout(showtimeId);

  if (!seatData) {
    return <div className="text-white text-center pt-20">Không thể tải sơ đồ ghế. Vui lòng thử lại.</div>;
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Chọn Ghế Của Bạn</h1>
      <SeatPicker 
        seatLayout={seatData.seatLayout}
        bookedSeats={seatData.bookedSeats}
        showtimeId={parseInt(showtimeId)}
      />
    </div>
  );
}