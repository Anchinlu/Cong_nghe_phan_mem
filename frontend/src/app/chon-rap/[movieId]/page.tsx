// frontend/src/app/chon-rap/[movieId]/page.tsx
import TheaterAndShowtimePicker from '@/components/TheaterAndShowtimePicker';
import React from 'react';

// Định nghĩa kiểu dữ liệu cho props một cách tường minh
interface SelectTheaterPageProps {
  params: { movieId: string };
}

// Hàm để lấy danh sách rạp từ backend
async function getTheaters() {
  try {
    const res = await fetch('http://backend_service:8080/theaters', { cache: 'no-cache' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch theaters", error);
    return [];
  }
}

export default async function SelectTheaterPage(props: SelectTheaterPageProps) {

  const { params } = props;
  const { movieId } = params;
  
  const theaters = await getTheaters();

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Chọn Rạp & Suất Chiếu</h1>
      <TheaterAndShowtimePicker initialTheaters={theaters} movieId={movieId} />
    </div>
  );
}