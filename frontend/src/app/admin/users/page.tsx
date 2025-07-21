"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho người dùng (không có mật khẩu)
interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (adminUser?.role !== 'admin') {
      if (!adminUser) router.push('/dang-nhap');
      else router.push('/');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Không thể tải danh sách người dùng.');
        const data = await res.json();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, [adminUser, router, token]);

  const handleDelete = async (userId: number) => {
    if (userId === adminUser?.id) {
      alert('Bạn không thể xóa chính tài khoản của mình.');
      return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không? Thao tác này không thể hoàn tác.')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Xóa người dùng không thành công.');

        setUsers(users.filter(u => u.id !== userId));
        alert('Đã xóa người dùng thành công!');
      } catch (err: unknown) {
        if (err instanceof Error) alert(err.message);
      }
    }
  };

  if (isLoading) return <div className="text-center text-white py-20">Đang tải...</div>;
  if (adminUser?.role !== 'admin') return null;

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
        <Link href="/admin/dashboard" className="text-sky-400 hover:underline">Quay lại Dashboard</Link>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Họ Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase">Vai trò</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700/50">
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4 font-medium">{user.fullName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-600 text-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    disabled={user.id === adminUser?.id}
                    aria-label={`Xóa người dùng ${user.fullName}`}
                    title={`Xóa người dùng ${user.fullName}`}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
