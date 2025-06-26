// file: frontend/src/components/TrailerPlayer.tsx
"use client"; // Đánh dấu đây là Client Component để dùng useState

import { useState } from 'react';
import TrailerModal from './TrailerModal'; // Import modal vừa tạo

// Component nhỏ cho icon nút Play
const PlayIcon = () => (
  <svg className="w-20 h-20 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
  </svg>
);

export default function TrailerPlayer({ trailerUrl }: { trailerUrl: string | undefined }) {
  // Dùng useState để quản lý trạng thái đóng/mở của modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!trailerUrl) {
    return null; // Không hiển thị nút Play nếu không có link trailer
  }

  return (
    <>
      {/* Nút Play */}
      <button
        onClick={() => setIsModalOpen(true)} // Khi bấm, đặt trạng thái mở modal là true
        className="cursor-pointer hover:scale-110 transition-transform"
        aria-label="Play Trailer"
      >
        <PlayIcon />
      </button>

      {/* Modal chỉ hiển thị khi isModalOpen là true */}
      {isModalOpen && (
        <TrailerModal 
          trailerUrl={trailerUrl} 
          onClose={() => setIsModalOpen(false)} // Truyền hàm để đóng modal
        />
      )}
    </>
  );
}