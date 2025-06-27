// file: frontend/src/components/Hero.tsx

import Link from 'next/link';

export default function Hero() {

  const featuredMovie = {
    title: 'Pacific Rim',
    description: 'Khi các quái vật biển khổng lồ Kaiju trỗi dậy từ đại dương, một loại vũ khí đặc biệt đã được chế tạo: những robot khổng lồ, được gọi là Jaegers, được điều khiển đồng thời bởi hai phi công...',

    backdropUrl: '/images/pacific-rim-backdrop.jpg' 
  };

  return (
    <section className="relative w-full h-[70vh] text-white">
   
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${featuredMovie.backdropUrl})` }}
      >
    
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
      </div>

    
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl">
          <h2 className="text-4xl lg:text-6xl font-black mb-4 leading-tight tracking-wide">
            {featuredMovie.title}
          </h2>
          <p className="text-md lg:text-lg mb-8 leading-relaxed opacity-90">
            {featuredMovie.description}
          </p>
          <Link href="/dat-ve/1" 
            className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-500 transition-transform transform hover:scale-105 inline-block"
          >
            Đặt Vé Ngay
          </Link>
        </div>
      </div>
    </section>
  );
}