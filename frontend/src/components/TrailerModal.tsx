// file: frontend/src/components/TrailerModal.tsx
"use client";

import ReactPlayer from 'react-player/youtube';

interface TrailerModalProps {
  trailerUrl: string;
  onClose: () => void;
}

export default function TrailerModal({ trailerUrl, onClose }: TrailerModalProps) {
  if (!trailerUrl) return null;

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-black p-1 rounded-lg relative w-full max-w-4xl shadow-2xl"
      >
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 text-white bg-gray-800 rounded-full p-1 w-8 h-8 flex items-center justify-center text-xl font-bold z-10"
        >
          ×
        </button>
        
        <div className="aspect-video w-full">
          <ReactPlayer
            url={trailerUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={true}
            pip={true}
            config={{
              playerVars: { 
                showinfo: 0,
                modestbranding: 1,
                iv_load_policy: 3
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}