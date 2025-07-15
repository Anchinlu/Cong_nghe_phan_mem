// frontend/src/app/cum-rap/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
}

export default function TheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheaters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8080/theaters');
        const data = await res.json();
        setTheaters(data);
        if (data.length > 0) {
          const allCities = [...new Set(data.map((t: Theater) => t.city))];
          setSelectedCity(allCities[0] as string);
        }
      } catch (error) {
        console.error("Failed to fetch theaters", error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchTheaters();
  }, []);

  const cities = useMemo(() => [...new Set(theaters.map(t => t.city))], [theaters]);
  const filteredTheaters = useMemo(() => {
    return theaters.filter(t => t.city === selectedCity);
  }, [theaters, selectedCity]);

  if (isLoading) {
    return <div className="text-center text-white py-20">Đang tải danh sách rạp...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Hệ Thống Cụm Rạp</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cột chọn Tỉnh/Thành */}
        <div className="md:w-1/4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tỉnh/Thành</h2>
            <ul className="space-y-2">
              {cities.map(city => (
                <li key={city}>
                  <button 
                    onClick={() => setSelectedCity(city)}
                    className={`w-full text-left p-3 rounded-md transition-colors text-sm ${
                      selectedCity === city
                        ? 'bg-sky-500 text-white font-bold'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Cột hiển thị Rạp */}
        <div className="md:w-3/4">
            <div className="space-y-4">
              {filteredTheaters.length > 0 ? (
                filteredTheaters.map(theater => (
                  <Link 
                    href={`/rap/${theater.id}`} 
                    key={theater.id}
                    className="block bg-gray-900/50 p-6 rounded-lg hover:ring-2 hover:ring-sky-500 transition-all"
                  >
                    <h3 className="text-lg font-bold text-sky-400">{theater.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{theater.address}</p>
                  </Link>
                ))
              ) : (
                <div className="bg-gray-900/50 p-6 rounded-lg text-center text-gray-500">
                    Không có rạp nào tại khu vực đã chọn.
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}