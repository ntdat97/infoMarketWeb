Chi tiết về project và các hình ảnh screenshot nằm ở file LuanVan_NguyenTanDat_C1800005.pdf

Công cụ cần thiết:
- Docker
- npm
- react-native cli
- yarn
- Máy ảo android studio hoặc máy thật có bật chế độ usb debug

** Web

Bước 1: Tại địa chỉ source gốc chạy lệnh: "yarn" hoặc "npm install".
Bước 2: Lần lượt chạy các lệnh
- Khởi động container của docker: chạy docker desktop -> chuột phải vào file docker-compose.yml -> compose up hoặc tạo docker container với cấu hình như file  docker-compose.yml
- Tạo cơ sở dữ liệu của prisma: "npx prisma generate" 
Bước 3: Chạy website với port 124 (ứng dụng di động chạy local với port 124): "yarn dev -p 124"

** Mobile

Bước 1: Cần lấy địa chỉ ip local của wifi và thay thế vào địa chỉ trong file .env (192.168.1.104). Sau đó chạy server web để nhận API (nhớ tắt tường lửa public ip)
Bước 2: Khởi động máy ảo của android studio hoặc kết nối máy thật
Bước 3: Tại địa chỉ source gốc chạy lệnh: "yarn" hoặc "npm install"
Bước 4: Chạy lệnh: "npx react-native run-android"
