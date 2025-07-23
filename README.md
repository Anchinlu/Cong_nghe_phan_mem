1. Hướng dẫn cài đặt và chạy ứng dụng
Để cài đặt và chạy dự án CineBooking trên máy tính cá nhân, cần đảm bảo các công cụ sau đã được cài đặt:

Docker Desktop: Công cụ để quản lý và chạy các container.

Git: Hệ thống quản lý phiên bản phân tán.

Node.js và npm: Môi trường chạy và quản lý các gói phụ thuộc cho JavaScript.

Các bước thực hiện:

Sao chép mã nguồn:
Mở terminal và chạy lệnh sau để sao chép (clone) repository của dự án về máy:

git clone https://github.com/Anchinlu/Cong_nghe_phan_mem.git

Cấu hình biến môi trường:

Di chuyển vào thư mục backend của dự án.

Tạo một file mới tên là .env.

Sao chép toàn bộ nội dung từ file .env.example (nếu có) hoặc điền các thông tin cần thiết như sau:

# Cấu hình Cơ sở dữ liệu
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name

# Khóa bí mật cho JWT
JWT_SECRET=your_super_secret_key

# Cấu hình gửi Email
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_google_app_password

Khởi chạy hệ thống:

Quay lại thư mục gốc của dự án.

Mở terminal và chạy lệnh sau:

docker-compose up --build

Lệnh này sẽ tự động build các image cho frontend và backend, sau đó khởi tạo toàn bộ 3 container (database, backend, frontend).

Truy cập ứng dụng:

Frontend (Trang web): Mở trình duyệt và truy cập địa chỉ http://localhost:3000.

Backend (API Docs): Truy cập http://localhost:8080/api-docs để xem tài liệu API Swagger.

2. Liên kết GitHub Repository
Toàn bộ mã nguồn của dự án được lưu trữ và quản lý tại repository sau:

URL: https://github.com/Anchinlu/Cong_nghe_phan_mem

8.3. Liên kết Demo sản phẩm
Ứng dụng đã được triển khai và có thể truy cập trực tuyến tại các địa chỉ sau:

Frontend (Vercel): https://cong-nghe-phan-mem.vercel.app/

Backend (Render): https://cinebooking-backend.onrender.com
