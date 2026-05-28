# 🧪 HƯỚNG DẪN TEST CHI TIẾT CHO NEWBIE
## Van Phong Pham Shop - Backend Testing Guide

---

## 📋 MỤC LỤC
1. [Chuẩn bị môi trường](#-chuẩn-bị-môi-trường)
2. [Cài đặt Dependencies](#-cài-đặt-dependencies)
3. [Khởi chạy ứng dụng](#-khởi-chạy-ứng-dụng)
4. [Kiểm tra MongoDB](#-kiểm-tra-mongodb)
5. [Demo API với Postman/Thunder Client](#-demo-api-với-postmanthunder-client)
6. [Kiểm tra từng tính năng](#-kiểm-tra-từng-tính-năng)
7. [Troubleshooting](#-troubleshooting)

---

## 🛠️ CHUẨN BỊ MÔI TRƯỜNG

### **Yêu cầu cơ bản:**
- Node.js v14+ (`node -v`)
- npm v6+ (`npm -v`)
- MongoDB (local hoặc Atlas)
- Postman hoặc Thunder Client (để test API)

### **Kiểm tra các công cụ đã cài:**
```bash
node -v          # Check Node.js version
npm -v           # Check npm version
mongod -v        # Check MongoDB version (nếu cài local)
```

---

## 📦 CÀI ĐẶT DEPENDENCIES

### **Bước 1: Di chuyển vào thư mục dự án**
```bash
cd /home/asus/Van_Phong_Pham_Shop
```

### **Bước 2: Cài đặt các package**
```bash
npm install
```

**Kết quả thành công:**
```
added 87 packages, and audited 88 packages in 2s
```

### **Bước 3: Kiểm tra file `.env`**
Tạo file `.env` nếu chưa có:
```bash
cat > .env << EOF
# Database
MONGODB_URI=mongodb://localhost:27017/van_phong_pham_shop
# hoặc nếu dùng MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/van_phong_pham_shop

# Session
SESSION_SECRET=vanphongpham_secret

# Server
PORT=3000
NODE_ENV=development
EOF
```

✅ **Kết quả:** File `.env` được tạo với các cấu hình cơ bản

---

## 🚀 KHỞI CHẠY ỨNG DỤNG

### **Option 1: Chạy server**
```bash
npm start
```

**Kết quả thành công (xem terminal):**
```
✅ MongoDB connected successfully
⚡ Server running at http://localhost:3000
```

### **Option 2: Chạy server + Seed dữ liệu (tùy chọn)**
```bash
# Chạy seed data vào MongoDB một lần
npm run seed

# Sau đó chạy server
npm start
```

**Kết quả:**
```
✅ Seeding 10 products into MongoDB...
✅ Seed data inserted successfully
✅ MongoDB connected successfully
⚡ Server running at http://localhost:3000
```

### **Kiểm tra server đã chạy:**
```bash
# Mở terminal mới
curl http://localhost:3000
# Sẽ hiển thị HTML của trang chủ (thành công)
```

---

## 🗄️ KIỂM TRA MONGODB

### **Bước 1: Mở MongoDB Shell**
```bash
# Nếu MongoDB chạy local
mongosh

# hoặc trên hệ thống cũ
mongo
```

### **Bước 2: Kiểm tra database**
```javascript
// Xem tất cả databases
show databases

// Chọn database của dự án
use van_phong_pham_shop

// Xem tất cả collections
show collections
```

**Kết quả (nên có 3 collections):**
```
users
products
orders
```

### **Bước 3: Kiểm tra dữ liệu trong collection**
```javascript
// Xem số lượng sản phẩm
db.products.countDocuments()

// Xem 2 sản phẩm đầu tiên
db.products.find().limit(2).pretty()

// Xem tất cả người dùng
db.users.find().pretty()

// Xem tất cả đơn hàng
db.orders.find().pretty()
```

**Kết quả thành công:**
```javascript
{
  "_id": ObjectId("..."),
  "sku": "BUT-001",
  "name": "Bút bi xanh",
  "price": 5000,
  "stock": 100,
  "category": "Bút",
  "description": "Bút mực xanh ngòi 0.5mm",
  "imageUrl": "/img/pen_01.png",
  "isActive": true,
  "createdAt": ISODate("2024-05-22T10:30:00.000Z"),
  "updatedAt": ISODate("2024-05-22T10:30:00.000Z")
}
```

---

## 🌐 DEMO API VỚI POSTMAN/THUNDER CLIENT

### **Cài đặt Postman/Thunder Client**

#### **Postman:**
- Tải từ: https://www.postman.com/downloads/
- Chạy ứng dụng

#### **Thunder Client (VS Code Extension):**
- Mở VS Code
- Tìm "Thunder Client" trong Extensions Marketplace
- Cài đặt

---

### **🔑 THIẾT LẬP CĂN BẢN**

**Base URL cho tất cả request:**
```
http://localhost:3000
```

**Headers mặc định (nếu cần):**
```
Content-Type: application/json
```

---

## ✅ KIỂM TRA TỪNG TÍNH NĂNG

### **1️⃣ KIỂM TRA API CÓ HOẠT ĐỘNG KHÔNG?**

#### **Test 1: Lấy danh sách sản phẩm (GET)**
```http
GET http://localhost:3000/api/products
```

**Kết quả mong đợi (200 OK):**
```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "sku": "BUT-001",
        "name": "Bút bi xanh",
        "price": 5000,
        "stock": 100,
        "category": "Bút",
        "description": "Bút mực xanh ngòi 0.5mm",
        "imageUrl": "/img/pen_01.png",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 10
    }
  }
}
```

✅ **Thành công:** API có response hợp lệ, MongoDB có dữ liệu

❌ **Lỗi:** Kiểm tra [Troubleshooting](#-troubleshooting)

---

#### **Test 2: Lấy chi tiết sản phẩm (GET)**
```http
GET http://localhost:3000/api/products/507f1f77bcf86cd799439011
```
*(Thay ID từ kết quả Test 1)*

**Kết quả mong đợi (200 OK):**
```json
{
  "success": true,
  "message": "Lấy thông tin sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "BUT-001",
    "name": "Bút bi xanh",
    "price": 5000,
    "stock": 100,
    "category": "Bút"
  }
}
```

---

#### **Test 3: Tìm kiếm sản phẩm**
```http
GET http://localhost:3000/api/products?search=bút&limit=5
```

**Kết quả mong đợi (200 OK):**
- Có danh sách sản phẩm khớp với từ khóa "bút"

---

#### **Test 4: Lọc theo danh mục**
```http
GET http://localhost:3000/api/products?category=Bút&page=1
```

**Kết quả mong đợi (200 OK):**
- Chỉ hiển thị sản phẩm từ danh mục "Bút"

---

### **2️⃣ KIỂM TRA AUTHENTICATION (LOGIN/REGISTER)**

#### **Test 1: Đăng ký tài khoản (Register)**
```http
POST http://localhost:3000/api/users/auth/register
Content-Type: application/json

{
  "username": "testuser123",
  "email": "testuser@example.com",
  "password": "Test@12345",
  "confirmPassword": "Test@12345"
}
```

**Kết quả thành công (201 Created):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "_id": "507f...",
    "username": "testuser123",
    "email": "testuser@example.com",
    "role": "user",
    "isActive": true
  }
}
```

✅ **Thành công:** Người dùng được tạo trong MongoDB

❌ **Email trùng (400):**
```json
{
  "success": false,
  "message": "Email này đã được đăng ký"
}
```

---

#### **Test 2: Đăng nhập (Login)**
```http
POST http://localhost:3000/api/users/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "Test@12345"
}
```

**Kết quả thành công (200 OK):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "_id": "507f...",
    "username": "testuser123",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```

✅ **Thành công:** Session được tạo, có thể sử dụng tài khoản

❌ **Email/Password sai (401):**
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác"
}
```

---

#### **Test 3: Lấy thông tin user hiện tại**
```http
GET http://localhost:3000/api/users/profile/me
```

**Kết quả:**
- Nếu chưa login: 401 Unauthorized
- Nếu đã login: 200 OK + thông tin user

---

### **3️⃣ KIỂM TRA CRUD OPERATIONS (ADMIN)**

**Lưu ý:** Những API này cần quyền **Admin**

#### **Test 1: Tạo sản phẩm mới (CREATE)**
```http
POST http://localhost:3000/api/products
Content-Type: multipart/form-data

Body:
- sku: "SOH-001"
- name: "Sổ tay da"
- price: 50000
- stock: 50
- category: "Sổ"
- description: "Sổ tay bìa da cao cấp"
- image: <chọn file ảnh>
```

**Kết quả thành công (201 Created):**
```json
{
  "success": true,
  "message": "Thêm sản phẩm thành công",
  "data": {
    "_id": "507f...",
    "sku": "SOH-001",
    "name": "Sổ tay da",
    "price": 50000,
    "stock": 50,
    "category": "Sổ"
  }
}
```

✅ **Kiểm tra:** Truy vấn MongoDB để xác nhận dữ liệu
```javascript
db.products.find({ sku: "SOH-001" }).pretty()
```

---

#### **Test 2: Cập nhật sản phẩm (UPDATE)**
```http
PUT http://localhost:3000/api/products/507f...
Content-Type: application/json

{
  "name": "Sổ tay da (cập nhật)",
  "price": 55000,
  "stock": 45
}
```

**Kết quả thành công (200 OK):**
```json
{
  "success": true,
  "message": "Cập nhật sản phẩm thành công",
  "data": {
    "_id": "507f...",
    "name": "Sổ tay da (cập nhật)",
    "price": 55000,
    "stock": 45
  }
}
```

✅ **Kiểm tra:** Truy vấn lại để xác nhận thay đổi
```javascript
db.products.findById(ObjectId("507f..."))
```

---

#### **Test 3: Xóa sản phẩm (DELETE)**
```http
DELETE http://localhost:3000/api/products/507f...
```

**Kết quả thành công (200 OK):**
```json
{
  "success": true,
  "message": "Xóa sản phẩm thành công"
}
```

✅ **Kiểm tra:** Sản phẩm không còn trong database hoặc `isActive: false`
```javascript
db.products.findById(ObjectId("507f..."))
// hoặc
db.products.countDocuments({ sku: "SOH-001" })
```

---

### **4️⃣ KIỂM TRA MONGODB LƯU DỮ LIỆU**

Sau khi chạy các test trên, kiểm tra MongoDB:

```bash
# Mở MongoDB Shell
mongosh

# Chọn database
use van_phong_pham_shop

# Kiểm tra số lượng sản phẩm (phải > 10 ban đầu)
db.products.countDocuments()

# Kiểm tra có user mới được tạo
db.users.find().pretty()

# Kiểm tra sản phẩm mới
db.products.find({ sku: "SOH-001" }).pretty()
```

✅ **Thành công:**
- Số lượng sản phẩm tăng
- Có user từ test register
- Dữ liệu được lưu đúng định dạng

---

## 📊 BẢNG TÓMMỜI CHỨC NĂNG

| # | Tính năng | Method | Endpoint | Status | Notes |
|---|----------|--------|----------|--------|-------|
| 1 | Danh sách sản phẩm | GET | `/api/products` | ✅ | Công khai |
| 2 | Chi tiết sản phẩm | GET | `/api/products/:id` | ✅ | Công khai |
| 3 | Tìm kiếm sản phẩm | GET | `/api/products?search=...` | ✅ | Công khai |
| 4 | Đăng ký | POST | `/api/users/auth/register` | ✅ | Công khai |
| 5 | Đăng nhập | POST | `/api/users/auth/login` | ✅ | Công khai |
| 6 | Thông tin user | GET | `/api/users/profile/me` | ✅ | Cần login |
| 7 | Tạo sản phẩm | POST | `/api/products` | ✅ | Cần Admin |
| 8 | Cập nhật sản phẩm | PUT | `/api/products/:id` | ✅ | Cần Admin |
| 9 | Xóa sản phẩm | DELETE | `/api/products/:id` | ✅ | Cần Admin |
| 10 | Thêm vào giỏ hàng | GET | `/cart/add/:id` | ✅ | View |

---

## 🐛 TROUBLESHOOTING

### **❌ Lỗi: "Cannot GET /"**
**Nguyên nhân:** Server không chạy
**Giải pháp:**
```bash
npm start
# Hoặc kiểm tra log
tail -f debug.log
```

### **❌ Lỗi: "MongooseError: Cannot connect to MongoDB"**
**Nguyên nhân:** MongoDB không chạy hoặc URI sai
**Giải pháp:**
```bash
# Kiểm tra MongoDB chạy
ps aux | grep mongod

# Hoặc khởi chạy MongoDB
mongod

# Hoặc kiểm tra file .env
cat .env | grep MONGODB_URI
```

### **❌ Lỗi: "Cannot find module 'express'"**
**Nguyên nhân:** Dependencies chưa cài
**Giải pháp:**
```bash
npm install
```

### **❌ Lỗi 401 Unauthorized khi tạo sản phẩm**
**Nguyên nhân:** Chưa login hoặc không phải Admin
**Giải pháp:**
1. Đăng nhập với tài khoản Admin
2. Hoặc kiểm tra role trong database:
```javascript
db.users.find({ email: "admin@..." }).pretty()
```

### **❌ Lỗi: "Email already exists"**
**Nguyên nhân:** Email đã được đăng ký
**Giải pháp:**
- Dùng email khác hoặc xóa user trong database:
```javascript
db.users.deleteOne({ email: "testuser@example.com" })
```

### **❌ Response quá chậm (> 5 giây)**
**Nguyên nhân:** Kết nối MongoDB chậm hoặc query lớn
**Giải pháp:**
```bash
# Kiểm tra kết nối MongoDB
mongosh --eval "db.adminCommand('ping')"

# Kiểm tra số lượng documents
mongosh --eval "use van_phong_pham_shop; db.products.countDocuments()"
```

---

## 📝 CHECKLIST TEST

Sử dụng checklist này để theo dõi tiến độ:

- [ ] ✅ MongoDB kết nối thành công
- [ ] ✅ Server chạy trên port 3000
- [ ] ✅ Lấy danh sách sản phẩm thành công (10+)
- [ ] ✅ Đăng ký tài khoản mới
- [ ] ✅ Đăng nhập với tài khoản vừa tạo
- [ ] ✅ Lấy thông tin user profile
- [ ] ✅ Tạo sản phẩm mới (cần Admin)
- [ ] ✅ Cập nhật sản phẩm
- [ ] ✅ Xóa sản phẩm
- [ ] ✅ Kiểm tra dữ liệu trong MongoDB sau mỗi thao tác
- [ ] ✅ Tìm kiếm sản phẩm hoạt động
- [ ] ✅ Lọc theo danh mục hoạt động

---

## 🎯 KẾT LUẬN

Khi hoàn thành tất cả các test trên, bạn đã xác nhận:

✅ **API hoạt động** - Tất cả endpoints response đúng  
✅ **CRUD hoạt động** - Có thể tạo, đọc, cập nhật, xóa sản phẩm  
✅ **MongoDB lưu dữ liệu** - Dữ liệu được lưu vĩnh viễn trong database  
✅ **Login/Register hoạt động** - Xác thực người dùng hoạt động  
✅ **Demo API** - Đã test với Postman/Thunder Client  

**🎉 Ứng dụng sẵn sàng cho development tiếp theo!**

---

## 📞 CẦN GIÚP?

Nếu có vấn đề:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem log: `tail -f debug.log`
3. Kiểm tra MongoDB Shell: `mongosh`
4. Xem file API_DOCUMENTATION.md để hiểu chi tiết API

---

**Cập nhật lần cuối:** 26/05/2026
**Phiên bản:** 1.0
