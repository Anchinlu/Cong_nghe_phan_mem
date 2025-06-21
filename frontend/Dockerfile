FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Copy file package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ code còn lại
COPY . .

# Mở cổng 3000 để truy cập từ bên ngoài
EXPOSE 3000

# Lệnh để chạy server development của Next.js
CMD ["npm", "run", "dev"]