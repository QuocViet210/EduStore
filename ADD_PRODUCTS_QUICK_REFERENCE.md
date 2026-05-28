# ⚡ QUICK REFERENCE - LỆNH MONGODB & API THÊMSẢN PHẨM

**Copy-paste sẵn sàng! Chỉ cần thay đổi các giá trị cụ thể.**

---

## 🚀 KHỞI ĐỘNG NHANH (3 lệnh)

```bash
# 1. Seed dữ liệu ban đầu
npm run seed

# 2. Chạy server
npm start

# 3. Mở terminal mới, kiểm tra MongoDB
mongosh
```

---

## 📦 MONGODB SHELL - KIỂM TRA DỮ LIỆU

### Mở & chọn database

```javascript
// Mở MongoDB Shell
mongosh

// Chọn database
use van_phong_pham_shop

// Xem collections
show collections
```

---

### Kiểm tra sản phẩm

```javascript
// Tất cả sản phẩm
db.products.find().pretty()

// Đếm sản phẩm
db.products.countDocuments()

// 3 sản phẩm đầu tiên
db.products.find().limit(3).pretty()

// Tìm sản phẩm theo SKU
db.products.find({ sku: "BUT-001" }).pretty()

// Tìm sản phẩm theo danh mục
db.products.find({ category: "Bút" }).pretty()

// Sắp xếp theo giá (thấp → cao)
db.products.find().sort({ price: 1 }).pretty()

// Sắp xếp theo giá (cao → thấp)
db.products.find().sort({ price: -1 }).pretty()
```

---

### Kiểm tra users

```javascript
// Tất cả users
db.users.find().pretty()

// Đếm users
db.users.countDocuments()

// Tìm user theo email
db.users.find({ email: "admin@vanphongpham.vn" }).pretty()

// Users theo role
db.users.find({ role: "admin" }).pretty()
db.users.find({ role: "user" }).pretty()
```

---

### Thêm sản phẩm trực tiếp (MongoDB Shell)

```javascript
// Thêm 1 sản phẩm
db.products.insertOne({
    sku: "SOH-NEW-001",
    name: "Sổ tay mới",
    price: 75000,
    stock: 50,
    category: "Sổ",
    description: "Sổ tay bìa da cao cấp",
    imageUrl: "/img/soh-new-001.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
})
```

```javascript
// Thêm nhiều sản phẩm cùng lúc
db.products.insertMany([
    {
        sku: "KHAC-001",
        name: "Bộ bút màu 12 cây",
        price: 65000,
        stock: 30,
        category: "Khác",
        description: "Bộ 12 bút màu lì",
        imageUrl: "/img/bo-but-12.png",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        sku: "KHAC-002",
        name: "Bộ marker 8 cây",
        price: 95000,
        stock: 20,
        category: "Khác",
        description: "Bộ 8 marker",
        imageUrl: "/img/bo-marker-8.png",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
])
```

---

### Cập nhật sản phẩm

```javascript
// Cập nhật giá
db.products.updateOne(
    { sku: "BUT-001" },
    { $set: { price: 6000 } }
)

// Cập nhật nhiều fields
db.products.updateOne(
    { sku: "BUT-001" },
    { 
        $set: { 
            price: 6000,
            stock: 80,
            description: "Bút bi xanh mới"
        } 
    }
)
```

---

### Xóa sản phẩm

```javascript
// Xóa sản phẩm (hard delete - xóa vĩnh viễn)
db.products.deleteOne({ sku: "SOH-NEW-001" })

// Soft delete (chỉ ẩn)
db.products.updateOne(
    { sku: "SOH-NEW-001" },
    { $set: { isActive: false } }
)
```

---

## 🌐 POSTMAN/THUNDER CLIENT - API

### Các request cơ bản

**Base URL:** `http://localhost:3000`

---

### 1. Lấy danh sách sản phẩm

```http
GET http://localhost:3000/api/products
```

**Query parameters:**
```
?page=1&limit=10&search=bút&category=Bút
```

---

### 2. Lấy chi tiết sản phẩm

```http
GET http://localhost:3000/api/products/PRODUCT_ID
```

---

### 3. Đăng ký

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

---

### 4. Đăng nhập

```http
POST http://localhost:3000/api/users/auth/login
Content-Type: application/json

{
  "email": "admin@vanphongpham.vn",
  "password": "admin123"
}
```

---

### 5. Tạo sản phẩm (Admin)

```http
POST http://localhost:3000/api/products
Content-Type: multipart/form-data

Body (Form-data):
sku: SOH-NEW-001
name: Sổ tay da cao cấp
price: 85000
stock: 50
category: Sổ
description: Sổ tay bìa da cao cấp
image: [chọn file]
```

---

### 6. Cập nhật sản phẩm (Admin)

```http
PUT http://localhost:3000/api/products/PRODUCT_ID
Content-Type: application/json

{
  "name": "Sổ tay da (cập nhật)",
  "price": 90000,
  "stock": 45
}
```

---

### 7. Xóa sản phẩm (Admin)

```http
DELETE http://localhost:3000/api/products/PRODUCT_ID
```

---

## 📋 CHECKLIST NHANH

```
✓ npm run seed
✓ npm start
✓ mongosh
✓ use van_phong_pham_shop
✓ show collections
✓ db.products.countDocuments()
✓ db.products.find().limit(1).pretty()
✓ Postman: GET /api/products
✓ Postman: POST /register
✓ Postman: POST /login
✓ Postman: POST /api/products (create)
✓ MongoDB: db.products.find({sku: "SOH-NEW-001"})
✓ Verify dữ liệu được lưu ✅
```

---

## 🔄 WORKFLOW HOÀN CHỈNH

```
1️⃣  npm run seed
    ↓
2️⃣  npm start
    ↓
3️⃣  mongosh → use van_phong_pham_shop
    ↓
4️⃣  db.products.countDocuments() → 10
    ↓
5️⃣  Postman: POST /register (tạo user)
    ↓
6️⃣  Postman: POST /login (đăng nhập)
    ↓
7️⃣  Postman: POST /api/products (thêm sản phẩm)
    ↓
8️⃣  MongoDB: db.products.find({sku: "..."})
    ↓
9️⃣  ✅ Verify dữ liệu được lưu thành công
```

---

## 💾 TEMPLATE SẢN PHẨM

### Sản phẩm loại "Bút"
```javascript
{
    sku: "BUT-NEW-001",
    name: "Bút bi màu xanh",
    price: 5000,
    stock: 100,
    category: "Bút",
    description: "Bút bi viết mượt, mực xanh",
    imageUrl: "/img/but-new-001.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}
```

### Sản phẩm loại "Sổ"
```javascript
{
    sku: "SOH-NEW-001",
    name: "Sổ tay da cao cấp",
    price: 85000,
    stock: 50,
    category: "Sổ",
    description: "Sổ tay bìa da cao cấp, 100 trang",
    imageUrl: "/img/soh-new-001.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}
```

### Sản phẩm loại "Dấu"
```javascript
{
    sku: "DAU-NEW-001",
    name: "Dấu tròn đỏ",
    price: 18000,
    stock: 75,
    category: "Dấu",
    description: "Dấu tròn màu đỏ",
    imageUrl: "/img/dau-tron-do.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}
```

### Sản phẩm loại "Khác"
```javascript
{
    sku: "KHAC-NEW-001",
    name: "Bộ bút màu 12 cây",
    price: 65000,
    stock: 30,
    category: "Khác",
    description: "Bộ 12 bút màu lì",
    imageUrl: "/img/bo-but-12.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
}
```

---

## 🎯 LỖI THƯỜNG GẶP & CẢI

| Lỗi | Lệnh Check | Cách Fix |
|-----|-----------|---------|
| MongoDB not running | `mongod -v` | `mongod` |
| Cannot connect | `mongosh --version` | Start MongoDB |
| Collection empty | `db.products.count()` | `npm run seed` |
| Duplicate SKU | `db.products.findOne({sku: "..."})` | Dùng SKU khác |
| No data in API | `npm start` | Start server |

---

## 📌 PIN LẸN MỨC

**Copy-paste cho seed dữ liệu:**
```bash
npm run seed && mongosh
```

**Copy-paste cho thêm sản phẩm (MongoDB):**
```javascript
db.products.insertOne({
    sku: "NEW-001",
    name: "Tên sản phẩm",
    price: 50000,
    stock: 100,
    category: "Sổ",
    description: "Mô tả",
    imageUrl: "/img/image.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
})
```

**Copy-paste cho thêm sản phẩm (API - Postman):**
```
POST http://localhost:3000/api/products
Form-data:
sku: NEW-001
name: Tên sản phẩm
price: 50000
stock: 100
category: Sổ
description: Mô tả
image: [chọn file]
```

---

**Tài liệu được cập nhật:** 26/05/2026
