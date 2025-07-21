"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Theater {
  id: number;
  name: string;
  address: string;
  city: string;
}

const initialFormState = { name: '', address: '', city: '' };

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (user?.role !== 'admin') {
      if (!user) router.push('/dang-nhap');
      else router.push('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/theaters`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Không thể tải danh sách rạp.');
        const data = await res.json();
        setTheaters(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [user, router, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const url = isEditing
      ? `${process.env.NEXT_PUBLIC_API_URL}/admin/theaters/${isEditing}`
      : `${process.env.NEXT_PUBLIC_API_URL}/admin/theaters`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Thao tác không thành công.');
      }
      const updatedTheater = await res.json();
      if (isEditing) {
        setTheaters(theaters.map(t => t.id === isEditing ? updatedTheater : t));
        alert('Cập nhật rạp thành công!');
      } else {
        setTheaters([updatedTheater, ...theaters]);
        alert('Thêm rạp mới thành công!');
      }
      setIsEditing(null);
      setFormData(initialFormState);
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
    }
  };

  const handleDelete = async (theaterId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa rạp này không?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/theaters/${theaterId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Xóa rạp không thành công.');
        setTheaters(theaters.filter(t => t.id !== theaterId));
        alert('Đã xóa rạp thành công!');
      } catch (err: unknown) {
        if (err instanceof Error) alert(err.message);
      }
    }
  };

  const handleEditClick = (theater: Theater) => {
    setIsEditing(theater.id);
    setFormData({ name: theater.name, address: theater.address, city: theater.city });
  };

  if (isLoading) return <div className="text-center text-white py-20">Đang tải...</div>;
  if (user?.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Rạp Chiếu Phim</h1>
        <Link href="/admin/dashboard" className="text-sky-400 hover:underline">Quay lại Dashboard</Link>
      </div>

      {/* Form thêm/sửa */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Chỉnh Sửa Rạp' : 'Thêm Rạp Mới'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Tên rạp</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nhập tên rạp"
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium">Địa chỉ</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Nhập địa chỉ"
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium">Thành phố</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Nhập thành phố"
              className="mt-1 block w-full bg-gray-700 p-2 rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md w-full">
              {isEditing ? 'Cập nhật' : 'Thêm'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(null); setFormData(initialFormState); }} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tên Rạp</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Thành Phố</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {theaters.map((theater) => (
              <tr key={theater.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium">{theater.name}</td>
                <td className="px-6 py-4">{theater.address}</td>
                <td className="px-6 py-4">{theater.city}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEditClick(theater)} className="text-sky-400 hover:text-sky-300 mr-4">Sửa</button>
                  <button onClick={() => handleDelete(theater.id)} className="text-red-500 hover:text-red-400">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
