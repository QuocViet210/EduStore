# 🔐 HƯỚNG DẪN AUTHENTICATION & USER MANAGEMENT

## 📋 Mục lục
1. [Authentication (Đăng ký / Đăng nhập)](#-authentication--đăng-ký--đăng-nhập)
2. [User Management (Quản lý người dùng)](#-user-management--quản-lý-người-dùng)
3. [Password Management (Quản lý mật khẩu)](#-password-management--quản-lý-mật-khẩu)
4. [Validation Rules (Quy tắc kiểm tra)](#-validation-rules--quy-tắc-kiểm-tra)

---

## 🔐 AUTHENTICATION - Đăng ký / Đăng nhập

### **1. Đăng Ký Tài Khoản Mới (Register)**

**Mục đích:** Người dùng mới tạo tài khoản

**Endpoint:**
```http
POST /api/users/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "nguyenvana@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Validation Rules:**
- ✅ `username`: Bắt buộc, 3-50 ký tự, chỉ chứa a-z, 0-9, _
- ✅ `email`: Bắt buộc, định dạng email hợp lệ
- ✅ `password`: Bắt buộc, >= 6 ký tự
- ✅ `confirmPassword`: Bắt buộc, phải khớp với password

**Response Success (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "nguyenvana@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-05-24T10:30:00Z"
  }
}
```

**Response Errors:**

❌ Email/Username trùng (400):
```json
{
  "success": false,
  "message": "Email này đã được đăng ký"
}
```

❌ Dữ liệu không hợp lệ (400):
```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "field": "password",
      "message": "Mật khẩu không khớp"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nguyenvana",
    "email": "nguyenvana@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

---

### **2. Đăng Nhập (Login)**

**Mục đích:** Người dùng đăng nhập vào hệ thống

**Endpoint:**
```http
POST /api/users/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- ✅ `email`: Bắt buộc, định dạng email
- ✅ `password`: Bắt buộc, không được trống

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "nguyenvana@example.com",
    "role": "user",
    "isActive": true
  }
}
```

**Response Errors:**

❌ Email/Mật khẩu sai (400):
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không chính xác"
}
```

❌ Tài khoản bị vô hiệu hóa (403):
```json
{
  "success": false,
  "message": "Tài khoản này đã bị vô hiệu hóa"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/users/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "nguyenvana@example.com",
    "password": "password123"
  }'
```

**⚠️ Lưu ý:** Session tự động được tạo và lưu trong cookie

---

### **3. Đăng Xuất (Logout)**

**Mục đích:** Kết thúc phiên đăng nhập

**Endpoint:**
```http
POST /api/users/auth/logout
Authorization: Required (Session)
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công",
  "data": null
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/users/auth/logout \
  -H "Cookie: connect.sid=<session_id>"
```

---

## 👤 USER MANAGEMENT - Quản lý Người Dùng

### **1. Lấy Thông Tin Cá Nhân**

**Endpoint:**
```http
GET /api/users/profile/me
Authorization: Required (Session)
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy thông tin cá nhân thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "email": "nguyenvana@example.com",
    "phone": "0912345678",
    "address": "123 Đường ABC, Hà Nội",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-05-24T10:30:00Z"
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/users/profile/me \
  -H "Cookie: connect.sid=<session_id>"
```

---

### **2. Cập Nhật Thông Tin Cá Nhân**

**Endpoint:**
```http
PUT /api/users/profile/me
Authorization: Required (Session)
Content-Type: application/json
```

**Request Body (tất cả tuỳ chọn):**
```json
{
  "username": "nguyenvana_new",
  "email": "nguyenvana.new@example.com",
  "phone": "0987654321",
  "address": "456 Đường XYZ, Hà Nội"
}
```

**Validation Rules:**
- ✅ `username`: 3-50 ký tự, chỉ chứa a-z, 0-9, _
- ✅ `email`: Định dạng email hợp lệ
- ✅ `phone`: >= 10 ký tự (số, dấu +, dấu -)
- ✅ `address`: >= 5 ký tự

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "nguyenvana_new",
    "email": "nguyenvana.new@example.com",
    "phone": "0987654321",
    "address": "456 Đường XYZ, Hà Nội"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/users/profile/me \
  -H "Cookie: connect.sid=<session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0987654321",
    "address": "456 Đường XYZ, Hà Nội"
  }'
```

---

### **3. Lấy Danh Sách Người Dùng (Admin)**

**Endpoint:**
```http
GET /api/users?page=1&limit=10&role=user&search=nguyenvana
Authorization: Admin
```

**Query Parameters:**
- `page`: Trang (mặc định: 1)
- `limit`: Số item/trang (mặc định: 10)
- `role`: Lọc theo role (user, admin)
- `search`: Tìm kiếm theo username hoặc email

**Response Success (200):**
```json
{
  "success": true,
  "message": "Lấy danh sách người dùng thành công",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "nguyenvana",
        "email": "nguyenvana@example.com",
        "role": "user",
        "isActive": true
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

---

### **4. Lấy Chi Tiết Người Dùng (Admin)**

**Endpoint:**
```http
GET /api/users/:id
Authorization: Admin
```

**cURL Example:**
```bash
curl http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=<admin_session_id>"
```

---

### **5. Cập Nhật Người Dùng (Admin)**

**Endpoint:**
```http
PUT /api/users/:id
Authorization: Admin
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Cookie: connect.sid=<admin_session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nguyenvana_admin",
    "phone": "0999999999"
  }'
```

---

### **6. Xóa Người Dùng (Admin - Soft Delete)**

**Endpoint:**
```http
DELETE /api/users/:id
Authorization: Admin
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Xóa người dùng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "nguyenvana",
    "isActive": false
  }
}
```

---

### **7. Khôi Phục Người Dùng (Admin)**

**Endpoint:**
```http
PATCH /api/users/:id/restore
Authorization: Admin
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Khôi phục người dùng thành công",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": true
  }
}
```

---

## 🔑 PASSWORD MANAGEMENT - Quản lý Mật Khẩu

### **Đổi Mật Khẩu**

**Endpoint:**
```http
PUT /api/users/profile/change-password
Authorization: Required (Session)
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "old_password123",
  "newPassword": "new_password456",
  "confirmPassword": "new_password456"
}
```

**Validation Rules:**
- ✅ `oldPassword`: Bắt buộc, phải khớp với mật khẩu hiện tại
- ✅ `newPassword`: Bắt buộc, >= 6 ký tự
- ✅ `confirmPassword`: Bắt buộc, phải khớp với newPassword

**Response Success (200):**
```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công",
  "data": null
}
```

**Response Errors:**

❌ Mật khẩu cũ sai (400):
```json
{
  "success": false,
  "message": "Mật khẩu cũ không chính xác"
}
```

❌ Mật khẩu mới không khớp (400):
```json
{
  "success": false,
  "message": "Mật khẩu mới không khớp"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/users/profile/change-password \
  -H "Cookie: connect.sid=<session_id>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "old_password123",
    "newPassword": "new_password456",
    "confirmPassword": "new_password456"
  }'
```

---

## ✅ VALIDATION RULES - Quy tắc Kiểm Tra

### **Validation cho ĐĂNG KÝ**

| Field | Quy tắc | Ví dụ hợp lệ |
|-------|---------|-------------|
| username | 3-50 ký tự, a-z, 0-9, _ | `nguyenvana` |
| email | Email hợp lệ | `user@example.com` |
| password | >= 6 ký tự | `password123` |
| confirmPassword | Khớp với password | `password123` |

### **Validation cho CẬP NHẬT THÔNG TIN**

| Field | Quy tắc | Bắt buộc |
|-------|---------|----------|
| username | 3-50 ký tự, a-z, 0-9, _ | ❌ Tuỳ chọn |
| email | Email hợp lệ | ❌ Tuỳ chọn |
| phone | >= 10 ký tự | ❌ Tuỳ chọn |
| address | >= 5 ký tự | ❌ Tuỳ chọn |

### **Validation cho ĐỔI MẬT KHẨU**

| Field | Quy tắc | Bắt buộc |
|-------|---------|----------|
| oldPassword | Không rỗng | ✅ Bắt buộc |
| newPassword | >= 6 ký tự | ✅ Bắt buộc |
| confirmPassword | Khớp newPassword | ✅ Bắt buộc |

---

## 🛡️ Security Features

### **Password Hashing**
- ✅ Sử dụng SHA256 hash
- ✅ Không lưu password plain-text

### **Session Management**
- ✅ Session timeout: 1 giờ
- ✅ Secure cookies (production)
- ✅ HttpOnly flag

### **Authorization**
- ✅ Role-based access control (user, admin)
- ✅ Middleware `auth` cho user
- ✅ Middleware `adminAuth` cho admin

---

## 📝 Error Responses

### **Status Codes**

| Code | Meaning | Ví dụ |
|------|---------|------|
| 200 | OK | Đăng nhập thành công |
| 201 | Created | Đăng ký thành công |
| 400 | Bad Request | Dữ liệu không hợp lệ |
| 401 | Unauthorized | Chưa đăng nhập |
| 403 | Forbidden | Không có quyền |
| 404 | Not Found | Người dùng không tồn tại |
| 500 | Server Error | Lỗi máy chủ |

---

**Cập nhật lần cuối:** 24/05/2024
**Version:** 1.0 - Authentication Complete
