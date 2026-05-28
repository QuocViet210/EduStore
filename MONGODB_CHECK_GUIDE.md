# 🔍 HƯỚNG DẪN KIỂM TRA DỮ LIỆU MONGODB - CHI TIẾT

---

## 📋 MỤC LỤC
1. [Mở MongoDB Shell](#-mở-mongodb-shell)
2. [Lệnh kiểm tra cơ bản](#-lệnh-kiểm-tra-cơ-bản)
3. [Kiểm tra từng collection](#-kiểm-tra-từng-collection)
4. [Query nâng cao](#-query-nâng-cao)
5. [Visual Guide](#-visual-guide)
6. [Troubleshooting](#-troubleshooting)

---

## 🖥️ MỞ MONGODB SHELL

### Bước 1: Mở Terminal

```bash
# Trên Linux/Mac
mongosh

# Trên Windows (nếu MongoDB cài global)
mongosh
```

**Kết quả mong đợi:**
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
MongoServerSelectionError: ...  ← Nếu MongoDB không chạy

✅ mongodb shell version v2.0.0
  connecting to: mongodb://127.0.0.1:27017/?directConnection=true
  ✅ Connected successfully
```

✅ **Thành công:** Đã kết nối MongoDB!

### Bước 2: Chọn Database

```javascript
use van_phong_pham_shop
// Kết quả: switched to db van_phong_pham_shop
```

✅ **Thành công:** Đã chọn database!

---

## 📊 LỆNH KIỂM TRA CƠ BẢN

### 1️⃣ Xem tất cả databases
```javascript
show databases
```

**Kết quả mong đợi:**
```
admin                    40 KB
config                   12 KB
local                    72 KB
van_phong_pham_shop    120 KB     ← Database của chúng ta
```

---

### 2️⃣ Xem tất cả collections
```javascript
show collections
```

**Kết quả mong đợi:**
```
orders
products                 ← Sản phẩm
users                    ← Người dùng
```

✅ **Kiểm tra:** Phải có ít nhất 3 collections: `products`, `users`, `orders`

---

### 3️⃣ Đếm số document trong collection
```javascript
db.products.countDocuments()
```

**Kết quả mong đợi:**
```
10    ← Số lượng sản phẩm (từ seed)
```

✅ **Kiểm tra:** Số ≥ 10 (có thể > 10 nếu đã thêm sản phẩm)

---

### 4️⃣ Xem tất cả documents (Pretty format)
```javascript
db.products.find().pretty()
```

**Kết quả mong đợi:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "sku": "BUT-001",
  "name": "Bút bi xanh",
  "price": 5000,
  "stock": 100,
  "category": "Bút",
  "description": "Bút mực xanh ngòi 0.5mm",
  "imageUrl": "/img/but-bi-xanh.png",
  "isActive": true,
  "createdAt": ISODate("2024-05-22T10:30:00.000Z"),
  "updatedAt": ISODate("2024-05-22T10:30:00.000Z")
}

... (9 sản phẩm khác)
```

✅ **Kiểm tra:**
- [ ] Có dữ liệu hiển thị
- [ ] Mỗi sản phẩm có đủ fields
- [ ] Price, stock là số
- [ ] createdAt, updatedAt là date

---

### 5️⃣ Xem 3 sản phẩm đầu tiên
```javascript
db.products.find().limit(3).pretty()
```

**Kết quả:** Chỉ hiển thị 3 sản phẩm

---

### 6️⃣ Xem một sản phẩm cụ thể
```javascript
db.products.find({ sku: "BUT-001" }).pretty()
```

**Kết quả:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "sku": "BUT-001",
  "name": "Bút bi xanh",
  ...
}
```

---

## 🔎 KIỂM TRA TỪNG COLLECTION

### Collection: PRODUCTS (Sản phẩm)

#### Lệnh 1: Tất cả sản phẩm
```javascript
db.products.find().count()  // Đếm
db.products.find().pretty() // Xem chi tiết
```

#### Lệnh 2: Sản phẩm theo danh mục
```javascript
// Bút
db.products.find({ category: "Bút" }).pretty()

// Sổ
db.products.find({ category: "Sổ" }).pretty()

// Dấu
db.products.find({ category: "Dấu" }).pretty()
```

#### Lệnh 3: Sản phẩm hoạt động (isActive = true)
```javascript
db.products.find({ isActive: true }).count()
// Kết quả: 10 (hoặc số sản phẩm hoạt động)
```

#### Lệnh 4: Sản phẩm bị ẩn (isActive = false)
```javascript
db.products.find({ isActive: false }).count()
// Kết quả: 0 (nếu chưa ẩn sản phẩm nào)
```

---

### Collection: USERS (Người dùng)

#### Lệnh 1: Tất cả người dùng
```javascript
db.users.find().pretty()
```

**Kết quả mong đợi:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "username": "admin",
  "email": "admin@vanphongpham.vn",
  "password": "$2b$10$...", // Hashed password
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2024-05-22T..."),
  "updatedAt": ISODate("2024-05-22T...")
}
```

#### Lệnh 2: Tìm user theo email
```javascript
db.users.find({ email: "admin@vanphongpham.vn" }).pretty()
```

#### Lệnh 3: Đếm tất cả users
```javascript
db.users.countDocuments()
// Kết quả: 1+ (ít nhất 1 admin)
```

#### Lệnh 4: Users theo role
```javascript
// Admin
db.users.find({ role: "admin" }).count()

// User thường
db.users.find({ role: "user" }).count()
```

---

### Collection: ORDERS (Đơn hàng)

#### Lệnh 1: Tất cả đơn hàng
```javascript
db.orders.find().pretty()
```

#### Lệnh 2: Đếm đơn hàng
```javascript
db.orders.countDocuments()
// Kết quả: 0 (nếu chưa có đơn hàng)
```

#### Lệnh 3: Đơn hàng theo status
```javascript
db.orders.find({ status: "pending" }).count()
db.orders.find({ status: "completed" }).count()
```

---

## 🔍 QUERY NÂNG CAO

### Loại 1: Tìm theo khoảng giá

```javascript
// Sản phẩm < 30,000 VND
db.products.find({ price: { $lt: 30000 } }).pretty()

// Sản phẩm > 50,000 VND
db.products.find({ price: { $gt: 50000 } }).pretty()

// Sản phẩm từ 20,000 đến 50,000 VND
db.products.find({ 
    price: { 
        $gte: 20000,
        $lte: 50000 
    } 
}).pretty()
```

### Loại 2: Tìm theo tên (Regex)

```javascript
// Tên chứa "Bút"
db.products.find({ name: /Bút/ }).pretty()

// Tên chứa "bút" (không phân biệt chữ hoa/thường)
db.products.find({ name: /bút/i }).pretty()
```

### Loại 3: Sắp xếp

```javascript
// Sắp xếp theo giá (thấp → cao)
db.products.find().sort({ price: 1 }).pretty()

// Sắp xếp theo giá (cao → thấp)
db.products.find().sort({ price: -1 }).pretty()

// Sắp xếp theo ngày tạo (cũ → mới)
db.products.find().sort({ createdAt: 1 }).pretty()
```

### Loại 4: Chỉ hiển thị một số fields

```javascript
// Chỉ hiển thị name, price, category (ẩn _id)
db.products.find(
    {},
    { name: 1, price: 1, category: 1, _id: 0 }
).pretty()

// Kết quả:
// { "name": "Bút bi xanh", "price": 5000, "category": "Bút" }
// { "name": "Bút bi đỏ", "price": 5000, "category": "Bút" }
// ...
```

### Loại 5: Kết hợp nhiều điều kiện

```javascript
// Tìm sản phẩm: Category = "Bút" AND Price < 10,000 AND isActive = true
db.products.find({
    category: "Bút",
    price: { $lt: 10000 },
    isActive: true
}).pretty()
```

### Loại 6: Thống kê

```javascript
// Số lượng sản phẩm theo danh mục
db.products.aggregate([
    {
        $group: {
            _id: "$category",
            count: { $sum: 1 },
            avgPrice: { $avg: "$price" }
        }
    }
])

// Kết quả:
// { "_id": "Bút", "count": 3, "avgPrice": 6000 }
// { "_id": "Sổ", "count": 2, "avgPrice": 30000 }
// ...
```

---

## 📊 VISUAL GUIDE - STEP BY STEP

### Scenario 1: Kiểm tra tất cả dữ liệu sau khi seed

```
┌─ TERMINAL ──────────────────────────────────────┐
│ $ mongosh                                        │
│ ✅ Connected to mongodb                         │
│                                                 │
│ > use van_phong_pham_shop                       │
│ switched to db van_phong_pham_shop              │
│                                                 │
│ > show collections                              │
│ orders                                          │
│ products                                        │
│ users                                           │
│                                                 │
│ > db.products.countDocuments()                  │
│ 10                                              │
│                                                 │
│ > db.products.find().limit(1).pretty()          │
│ {                                               │
│   "_id": ObjectId(...),                         │
│   "sku": "BUT-001",                             │
│   "name": "Bút bi xanh",                        │
│   "price": 5000,                                │
│   ...                                           │
│ }                                               │
│                                                 │
│ ✅ VERIFY: Dữ liệu được tạo thành công!        │
└─────────────────────────────────────────────────┘
```

---

### Scenario 2: Kiểm tra dữ liệu sau khi thêm sản phẩm qua API

```
┌─ POSTMAN (API) ─────────────────────────────────┐
│ POST /api/products                              │
│ {                                               │
│   "sku": "SOH-TEST-001",                        │
│   "name": "Sổ tay da cao cấp",                  │
│   "price": 85000,                               │
│   ...                                           │
│ }                                               │
│ ✅ Response: 201 Created                        │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─ MONGODB ──────────────────────────────────────┐
│ $ mongosh                                       │
│ > use van_phong_pham_shop                      │
│ > db.products.find({ sku: "SOH-TEST-001" })   │
│                                                │
│ {                                              │
│   "_id": ObjectId(...),                        │
│   "sku": "SOH-TEST-001",                       │
│   "name": "Sổ tay da cao cấp",                 │
│   "price": 85000,                              │
│   ...                                          │
│ }                                              │
│                                                │
│ ✅ VERIFY: Dữ liệu được lưu trong DB!         │
└─────────────────────────────────────────────────┘
```

---

### Scenario 3: Kiểm tra dữ liệu sau đăng ký user

```
┌─ POSTMAN (API) ─────────────────────────────────┐
│ POST /api/users/auth/register                  │
│ {                                               │
│   "username": "testuser1",                      │
│   "email": "test1@example.com",                 │
│   "password": "Test@12345",                     │
│   ...                                           │
│ }                                               │
│ ✅ Response: 201 Created                        │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─ MONGODB ──────────────────────────────────────┐
│ $ mongosh                                       │
│ > use van_phong_pham_shop                      │
│ > db.users.countDocuments()                    │
│ 2  ← 1 admin + 1 user mới                      │
│                                                │
│ > db.users.find({ email: "test1@example.com" })
│                                                │
│ {                                              │
│   "_id": ObjectId(...),                        │
│   "username": "testuser1",                     │
│   "email": "test1@example.com",                │
│   "password": "$2b$10$...",  ← HASHED!        │
│   "role": "user",                              │
│   ...                                          │
│ }                                              │
│                                                │
│ ✅ VERIFY: User được tạo, password hashed!    │
└─────────────────────────────────────────────────┘
```

---

## 💾 XUẤT DỮ LIỆU RA JSON

### Cách 1: Xuất tất cả sản phẩm

```bash
mongoexport --db van_phong_pham_shop \
            --collection products \
            --out products.json
```

**Kết quả:** File `products.json` được tạo

---

### Cách 2: Xuất với filter

```bash
mongoexport --db van_phong_pham_shop \
            --collection products \
            --query '{ "category": "Bút" }' \
            --out but_only.json
```

**Kết quả:** Chỉ export sản phẩm loại "Bút"

---

### Cách 3: Xuất qua MongoDB Shell

```javascript
db.products.find().forEach(function(doc) {
    print(JSON.stringify(doc));
});
```

---

## 📈 DASHBOARD KIỂM TRA

### Lệnh kiểm tra toàn bộ

```javascript
// 🔍 Chạy tất cả lệnh này để kiểm tra

// 1. Databases
show databases

// 2. Collections
use van_phong_pham_shop
show collections

// 3. Đếm documents
db.products.countDocuments()
db.users.countDocuments()
db.orders.countDocuments()

// 4. Xem mẫu
db.products.findOne().pretty()
db.users.findOne().pretty()

// 5. Kiểm tra
db.products.find({ isActive: true }).count()
db.users.find({ role: "admin" }).count()
```

---

## 📋 CHECKLIST KIỂM TRA

Sử dụng checklist này để kiểm tra dữ liệu:

```
┌─ PRODUCTS COLLECTION ────────────────────┐
│ □ Có dữ liệu                             │
│ □ Số lượng ≥ 10                          │
│ □ Mỗi sản phẩm có _id                    │
│ □ Mỗi sản phẩm có sku, name, price       │
│ □ price là số (Number)                   │
│ □ stock là số (Number)                   │
│ □ category có giá trị                    │
│ □ isActive là Boolean (true/false)       │
│ □ createdAt, updatedAt là Date           │
│ □ imageUrl có giá trị (nếu upload)       │
└──────────────────────────────────────────┘

┌─ USERS COLLECTION ───────────────────────┐
│ □ Có dữ liệu (ít nhất 1 admin)           │
│ □ Mỗi user có _id                        │
│ □ username không trùng                   │
│ □ email không trùng                      │
│ □ password được hash ($2b$10$...)        │
│ □ role = "admin" hoặc "user"             │
│ □ isActive là Boolean                    │
│ □ createdAt, updatedAt là Date           │
└──────────────────────────────────────────┘

┌─ ORDERS COLLECTION ──────────────────────┐
│ □ Collections tồn tại (có thể trống)     │
│ □ Nếu có data:                           │
│   □ Có userId                            │
│   □ Có items array                       │
│   □ Có totalPrice                        │
│   □ Có status                            │
└──────────────────────────────────────────┘
```

---

## 🐛 TROUBLESHOOTING

### ❌ "Cannot connect to MongoDB"

**Lệnh check:**
```bash
# Check MongoDB process
ps aux | grep mongod

# hoặc
lsof -i :27017
```

**Giải pháp:**
```bash
# Start MongoDB
mongod

# hoặc trên Mac
brew services start mongodb-community
```

---

### ❌ "Collection not found"

**Lệnh check:**
```javascript
show collections
```

**Giải pháp:**
```bash
# Tạo collection bằng seed
npm run seed
```

---

### ❌ "No documents in collection"

**Lệnh check:**
```javascript
db.products.countDocuments()  // Kết quả 0
```

**Giải pháp:**
```bash
npm run seed
```

---

### ❌ "SyntaxError" khi dùng lệnh MongoDB

**Ví dụ lỗi:**
```javascript
> db.products.find() price: 5000  ← SAIIII

> db.products.find({ price: 5000 })  ← ĐÚNG
```

**Giải pháp:**
- Kiểm tra dấu ngoặc `{}` `[]`
- Kiểm tra dấu phẩy `,`
- Kiểm tra tên field: `price`, `name`, `sku`, v.v.

---

## 💡 TIPS

### Tip 1: Lệnh lịch sử
```javascript
// Xem lệnh vừa chạy
// Dùng mũi tên lên/xuống trên bàn phím

// hoặc gõ lại một phần rồi dùng Tab autocomplete
> db.pro[TAB]
> db.products.find
```

### Tip 2: Format đẹp
```javascript
// Tất cả lệnh đều có .pretty() để format đẹp
db.products.find().pretty()

db.users.findOne().pretty()

db.orders.find().sort({createdAt: -1}).pretty()
```

### Tip 3: Exit MongoDB Shell
```javascript
> exit()
// hoặc
> quit()
// hoặc
Ctrl+D
```

### Tip 4: Lệnh hữu ích

```javascript
// Xóa tất cả sản phẩm
db.products.deleteMany({})

// Xóa theo condition
db.products.deleteMany({ category: "Bút" })

// Cập nhật một field
db.products.updateOne(
    { sku: "BUT-001" },
    { $set: { price: 6000 } }
)

// Backup collection
db.products.find().forEach(function(doc) {
    print(JSON.stringify(doc));
})
```

---

## 📚 REFERENCE

| Lệnh | Mục đích | Ví dụ |
|------|---------|-------|
| `show databases` | Xem all databases | show databases |
| `use DB_NAME` | Chọn database | use van_phong_pham_shop |
| `show collections` | Xem all collections | show collections |
| `db.COLL.find()` | Xem tất cả docs | db.products.find() |
| `db.COLL.findOne()` | Xem 1 doc | db.products.findOne() |
| `db.COLL.count()` | Đếm docs | db.products.count() |
| `db.COLL.insertOne()` | Thêm 1 doc | db.products.insertOne({...}) |
| `db.COLL.updateOne()` | Cập nhật 1 doc | db.products.updateOne({...}, {...}) |
| `db.COLL.deleteOne()` | Xóa 1 doc | db.products.deleteOne({...}) |

---

## ✨ SUMMARY

**Các bước kiểm tra dữ liệu MongoDB:**

1. ✅ Mở Terminal: `mongosh`
2. ✅ Chọn DB: `use van_phong_pham_shop`
3. ✅ Xem collections: `show collections`
4. ✅ Đếm sản phẩm: `db.products.count()`
5. ✅ Xem chi tiết: `db.products.find().pretty()`
6. ✅ Kiểm tra users: `db.users.find().pretty()`
7. ✅ Tìm cụ thể: `db.products.find({sku: "BUT-001"}).pretty()`

**Thành công khi:**
- ✅ Có 3 collections (products, users, orders)
- ✅ products có ≥ 10 documents
- ✅ users có ≥ 1 document
- ✅ Mỗi document có đủ fields

---

**Tài liệu được cập nhật:** 26/05/2026  
**Phiên bản:** 1.0
