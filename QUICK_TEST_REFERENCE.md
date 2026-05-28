# ⚡ QUICK REFERENCE - LỆNH NHANH CHO TEST

---

## 🚀 KHỞI ĐỘNG (5 phút)

```bash
# 1. Cài dependencies
cd /home/asus/Van_Phong_Pham_Shop
npm install

# 2. Kiểm tra file .env
cat .env

# 3. Chạy server
npm start

# 4. (Mở tab terminal mới) Seed dữ liệu (tùy chọn)
npm run seed

# ✅ Kết quả: http://localhost:3000 chạy thành công
```

---

## 📦 MONGODB KIỂM TRA NHANH

```bash
# Mở MongoDB Shell
mongosh

# Trong MongoDB Shell:
use van_phong_pham_shop
show collections
db.products.countDocuments()
db.products.find().limit(1).pretty()
db.users.find().pretty()
```

---

## 🌐 POSTMAN/THUNDER CLIENT - QUICK TESTS

### **Base URL:** `http://localhost:3000`

---

### **1️⃣ KIỂM TRA API CÓ HOẠT ĐỘNG**

#### Lấy danh sách sản phẩm
```http
GET /api/products
```
**Kỳ vọng:** 200 + 10+ products

#### Tìm kiếm
```http
GET /api/products?search=bút
```

#### Lọc danh mục
```http
GET /api/products?category=Bút
```

#### Chi tiết sản phẩm
```http
GET /api/products/{ID_SẢN_PHẨM}
```

---

### **2️⃣ REGISTER & LOGIN**

#### Đăng ký
```http
POST /api/users/auth/register
Content-Type: application/json

{
  "username": "testuser1",
  "email": "test1@example.com",
  "password": "Test@12345",
  "confirmPassword": "Test@12345"
}
```
**Kỳ vọng:** 201 Created

#### Đăng nhập
```http
POST /api/users/auth/login
Content-Type: application/json

{
  "email": "test1@example.com",
  "password": "Test@12345"
}
```
**Kỳ vọng:** 200 OK

#### Lấy profile
```http
GET /api/users/profile/me
```
**Kỳ vọng:** 200 OK (nếu đã login) hoặc 401 (chưa login)

---

### **3️⃣ CRUD ADMIN (Cần đăng nhập với Admin)**

#### Tạo sản phẩm
```http
POST /api/products
Content-Type: multipart/form-data

Fields:
- sku: SOH-001
- name: Sổ tay da
- price: 50000
- stock: 50
- category: Sổ
- description: Sổ tay bìa da cao cấp
- image: [chọn file]
```
**Kỳ vọng:** 201 Created

#### Cập nhật sản phẩm
```http
PUT /api/products/{PRODUCT_ID}
Content-Type: application/json

{
  "name": "Sổ tay da (mới)",
  "price": 55000,
  "stock": 45
}
```
**Kỳ vọng:** 200 OK

#### Xóa sản phẩm
```http
DELETE /api/products/{PRODUCT_ID}
```
**Kỳ vọng:** 200 OK

---

## ✅ CHECKLIST NHANH

Tick từng cái khi thành công:

```
□ npm install ✓
□ npm start (server chạy)
□ MongoDB kết nối
□ GET /api/products (200 + data)
□ POST register (201)
□ POST login (200)
□ GET profile (200 hoặc 401)
□ POST create product (201) [Admin]
□ PUT update product (200) [Admin]
□ DELETE delete product (200) [Admin]
□ Kiểm tra dữ liệu trong MongoDB
```

---

## 🐛 LỖI PHỔ BIẾN & CÁC CẢI

| Lỗi | Giải pháp |
|-----|----------|
| **Cannot connect to MongoDB** | `mongod` hoặc kiểm tra MONGODB_URI trong .env |
| **Cannot find module** | `npm install` |
| **Port 3000 in use** | `lsof -i :3000` để tìm process, sau đó kill |
| **401 Unauthorized (Admin)** | Đăng nhập với tài khoản Admin |
| **Email already exists** | Dùng email khác hoặc xóa user: `db.users.deleteOne({email: "..."})` |

---

## 📊 EXPECTED RESPONSES

### ✅ Success 
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### ❌ Error
```json
{
  "success": false,
  "message": "Lỗi gì đó"
}
```

---

## 💡 TIPS

- Dùng `console.log()` để debug
- Xem terminal log để hiểu lỗi
- Kiểm tra MongoDB Shell sau mỗi CRUD
- Lưu Bearer token từ login để test protected endpoints

---

**In hoặc bookmark trang này để reference nhanh!** 📌
