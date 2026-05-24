# 📚 HƯỚNG DẪN CRUD PRODUCTS - Van Phong Pham Shop

## 🎯 Tổng Quan CRUD

### Bảng các thao tác:

| Thao tác | Method | Endpoint | Yêu cầu | Upload ảnh |
|---------|--------|----------|--------|-----------|
| **CREATE** | POST | `/api/products` | Admin | ✅ Có (bắt buộc) |
| **READ** | GET | `/api/products` | Công khai | ❌ Không |
| **READ** | GET | `/api/products/:id` | Công khai | ❌ Không |
| **UPDATE** | PUT | `/api/products/:id` | Admin | ✅ Có (tuỳ chọn) |
| **DELETE** | DELETE | `/api/products/:id` | Admin | ❌ Không |
| **RESTORE** | PATCH | `/api/products/:id/restore` | Admin | ❌ Không |
| **HARD DELETE** | DELETE | `/api/products/:id/permanent` | Admin | ❌ Không |

---

## ✅ 1. CREATE - Tạo Sản Phẩm Mới

### Mục đích:
Admin thêm sản phẩm mới vào hệ thống **kèm theo ảnh sản phẩm**.

### Quy trình:
1. Admin gửi dữ liệu sản phẩm + file ảnh
2. Server kiểm tra SKU trùng
3. Multer xử lý upload ảnh → lưu vào `/public/uploads/products/`
4. Tạo record trong MongoDB
5. Trả về sản phẩm đã tạo

### Request:
```http
POST /api/products
Content-Type: multipart/form-data
Authorization: Admin (via session)

---Form Data---
sku: BUT-001
name: Bút bi xanh
price: 5000
stock: 100
category: Bút
description: Bút mực xanh, ngòi 0.5mm
image: <file>.jpg
```

### Response Success (201):
```json
{
  "success": true,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "BUT-001",
    "name": "Bút bi xanh",
    "price": 5000,
    "stock": 100,
    "category": "Bút",
    "description": "Bút mực xanh, ngòi 0.5mm",
    "imageUrl": "/uploads/products/product-1716360600000-123456789.jpg",
    "isActive": true,
    "createdAt": "2024-05-22T10:30:00Z",
    "updatedAt": "2024-05-22T10:30:00Z"
  }
}
```

### Response Errors:

**Thiếu dữ liệu (400):**
```json
{
  "success": false,
  "message": "SKU, tên, giá và danh mục không được để trống"
}
```

**SKU trùng (400):**
```json
{
  "success": false,
  "message": "SKU \"BUT-001\" đã tồn tại"
}
```

**File không hợp lệ (400):**
```json
{
  "success": false,
  "message": "Chỉ cho phép upload ảnh (JPG, PNG, GIF)"
}
```

**Quá kích thước (400):**
```json
{
  "success": false,
  "message": "File quá lớn (tối đa 5MB)"
}
```

### 🔧 Ví dụ cURL:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Cookie: connect.sid=<session_id>" \
  -F "sku=BUT-001" \
  -F "name=Bút bi xanh" \
  -F "price=5000" \
  -F "stock=100" \
  -F "category=Bút" \
  -F "description=Bút mực xanh, ngòi 0.5mm" \
  -F "image=@/path/to/image.jpg"
```

### 🔧 Ví dụ JavaScript (Fetch):
```javascript
const formData = new FormData();
formData.append('sku', 'BUT-001');
formData.append('name', 'Bút bi xanh');
formData.append('price', 5000);
formData.append('stock', 100);
formData.append('category', 'Bút');
formData.append('description', 'Bút mực xanh, ngòi 0.5mm');
formData.append('image', fileInput.files[0]);

fetch('/api/products', {
    method: 'POST',
    credentials: 'include',
    body: formData
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## ✅ 2. READ - Lấy Danh Sách Sản Phẩm

### 2.1 Lấy danh sách sản phẩm (có pagination + filter + search)

**Mục đích:** Khách hàng xem danh sách sản phẩm trên trang chủ.

**Request:**
```http
GET /api/products?page=1&limit=10&category=Bút&search=xanh
```

**Query Parameters:**
- `page`: Trang hiện tại (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)
- `category`: Lọc theo danh mục (Bút, Sổ, Dấu, Khác)
- `search`: Tìm kiếm theo tên hoặc mô tả

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
        "imageUrl": "/uploads/products/product-1716360600000-123456789.jpg",
        "category": "Bút",
        "description": "Bút mực xanh",
        "isActive": true,
        "createdAt": "2024-05-22T10:30:00Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "sku": "BUT-002",
        "name": "Bút bi đỏ",
        "price": 5000,
        "stock": 50,
        "imageUrl": "/uploads/products/product-1716360620000-987654321.jpg",
        "category": "Bút",
        "description": "Bút mực đỏ",
        "isActive": true,
        "createdAt": "2024-05-22T10:35:00Z"
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

### 🔧 Ví dụ cURL:
```bash
# Lấy trang 1, 10 item/trang
curl "http://localhost:3000/api/products?page=1&limit=10"

# Lấy danh mục "Bút"
curl "http://localhost:3000/api/products?category=Bút"

# Tìm kiếm "xanh"
curl "http://localhost:3000/api/products?search=xanh"

# Kết hợp
curl "http://localhost:3000/api/products?page=1&limit=10&category=Bút&search=xanh"
```

---

### 2.2 Lấy chi tiết sản phẩm theo ID

**Mục đích:** Khách hàng xem chi tiết 1 sản phẩm.

**Request:**
```http
GET /api/products/507f1f77bcf86cd799439011
```

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
    "imageUrl": "/uploads/products/product-1716360600000-123456789.jpg",
    "category": "Bút",
    "description": "Bút mực xanh, ngòi 0.5mm êm ái",
    "isActive": true,
    "createdAt": "2024-05-22T10:30:00Z",
    "updatedAt": "2024-05-22T10:30:00Z"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Sản phẩm không tồn tại"
}
```

### 🔧 Ví dụ cURL:
```bash
curl "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

---

## ✅ 3. UPDATE - Cập Nhật Sản Phẩm

### Mục đích:
Admin chỉnh sửa **giá, số lượng tồn kho, hoặc thay đổi ảnh**.

### Quy trình:
1. Admin gửi dữ liệu cập nhật + ảnh mới (tuỳ chọn)
2. Server tìm sản phẩm cũ
3. Nếu có ảnh mới: xóa ảnh cũ, upload ảnh mới
4. Cập nhật dữ liệu trong MongoDB
5. Trả về sản phẩm đã cập nhật

### Request:
```http
PUT /api/products/507f1f77bcf86cd799439011
Content-Type: multipart/form-data
Authorization: Admin

---Form Data---
name: Bút bi xanh (cập nhật)
price: 6000
stock: 80
image: <file>.jpg (tuỳ chọn)
```

### Response Success (200):
```json
{
  "success": true,
  "message": "Cập nhật sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "BUT-001",
    "name": "Bút bi xanh (cập nhật)",
    "price": 6000,
    "stock": 80,
    "imageUrl": "/uploads/products/product-1716360700000-111111111.jpg",
    "category": "Bút",
    "description": "Bút mực xanh, ngòi 0.5mm êm ái",
    "isActive": true,
    "updatedAt": "2024-05-22T10:40:00Z"
  }
}
```

### 🔧 Ví dụ cURL:
```bash
# Cập nhật giá + số lượng
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=<session_id>" \
  -F "price=6000" \
  -F "stock=80"

# Cập nhật + thay đổi ảnh
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=<session_id>" \
  -F "price=6000" \
  -F "stock=80" \
  -F "image=@/path/to/new-image.jpg"
```

---

## ✅ 4. DELETE - Xóa Sản Phẩm

### Có 2 loại xóa:

### 4.1 Soft Delete (Xóa mềm - ẩn sản phẩm)

**Mục đích:** Ẩn sản phẩm khỏi view công khai nhưng **không xóa vĩnh viễn** (có thể khôi phục).

**Request:**
```http
DELETE /api/products/507f1f77bcf86cd799439011
Authorization: Admin
```

**Quy trình:**
1. Server tìm sản phẩm
2. Đánh dấu `isActive = false`
3. **Không xóa ảnh từ server**
4. Trả về sản phẩm (isActive: false)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sku": "BUT-001",
    "name": "Bút bi xanh",
    "isActive": false
  }
}
```

### 🔧 Ví dụ cURL:
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=<session_id>"
```

---

### 4.2 Khôi Phục Sản Phẩm (Undo Soft Delete)

**Mục đích:** Hiển thị lại sản phẩm đã bị ẩn.

**Request:**
```http
PATCH /api/products/507f1f77bcf86cd799439011/restore
Authorization: Admin
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Khôi phục sản phẩm thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": true
  }
}
```

### 🔧 Ví dụ cURL:
```bash
curl -X PATCH http://localhost:3000/api/products/507f1f77bcf86cd799439011/restore \
  -H "Cookie: connect.sid=<session_id>"
```

---

### 4.3 Hard Delete (Xóa vĩnh viễn)

⚠️ **CẢNH BÁO:** Xóa vĩnh viễn - **KHÔNG THỂ KHÔI PHỤC**!

**Mục đích:** Xóa hoàn toàn sản phẩm + ảnh từ server.

**Request:**
```http
DELETE /api/products/507f1f77bcf86cd799439011/permanent
Authorization: Admin
```

**Quy trình:**
1. Server tìm sản phẩm
2. **Xóa ảnh khỏi /public/uploads/products/**
3. **Xóa record khỏi MongoDB**
4. Trả về null

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa sản phẩm vĩnh viễn thành công",
  "data": null
}
```

### 🔧 Ví dụ cURL:
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011/permanent \
  -H "Cookie: connect.sid=<session_id>"
```

---

## 📋 Tóm Tắt CRUD Operations

### ✅ CREATE
- **Endpoint:** `POST /api/products`
- **Yêu cầu:** Admin + Form Data + Image
- **Kết quả:** Tạo sản phẩm + upload ảnh

### ✅ READ
- **Endpoint:** `GET /api/products` (danh sách)
- **Endpoint:** `GET /api/products/:id` (chi tiết)
- **Yêu cầu:** Không cần auth
- **Kết quả:** Trả về sản phẩm

### ✅ UPDATE
- **Endpoint:** `PUT /api/products/:id`
- **Yêu cầu:** Admin + Form Data
- **Kết quả:** Cập nhật dữ liệu + ảnh (nếu có)

### ✅ DELETE
- **Soft Delete:** `DELETE /api/products/:id` (ẩn)
- **Restore:** `PATCH /api/products/:id/restore` (hiển thị)
- **Hard Delete:** `DELETE /api/products/:id/permanent` (xóa vĩnh viễn)
- **Yêu cầu:** Admin
- **Kết quả:** Thay đổi isActive hoặc xóa hoàn toàn

---

## 📁 Cấu Trúc Upload Ảnh

```
public/
├── uploads/
│   └── products/
│       ├── product-1716360600000-123456789.jpg
│       ├── product-1716360620000-987654321.jpg
│       └── product-1716360700000-111111111.jpg
```

**Tên file:** `product-{timestamp}-{randomNumber}.{ext}`

**Đường dẫn truy cập:** `/uploads/products/product-1716360600000-123456789.jpg`

**URL đầy đủ:** `http://localhost:3000/uploads/products/product-1716360600000-123456789.jpg`

---

## ⚙️ Cấu Hình Multer

```javascript
// config/multer.js
- Storage: /public/uploads/products/
- File Types: JPG, PNG, GIF
- Max Size: 5MB
- Naming: product-{timestamp}-{random}.{ext}
```

---

## 🔐 Xác Thực & Phân Quyền

- **Công khai:** GET /api/products, GET /api/products/:id
- **Admin:** POST, PUT, DELETE, PATCH, DELETE /permanent
- **Xác thực:** Sử dụng session (req.session.user)
- **Middleware:** `adminAuth` từ `middleware/auth.js`

---

## 📝 Ghi Chú Quan Trọng

1. **SKU phải unique:** Không thể tạo 2 sản phẩm cùng SKU
2. **Upload ảnh:** Chỉ hỗ trợ JPG, PNG, GIF (max 5MB)
3. **Xóa mềm vs xóa vĩnh viễn:** 
   - Soft delete: isActive = false, ảnh giữ lại
   - Hard delete: Xóa hoàn toàn, không khôi phục được
4. **Cập nhật ảnh:** Ảnh cũ tự động xóa khi upload ảnh mới
5. **Danh sách chỉ hiển thị sản phẩm active:** isActive = true

---

**Cập nhật lần cuối:** 22/05/2024
**Version:** 1.0 - CRUD Complete
