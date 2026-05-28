# 📦 HƯỚNG DẪN THÊM SẢN PHẨM & LƯU DỮ LIỆU VÀO MONGODB

---

## 📋 MỤC LỤC
1. [Cách 1: Seed dữ liệu ban đầu](#-cách-1-seed-dữ-liệu-ban-đầu)
2. [Cách 2: Thêm sản phẩm qua API](#-cách-2-thêm-sản-phẩm-qua-api)
3. [Cách 3: Thêm trực tiếp qua MongoDB Shell](#-cách-3-thêm-trực-tiếp-qua-mongodb-shell)
4. [Kiểm tra dữ liệu được lưu](#-kiểm-tra-dữ-liệu-được-lưu)
5. [Cấu trúc dữ liệu sản phẩm](#-cấu-trúc-dữ-liệu-sản-phẩm)

---

## 🌱 CÁCH 1: SEED DỮ LIỆU BAN ĐẦU

### Giải thích
**Seed** = Đổ dữ liệu ban đầu vào database. File `seed.js` chứa 10 sản phẩm mẫu.

### Bước 1: Chạy lệnh seed
```bash
# Trong thư mục gốc của dự án
npm run seed
```

**Kết quả mong đợi:**
```
✅ Seeding 10 products into MongoDB...
✅ Seed data inserted successfully
```

### Bước 2: Kiểm tra dữ liệu được tạo
```bash
# Mở MongoDB Shell
mongosh

# Chọn database
use van_phong_pham_shop

# Xem số lượng sản phẩm
db.products.countDocuments()
# Kết quả: 10

# Xem danh sách sản phẩm
db.products.find().pretty()
```

### Các sản phẩm mẫu được seed:

```
1. Bút bi xanh (BUT-001) - 5,000 VND
2. Bút bi đỏ (BUT-002) - 5,000 VND
3. Bút chì gỗ (BUT-003) - 8,000 VND
4. Sổ tay A5 (SOH-001) - 25,000 VND
5. Sổ tay A4 (SOH-002) - 35,000 VND
6. Dấu gỗ (DAU-001) - 15,000 VND
7. Dấu cao su (DAU-002) - 12,000 VND
8. Bìa nhuộm (BIA-001) - 50,000 VND
9. Bìa da (BIA-002) - 75,000 VND
10. Bìa kiếp (BIA-003) - 45,000 VND
```

### ⚠️ Lưu ý quan trọng
- **Chỉ chạy một lần!** Nếu chạy lại sẽ tạo duplicate
- Để xóa dữ liệu cũ trước khi seed lại:
```bash
mongosh
use van_phong_pham_shop
db.products.deleteMany({})  # Xóa tất cả sản phẩm
exit
npm run seed  # Seed lại
```

---

## 🌐 CÁCH 2: THÊM SẢN PHẨM QUA API

### Giải thích
Dùng API endpoint **POST /api/products** để tạo sản phẩm mới qua Postman hoặc Thunder Client.

### Yêu cầu
- ✅ Server đang chạy: `npm start`
- ✅ Đã đăng nhập với tài khoản Admin
- ✅ Có Postman hoặc Thunder Client

---

### Bước 1: Đăng nhập Admin

**Request:**
```http
POST http://localhost:3000/api/users/auth/login
Content-Type: application/json

{
  "email": "admin@vanphongpham.vn",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "_id": "...",
    "username": "admin",
    "email": "admin@vanphongpham.vn",
    "role": "admin"
  }
}
```

✅ **Kết quả:** Session được tạo (Cookie tự động được gửi trong request tiếp theo)

---

### Bước 2: Tạo sản phẩm mới

**Request:**
```http
POST http://localhost:3000/api/products
Content-Type: multipart/form-data

Body (Form-data):
- sku: "SOH-TEST-001"
- name: "Sổ tay da cao cấp"
- price: 85000
- stock: 50
- category: "Sổ"
- description: "Sổ tay bìa da cao cấp, 100 trang, ghi chép tiện lợi"
- image: [chọn file ảnh từ máy]
```

**Trong Postman:**
1. Chọn **POST** method
2. Điền URL: `http://localhost:3000/api/products`
3. Tab **Body** → Chọn **form-data**
4. Thêm các fields:
   | Key | Value | Type |
   |-----|-------|------|
   | sku | SOH-TEST-001 | Text |
   | name | Sổ tay da cao cấp | Text |
   | price | 85000 | Text |
   | stock | 50 | Text |
   | category | Sổ | Text |
   | description | Sổ tay bìa da cao cấp | Text |
   | image | (chọn file) | File |

5. Click **Send**

**Response (Success - 201 Created):**
```json
{
  "success": true,
  "message": "Thêm sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799999999",
    "sku": "SOH-TEST-001",
    "name": "Sổ tay da cao cấp",
    "price": 85000,
    "stock": 50,
    "category": "Sổ",
    "description": "Sổ tay bìa da cao cấp, 100 trang, ghi chép tiện lợi",
    "imageUrl": "/uploads/products/image_123456.jpg",
    "isActive": true,
    "createdAt": "2024-05-26T10:30:00.000Z",
    "updatedAt": "2024-05-26T10:30:00.000Z"
  }
}
```

✅ **Kết quả:** Sản phẩm được tạo thành công!

---

### Bước 3: Kiểm tra sản phẩm được lưu vào MongoDB

```bash
# Mở MongoDB Shell
mongosh

# Chọn database
use van_phong_pham_shop

# Xem sản phẩm vừa tạo
db.products.find({ sku: "SOH-TEST-001" }).pretty()
```

**Kết quả:**
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799999999"),
  "sku": "SOH-TEST-001",
  "name": "Sổ tay da cao cấp",
  "price": 85000,
  "stock": 50,
  "category": "Sổ",
  "description": "Sổ tay bìa da cao cấp, 100 trang, ghi chép tiện lợi",
  "imageUrl": "/uploads/products/image_123456.jpg",
  "isActive": true,
  "createdAt": ISODate("2024-05-26T10:30:00.000Z"),
  "updatedAt": ISODate("2024-05-26T10:30:00.000Z")
}
```

✅ **Thành công:** Dữ liệu được lưu vào MongoDB!

---

### 🔄 Thêm nhiều sản phẩm (Batch)

Nếu muốn thêm 10+ sản phẩm, có thể:

**Option 1: Thêm từng cái qua API (cách trên)**
- Mất thời gian nhưng đơn giản

**Option 2: Tạo file seed mới**
```javascript
// addMoreProducts.js
const Product = require('./models/Product');
const connectDB = require('./config/database');

async function seedMoreProducts() {
    await connectDB();
    
    const newProducts = [
        {
            sku: "BUT-NEW-001",
            name: "Bút gel màu xanh",
            price: 7000,
            stock: 100,
            category: "Bút",
            description: "Bút gel viết mượt, mực xanh"
        },
        {
            sku: "BUT-NEW-002",
            name: "Bút gel màu đỏ",
            price: 7000,
            stock: 100,
            category: "Bút",
            description: "Bút gel viết mượt, mực đỏ"
        },
        // ... thêm sản phẩm khác
    ];
    
    await Product.insertMany(newProducts);
    console.log("✅ Added more products!");
    process.exit();
}

seedMoreProducts();
```

Chạy:
```bash
node addMoreProducts.js
```

---

## 💾 CÁCH 3: THÊM TRỰC TIẾP QUA MONGODB SHELL

### Giải thích
Dùng MongoDB Shell command để insert document trực tiếp.

### Bước 1: Mở MongoDB Shell
```bash
mongosh
```

### Bước 2: Chọn database
```bash
use van_phong_pham_shop
```

### Bước 3: Insert sản phẩm

#### Insert một sản phẩm
```javascript
db.products.insertOne({
    sku: "DAU-NEW-001",
    name: "Dấu tròn đỏ",
    price: 18000,
    stock: 75,
    category: "Dấu",
    description: "Dấu tròn màu đỏ, chất lượng cao",
    imageUrl: "/img/dau-tron-do.png",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
})
```

**Kết quả:**
```javascript
{
  acknowledged: true,
  insertedId: ObjectId("507f1f77bcf86cd799888888")
}
```

#### Insert nhiều sản phẩm cùng lúc
```javascript
db.products.insertMany([
    {
        sku: "KHAC-001",
        name: "Bộ bút màu 12 cây",
        price: 65000,
        stock: 30,
        category: "Khác",
        description: "Bộ 12 bút màu lì, chất lượng tốt",
        imageUrl: "/img/bo-but-12.png",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        sku: "KHAC-002",
        name: "Bộ bút marker 8 cây",
        price: 95000,
        stock: 20,
        category: "Khác",
        description: "Bộ marker 8 màu, vẽ trên giấy tốt",
        imageUrl: "/img/bo-marker-8.png",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
])
```

**Kết quả:**
```javascript
{
  acknowledged: true,
  insertedIds: [
    ObjectId("507f1f77bcf86cd799777777"),
    ObjectId("507f1f77bcf86cd799666666")
  ]
}
```

✅ **Thành công:** 2 sản phẩm được thêm vào!

---

## ✅ KIỂM TRA DỮ LIỆU ĐƯỢC LƯU

### Lệnh kiểm tra cơ bản

**1. Xem tổng số sản phẩm**
```javascript
db.products.countDocuments()
// Kết quả: 12 (10 seed + 2 vừa thêm)
```

**2. Xem tất cả sản phẩm**
```javascript
db.products.find().pretty()
```

**3. Xem 3 sản phẩm đầu tiên**
```javascript
db.products.find().limit(3).pretty()
```

**4. Tìm sản phẩm theo SKU**
```javascript
db.products.find({ sku: "SOH-TEST-001" }).pretty()
```

**5. Tìm sản phẩm theo category**
```javascript
db.products.find({ category: "Sổ" }).pretty()
```

**6. Tìm sản phẩm theo giá (< 50,000)**
```javascript
db.products.find({ price: { $lt: 50000 } }).pretty()
```

**7. Xem thông tin chi tiết một sản phẩm**
```javascript
db.products.findOne({ sku: "BUT-001" }).pretty()
```

**8. Đếm sản phẩm theo category**
```javascript
db.products.countDocuments({ category: "Bút" })
// Kết quả: 3 (Bút bi xanh, Bút bi đỏ, Bút chì gỗ)
```

---

## 📊 CẤU TRÚC DỮ LIỆU SẢN PHẨM

### Schema sản phẩm (Product Model)

```javascript
{
  _id: ObjectId,              // ID tự động tạo bởi MongoDB
  sku: String,                // Mã sản phẩm (VD: BUT-001, SOH-002)
  name: String,               // Tên sản phẩm
  price: Number,              // Giá bán (VND)
  stock: Number,              // Số lượng tồn kho
  category: String,           // Danh mục (Bút, Sổ, Dấu, Khác)
  description: String,        // Mô tả chi tiết
  imageUrl: String,           // Đường dẫn ảnh sản phẩm
  isActive: Boolean,          // Trạng thái (true: hiển thị, false: ẩn)
  createdAt: Date,            // Thời gian tạo
  updatedAt: Date             // Thời gian cập nhật cuối
}
```

### Ví dụ dữ liệu sản phẩm

```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "sku": "BUT-001",
  "name": "Bút bi xanh",
  "price": 5000,
  "stock": 100,
  "category": "Bút",
  "description": "Bút mực xanh ngòi 0.5mm, viết mượt",
  "imageUrl": "/img/but-bi-xanh.png",
  "isActive": true,
  "createdAt": ISODate("2024-05-22T10:30:00.000Z"),
  "updatedAt": ISODate("2024-05-22T10:30:00.000Z")
}
```

---

## 🎯 CHECKLIST: KIỂM TRA DỮ LIỆU ĐƯỢC LƯU

Sau khi thêm sản phẩm, kiểm tra các điểm sau:

```
✓ Mở MongoDB Shell: mongosh
✓ Chọn database: use van_phong_pham_shop
✓ Xem collections: show collections
  → Phải có: products, users, orders
✓ Đếm sản phẩm: db.products.countDocuments()
  → Kết quả ≥ 10 (từ seed) + số sản phẩm vừa thêm
✓ Xem chi tiết: db.products.find().pretty()
  → Mỗi sản phẩm phải có đủ fields
✓ Tìm sản phẩm vừa thêm theo SKU
✓ Kiểm tra _id, createdAt, updatedAt
✓ Kiểm tra imageUrl (nếu upload qua API)
```

---

## 🔄 WORKFLOW THÊM SẢN PHẨM HOÀN CHỈNH

```
┌─────────────────────────────────────┐
│  OPTION 1: SEED BAN ĐẦU             │
│  npm run seed                        │
│  → 10 sản phẩm mẫu                  │
└────────────────┬────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    ┌─────────────┐  ┌──────────────┐
    │ API         │  │ MongoDB Shell │
    │ (Postman)   │  │ (direct)     │
    │ POST        │  │ insertOne()  │
    │ /api/...    │  │ insertMany() │
    └──────┬──────┘  └───────┬──────┘
           │                 │
           └────────┬────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  MongoDB Database    │
         │  van_phong_pham_shop │
         │  → products          │
         └──────────────────────┘
```

---

## 💡 TIPS & TRICKS

### Tip 1: Kiểm tra database khi server chạy
```bash
# Terminal 1: Chạy server
npm start

# Terminal 2: Kiểm tra database
mongosh
use van_phong_pham_shop
db.products.find().pretty()
```

### Tip 2: Xuất dữ liệu ra JSON
```bash
mongosh --eval "
  db.van_phong_pham_shop.products.find().forEach(function(doc){ 
    print(JSON.stringify(doc)); 
  })" > products.json
```

### Tip 3: Cập nhật sản phẩm vừa tạo
```javascript
db.products.updateOne(
  { sku: "SOH-TEST-001" },
  {
    $set: {
      price: 90000,  // Cập nhật giá
      stock: 45,     // Cập nhật tồn kho
      updatedAt: new Date()
    }
  }
)
```

### Tip 4: Xóa sản phẩm
```javascript
// Soft delete (chỉ ẩn)
db.products.updateOne(
  { sku: "SOH-TEST-001" },
  { $set: { isActive: false } }
)

// Hard delete (xóa vĩnh viễn)
db.products.deleteOne({ sku: "SOH-TEST-001" })
```

---

## 🐛 TROUBLESHOOTING

### ❌ Lỗi: "Cannot connect to MongoDB"
**Giải pháp:**
```bash
# Kiểm tra MongoDB chạy
ps aux | grep mongod

# Hoặc start MongoDB
mongod

# Hoặc kiểm tra connection string trong .env
cat .env | grep MONGODB_URI
```

### ❌ Lỗi: "Authorization failed"
**Giải pháp:**
- Kiểm tra user đã login không (session cookie)
- Kiểm tra user có role "admin" không
```javascript
db.users.find({ email: "admin@..." }).pretty()
```

### ❌ Lỗi: "Duplicate key error"
**Giải pháp:**
- SKU đã tồn tại, dùng SKU khác
- Hoặc xóa sản phẩm cũ: `db.products.deleteOne({ sku: "..." })`

### ❌ Lỗi: "File upload failed"
**Giải pháp:**
- Kiểm tra folder `public/uploads/products/` tồn tại
- Hoặc tạo folder: `mkdir -p public/uploads/products`
- Kiểm tra quyền folder: `chmod 777 public/uploads/products`

---

## 📈 LƯỠI TIẾN NHANH: BATCH INSERT

Muốn thêm 100+ sản phẩm nhanh? Dùng MongoDB Compass (GUI):

1. **Cài MongoDB Compass**
   - Download: https://www.mongodb.com/products/compass
   - Cài đặt & mở

2. **Kết nối database**
   - Connection string: `mongodb://localhost:27017`
   - Database: `van_phong_pham_shop`
   - Collection: `products`

3. **Insert documents**
   - Click "Insert Document"
   - Dán JSON data
   - Click "Insert"

---

## 📚 REFERENCES

- **MongoDB Insert:** https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/
- **Mongoose Schema:** `/models/Product.js`
- **API Endpoint:** `POST /api/products`

---

## ✨ SUMMARY

| Cách | Cách làm | Thời gian | Ưu điểm | Nhược điểm |
|-----|---------|----------|--------|-----------|
| **Seed** | `npm run seed` | 10 giây | Nhanh, dữ liệu mẫu | Chỉ 10 sản phẩm |
| **API** | Postman POST | 1-2 phút | Dễ, upload ảnh | Từng cái một |
| **MongoDB Shell** | `insertOne/insertMany` | 30 giây | Linh hoạt | Phải học lệnh |
| **MongoDB Compass** | GUI drag-drop | 1 phút | Thị giác | Cần cài thêm tool |

---

**Tài liệu được cập nhật:** 26/05/2026  
**Phiên bản:** 1.0
