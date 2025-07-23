# 🎬 CineBooking

> Hệ thống đặt vé xem phim trực tuyến với đầy đủ chức năng đặt vé, xem lịch chiếu, quản lý rạp và người dùng.

---

## 🚀 Hướng dẫn cài đặt và chạy ứng dụng

Để chạy dự án **CineBooking** trên máy tính cá nhân, bạn cần đảm bảo đã cài đặt:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [Node.js và npm](https://nodejs.org/)

---

### 1. 📥 Cài đặt và chạy ứng dụng

```bash
# Clone project về máy
git clone https://github.com/Anchinlu/Cong_nghe_phan_mem.git
cd Cong_nghe_phan_mem

# Tạo file .env cho backend
cd backend
cp .env.example .env  # hoặc tự tạo .env và thêm thông tin cần thiết

# Quay lại thư mục gốc và chạy docker-compose
cd ..
docker-compose up --build

🌐 Truy cập ứng dụng
Frontend (Web): http://localhost:3000

Backend (Swagger API Docs): http://localhost:8080/api-docs

📁 Liên kết Repository
🔗 GitHub: https://github.com/Anchinlu/Cong_nghe_phan_mem

🌍 Demo trực tuyến
Frontend (Vercel): https://cong-nghe-phan-mem.vercel.app/

Backend (Render): https://cinebooking-backend.onrender.com


