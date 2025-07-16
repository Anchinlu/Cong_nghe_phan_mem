// frontend/src/app/gia-ve/page.tsx
"use client";

import { useState, useEffect, useMemo } from 'react';

interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
}

interface TicketPrice {
  id: number;
  day_type: string;
  age_group: string;
  price: number;
}

export default function TicketPricePage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [prices, setPrices] = useState<TicketPrice[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedTheaterId, setSelectedTheaterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheaters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8080/theaters');
        const data = await res.json();
        setTheaters(data);
        if (data.length > 0) {
          const firstCity = data[0].city;
          setSelectedCity(firstCity);
          const firstTheaterInCity = data.find((t: Theater) => t.city === firstCity);
          if (firstTheaterInCity) {
            setSelectedTheaterId(firstTheaterInCity.id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch theaters", error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchTheaters();
  }, []);

  useEffect(() => {
    if (selectedTheaterId) {
      const fetchPrices = async () => {
        try {
          const res = await fetch(`http://localhost:8080/theaters/${selectedTheaterId}/prices`);
          const data = await res.json();
          setPrices(data);
        } catch (error) {
          console.error("Failed to fetch prices", error);
          setPrices([]);
        }
      };
      void fetchPrices();
    }
  }, [selectedTheaterId]);

  const cities = useMemo(() => [...new Set(theaters.map(t => t.city))], [theaters]);
  const filteredTheaters = useMemo(() => theaters.filter(t => t.city === selectedCity), [theaters, selectedCity]);

  const pricesByDayType = useMemo(() => {
    return prices.reduce((acc, price) => {
      const dayType = price.day_type;
      if (!acc[dayType]) {
        acc[dayType] = [];
      }
      acc[dayType].push(price);
      return acc;
    }, {} as Record<string, TicketPrice[]>);
  }, [prices]);

  if (isLoading) {
    return <div className="text-center text-white py-20">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Bảng Giá Vé</h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-800 p-4 rounded-lg mb-8">
        <div>
          <label htmlFor="city-select" className="font-semibold mr-2">Tỉnh/Thành:</label>
          <select
            id="city-select"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              const firstTheaterInNewCity = theaters.find(t => t.city === e.target.value);
              if(firstTheaterInNewCity) setSelectedTheaterId(firstTheaterInNewCity.id.toString());
            }}
            className="bg-gray-700 p-2 rounded-md"
          >
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="theater-select" className="font-semibold mr-2">Cụm rạp:</label>
          <select
            id="theater-select"
            value={selectedTheaterId}
            onChange={(e) => setSelectedTheaterId(e.target.value)}
            className="bg-gray-700 p-2 rounded-md"
          >
            {filteredTheaters.map(theater => <option key={theater.id} value={theater.id}>{theater.name}</option>)}
          </select>
        </div>
      </div>

      {/* Bảng giá vé */}
      <div className="bg-gray-900/50 p-6 rounded-lg">
        {Object.entries(pricesByDayType).map(([dayType, priceList]) => (
          <div key={dayType} className="mb-6 last:mb-0">
            <h2 className="text-xl font-bold text-sky-400 mb-4 border-b-2 border-sky-500 pb-2">
              {dayType === 'NGAY_THUONG' ? 'Thứ 2 - Thứ 6' : 'Thứ 7 & Chủ Nhật'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {priceList.map(price => (
                <div key={price.id} className="bg-gray-800 p-4 rounded-md">
                  <p className="font-semibold">{price.age_group}</p>
                  <p className="text-2xl font-bold text-yellow-400 mt-1">
                    {price.price.toLocaleString('vi-VN')}
                    <span className="text-sm font-normal text-gray-400"> VNĐ</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {prices.length === 0 && <p className="text-center text-gray-500">Không có thông tin giá vé cho rạp này.</p>}
      </div>
    </div>
  );
}