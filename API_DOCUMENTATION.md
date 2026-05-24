# 📚 TÀI LIỆU API BACKEND - Van Phong Pham Shop

## 🔧 Cấu trúc Backend

```
backend/
├── config/
│   └── database.js           ← Cấu hình kết nối MongoDB
├── middleware/
│   ├── errorHandler.js       ← Xử lý lỗi toàn cục
│   ├── auth.js              ← Xác thực người dùng
│   └── validation.js        ← Validate dữ liệu
├── models/
│   ├── Product.js           ← Schema sản phẩm
│   ├── User.js              ← Schema người dùng
│   └── Order.js             ← Schema đơn hàng
├── controllers/
│   ├── productController.js ← Logic xử lý sản phẩm
│   ├── cartController.js    ← Logic xử lý giỏ hàng
│   └── adminController.js   ← Logic admin
├── routes/
│   ├── productRoutes.js     ← Routes sản phẩm
│   └── adminRoutes.js       ← Routes admin
├── utils/
│   └── responseHandler.js   ← Helper format response
└── app.js                   ← Entry point ứng dụng
```

---

## 📡 API ENDPOINTS

### **1. SẢN PHẨM - PRODUCTS**

#### **GET /api/products**
Lấy danh sách sản phẩm (có pagination, filter, search)

**Query Parameters:**
```
- page: số trang (mặc định: 1)
- limit: số item trên trang (mặc định: 10)
- category: lọc theo danh mục (Bút, Sổ, Dấu, Khác)
- search: tìm kiếm theo tên hoặc mô tả
```

**Response Success (200):**
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
        "description": "Bút mực xanh",
        "imageUrl": "/img/pen_01.png",
        "isActive": true,
        "createdAt": "2024-05-22T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45
    }
  }
}
```

**Ví dụ cURL:**
```bash
curl "http://localhost:3000/api/products?page=1&limit=10&category=Bút"
```

---

#### **GET /api/products/:id**
Lấy chi tiết sản phẩm theo ID

**Response Success (200):**
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
    "category": "Bút",
    "description": "Bút mực xanh, ngòi 0.5mm",
    "imageUrl": "/img/pen_01.png",
    "isActive": true,
    "createdAt": "2024-05-22T10:30:00Z"
  }
}
```

**Ví dụ cURL:**
```bash
curl "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

---

#### **POST /api/products** ⚠️ ADMIN
Tạo sản phẩm mới

**Headers:**
```
Content-Type: application/json
(Cần đăng nhập với tư cách admin)
```

**Body:**
```json
{
  "sku": "BUT-002",
  "name": "Bút bi đỏ",
  "price": 5000,
  "stock": 50,
  "category": "Bút",
  "description": "Bút mực đỏ, ngòi 0.5mm",
  "imageUrl": "/img/pen_02.png"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "sku": "BUT-002",
    "name": "Bút bi đỏ",
    ...
  }
}
```

**Ví dụ cURL:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "BUT-002",
    "name": "Bút bi đỏ",
    "price": 5000,
    "stock": 50,
    "category": "Bút",
    "description": "Bút mực đỏ",
    "imageUrl": "/img/pen_02.png"
  }'
```

---

#### **PUT /api/products/:id** ⚠️ ADMIN
Cập nhật sản phẩm

**Body:**
```json
{
  "price": 6000,
  "stock": 80
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật sản phẩm thành công",
  "data": { ... }
}
```

---

#### **DELETE /api/products/:id** ⚠️ ADMIN
Xóa sản phẩm (Soft delete - chỉ đánh dấu isActive = false)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa sản phẩm thành công",
  "data": {
    ...
    "isActive": false
  }
}
```

---

## 🔐 XÁC THỰC & PHÂN QUYỀN

### Middleware Auth

**auth**: Kiểm tra người dùng đã đăng nhập
- Return 401 nếu chưa đăng nhập

**adminAuth**: Kiểm tra quyền admin
- Return 401 nếu chưa đăng nhập
- Return 403 nếu không phải admin

---

## ⚠️ XỬ LỲ LỖI

### Response Lỗi Standard

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "price",
      "message": "Giá phải lớn hơn 0"
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "success": false,
  "message": "Vui lòng đăng nhập để truy cập"
}
```

**Forbidden (403):**
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập"
}
```

**Not Found (404):**
```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Lỗi khi xử lý yêu cầu",
  "status": 500
}
```

---

## 📝 DATA MODELS

### Product Schema
```javascript
{
  sku: String (unique, required),           // Mã SKU
  name: String (required, min: 3),          // Tên sản phẩm
  price: Number (min: 0, required),         // Giá
  stock: Number (min: 0, required),         // Số lượng tồn
  imageUrl: String,                         // Ảnh sản phẩm
  category: String (Enum: Bút/Sổ/Dấu/Khác), // Danh mục
  description: String (max: 500),           // Mô tả
  isActive: Boolean,                        // Trạng thái
  createdAt: Date,                          // Ngày tạo
  updatedAt: Date                           // Ngày cập nhật
}
```

### User Schema
```javascript
{
  username: String (unique, required, min: 3),
  email: String (unique, required, email format),
  password: String (required, min: 6),
  role: String (Enum: user/admin),
  phone: String,
  address: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalPrice: Number,
  shippingAddress: {
    name, phone, address, ward, district, city
  },
  status: Enum (pending/confirmed/shipped/delivered/cancelled),
  paymentMethod: Enum (cash/card/bank_transfer),
  paymentStatus: Enum (pending/paid/failed),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 ĐIỀU CHỈNH & MỞ RỘNG

### Để thêm endpoint mới:
1. Tạo controller function trong `controllers/`
2. Thêm route trong `routes/`
3. Nếu cần validate: thêm middleware validation
4. Nếu là admin: thêm middleware `adminAuth`

### Để thêm model mới:
1. Tạo schema trong `models/`
2. Thêm indexes nếu cần
3. Tạo controller xử lý
4. Thêm routes

---

## 🔗 Environment Variables

```env
MONGODB_URI=mongodb://127.0.0.1:27017/EduStore
PORT=3000
NODE_ENV=development
SESSION_SECRET=vanphongpham_secret_key_2024
```

---

**Ngày cập nhật:** 22/05/2024
