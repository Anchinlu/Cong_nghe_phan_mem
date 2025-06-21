# Sử dụng một image Node.js nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Copy các file quản lý package và cài đặt dependencies
# Việc copy riêng này giúp tận dụng cache của Docker, lần build sau sẽ nhanh hơn
COPY package*.json ./
RUN npm install

# Copy toàn bộ code còn lại của project
COPY . .

# Mở cổng 8080 để có thể truy cập từ bên ngoài
EXPOSE 8080

# Chạy ứng dụng ở chế độ development (watch mode)
# Đây là thay đổi quan trọng nhất!
CMD ["npm", "run", "start:dev"]