# 🛒 HƯỚNG DẪN ORDER MANAGEMENT - Quản Lý Đơn Hàng

## 📋 Mục lục
1. [Tạo Đơn Hàng](#-tạo-đơn-hàng)
2. [Xem Đơn Hàng](#-xem-đơn-hàng)
3. [Quản Lý Đơn Hàng (Admin)](#-quản-lý-đơn-hàng-admin)
4. [Validation Rules](#-validation-rules)

---

## ✅ TẠO ĐƠN HÀNG

### **Tạo Đơn Hàng Mới**

**Mục đích:** Khách hàng tạo đơn hàng mua hàng

**Endpoint:**
```http
POST /api/orders
Authorization: Required (Session)
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "address": "123 Đường ABC",
    "ward": "Phường 1",
    "district": "Quận 1",
    "city": "Hồ Chí Minh"
  }
}
```

**Validation Rules:**
- ✅ `items`: Bắt buộc, mảng có >= 1 phần tử
- ✅ `items[].productId`: Bắt buộc, phải tồn tại và active
- ✅ `items[].quantity`: Bắt buộc, >= 1, <= stock
- ✅ `shippingAddress.name`: Bắt buộc, >= 3 ký tự
- ✅ `shippingAddress.phone`: Bắt buộc, >= 10 ký tự (số, +, -)
- ✅ `shippingAddress.address`: Bắt buộc, >= 5 ký tự

**Quá trình Xử Lý:**
1. ✅ Kiểm tra dữ liệu bắt buộc
2. ✅ Kiểm tra sản phẩm tồn tại & active
3. ✅ Kiểm tra stock đủ
4. ✅ Tính toán tổng tiền
5. ✅ **Tự động trừ stock sản phẩm**
6. ✅ Tạo đơn hàng với status = "pending"

**Response Success (201):**
```json
{
  "success": true,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439051",
        "productId": "507f1f77bcf86cd799439011",
        "productName": "Bút bi xanh",
        "quantity": 2,
        "price": 5000
      },
      {
        "_id": "507f1f77bcf86cd799439052",
        "productId": "507f1f77bcf86cd799439012",
        "productName": "Sổ ghi chép",
        "quantity": 1,
        "price": 15000
      }
    ],
    "totalPrice": 25000,
    "shippingAddress": {
      "name": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC",
      "ward": "Phường 1",
      "district": "Quận 1",
      "city": "Hồ Chí Minh"
    },
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-05-24T10:30:00Z"
  }
}
```

**Response Errors:**

❌ Sản phẩm hết hàng (400):
```json
{
  "success": false,
  "message": "Sản phẩm \"Bút bi xanh\" chỉ còn 5 cái"
}
```

❌ Sản phẩm không tồn tại (404):
```json
{
  "success": false,
  "message": "Sản phẩm 507f1f77bcf86cd799439011 không tồn tại"
}
```

❌ Dữ liệu không hợp lệ (400):
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "shippingAddress.phone",
      "message": "Số điện thoại không hợp lệ"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Cookie: connect.sid=<session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "507f1f77bcf86cd799439011",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "name": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC, Hà Nội",
      "ward": "Phường 1",
      "district": "Quận 1",
      "city": "Hà Nội"
    }
  }'
```

---

## 📖 XEM ĐƠN HÀNG

### **1. Lấy Đơn Hàng của Người Dùng Hiện Tại**

**Endpoint:**
```http
GET /api/orders/my-orders?page=1&limit=10&status=pending
Authorization: Required (Session)
```

**Query Parameters:**
- `page`: Trang (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)
- `status`: Lọc theo status (pending, confirmed, shipped, delivered, cancelled)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách đơn hàng thành công",
  "data": {
    "orders": [
      {
        "_id": "507f1f77bcf86cd799439050",
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "username": "nguyenvana",
          "email": "nguyenvana@example.com"
        },
        "items": [ ... ],
        "totalPrice": 25000,
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": "2024-05-24T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15
    }
  }
}
```

**cURL Example:**
```bash
curl "http://localhost:3000/api/orders/my-orders?page=1&limit=10&status=pending" \
  -H "Cookie: connect.sid=<session_id>"
```

---

### **2. Lấy Chi Tiết Đơn Hàng**

**Endpoint:**
```http
GET /api/orders/:id
Authorization: Required (Session)
```

⚠️ **Lưu ý:** User chỉ xem được đơn hàng của mình (Admin xem được tất cả)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy chi tiết đơn hàng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "userId": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "nguyenvana@example.com"
    },
    "items": [
      {
        "_id": "507f1f77bcf86cd799439051",
        "productId": "507f1f77bcf86cd799439011",
        "productName": "Bút bi xanh",
        "quantity": 2,
        "price": 5000
      }
    ],
    "totalPrice": 10000,
    "shippingAddress": {
      "name": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC",
      "ward": "Phường 1",
      "district": "Quận 1",
      "city": "Hồ Chí Minh"
    },
    "status": "pending",
    "paymentStatus": "pending",
    "notes": "Ghi chú từ admin",
    "createdAt": "2024-05-24T10:30:00Z",
    "updatedAt": "2024-05-24T10:35:00Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/orders/507f1f77bcf86cd799439050 \
  -H "Cookie: connect.sid=<session_id>"
```

---

### **3. Hủy Đơn Hàng**

**Endpoint:**
```http
DELETE /api/orders/:id
Authorization: Required (Session)
```

⚠️ **Lưu ý:** Chỉ hủy được đơn ở trạng thái "pending" hoặc "confirmed"

**Quá trình:**
1. ✅ Kiểm tra quyền (user của đơn hàng)
2. ✅ Kiểm tra status có thể hủy không
3. ✅ **Tự động hoàn lại stock sản phẩm**
4. ✅ Cập nhật status = "cancelled"

**Response Success (200):**
```json
{
  "success": true,
  "message": "Hủy đơn hàng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "status": "cancelled"
  }
}
```

**Response Errors:**

❌ Không thể hủy (400):
```json
{
  "success": false,
  "message": "Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý hoặc đã xác nhận"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/orders/507f1f77bcf86cd799439050 \
  -H "Cookie: connect.sid=<session_id>"
```

---

## 🔧 QUẢN LÝ ĐƠN HÀNG (ADMIN)

### **1. Lấy Tất Cả Đơn Hàng**

**Endpoint:**
```http
GET /api/orders?page=1&limit=10&status=pending&search=nguyenvana
Authorization: Admin
```

**Query Parameters:**
- `page`: Trang (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)
- `status`: Lọc theo status
- `search`: Tìm kiếm theo tên người nhận hoặc số điện thoại

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách đơn hàng thành công",
  "data": {
    "orders": [ ... ],
    "pagination": { ... }
  }
}
```

---

### **2. Cập Nhật Trạng Thái Đơn Hàng**

**Endpoint:**
```http
PUT /api/orders/:id/status
Authorization: Admin
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed",
  "paymentStatus": "paid"
}
```

**Trạng Thái Hợp Lệ:**

| Status | Ý Nghĩa |
|--------|---------|
| pending | Chờ xác nhận |
| confirmed | Đã xác nhận |
| shipped | Đã gửi đi |
| delivered | Đã giao |
| cancelled | Đã hủy |

**Payment Status:**

| Status | Ý Nghĩa |
|--------|---------|
| pending | Chưa thanh toán |
| paid | Đã thanh toán |
| failed | Thanh toán thất bại |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật trạng thái đơn hàng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439050",
    "status": "confirmed",
    "paymentStatus": "paid"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/orders/507f1f77bcf86cd799439050/status \
  -H "Cookie: connect.sid=<admin_session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "paymentStatus": "paid"
  }'
```

---

### **3. Cập Nhật Ghi Chú Đơn Hàng**

**Endpoint:**
```http
PUT /api/orders/:id/notes
Authorization: Admin
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Giao vào sáng mai, liên hệ trước"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/orders/507f1f77bcf86cd799439050/notes \
  -H "Cookie: connect.sid=<admin_session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Giao vào sáng mai, liên hệ trước"
  }'
```

---

### **4. Lấy Thống Kê Đơn Hàng**

**Endpoint:**
```http
GET /api/orders/stats
Authorization: Admin
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thống kê đơn hàng thành công",
  "data": {
    "totalOrders": 150,
    "totalRevenue": 3750000,
    "ordersByStatus": {
      "pending": 25,
      "confirmed": 50,
      "shipped": 40,
      "delivered": 30,
      "cancelled": 5
    }
  }
}
```

---

## ✅ VALIDATION RULES

### **Validation cho TẠO ĐƠN HÀNG**

| Field | Quy tắc | Bắt buộc |
|-------|---------|----------|
| items | Mảng >= 1 phần tử | ✅ |
| items[].productId | Tồn tại & active | ✅ |
| items[].quantity | >= 1, <= stock | ✅ |
| shippingAddress.name | >= 3 ký tự | ✅ |
| shippingAddress.phone | >= 10 ký tự (số, +, -) | ✅ |
| shippingAddress.address | >= 5 ký tự | ✅ |
| shippingAddress.ward | Chuỗi ký tự | ❌ |
| shippingAddress.district | Chuỗi ký tự | ❌ |
| shippingAddress.city | Chuỗi ký tự | ❌ |

### **Validation cho CẬP NHẬT STATUS**

| Field | Giá trị hợp lệ | Bắt buộc |
|-------|----------------|----------|
| status | pending, confirmed, shipped, delivered, cancelled | ❌ Tuỳ chọn |
| paymentStatus | pending, paid, failed | ❌ Tuỳ chọn |

---

## 💾 Stock Management

### **Tự động Trừ Stock khi Tạo Đơn**
- ✅ Khi tạo đơn hàng, stock sản phẩm tự động giảm
- ✅ Nếu không đủ stock, đơn không được tạo

### **Tự động Hoàn Lại Stock khi Hủy**
- ✅ Khi hủy đơn (status → cancelled), stock tự động tăng lại
- ✅ Chỉ áp dụng cho đơn ở trạng thái "pending" hoặc "confirmed"

---

## 📝 Workflow Đơn Hàng

```
Tạo đơn hàng (pending)
    ↓
Admin xác nhận (confirmed) → Nếu hủy → Hoàn lại stock
    ↓
Admin gửi đi (shipped)
    ↓
Giao thành công (delivered)
    ↓
Hoàn thành
```

---

**Cập nhật lần cuối:** 24/05/2024
**Version:** 1.0 - Order Management Complete
