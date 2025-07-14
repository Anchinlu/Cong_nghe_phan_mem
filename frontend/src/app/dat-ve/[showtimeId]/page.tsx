import SeatPicker from "@/components/SeatPicker";

interface SeatLayoutData {
    seatLayout: {
        rows: number;
        cols: number;
        unavailable?: { row: number; col: number }[];
    };
    bookedSeats: { row: number; col: number }[];
}

async function getSeatLayout(showtimeId: string): Promise<SeatLayoutData | null> {
    try {
        const res = await fetch(`http://backend_service:8080/showtimes/${showtimeId}/seats`, { cache: 'no-cache' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Failed to fetch seat layout:', error);
        return null;
    }
}

export default async function BookingPage({ params }: { params: Promise<{ showtimeId: string }> }) {
  const { showtimeId } = await params; 

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
