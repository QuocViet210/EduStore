# ✅ TESTING CHECKLIST - VAN PHONG PHAM SHOP

**Ngày test:** ________________  
**Người test:** ________________  
**Môi trường:** ☐ Local  ☐ Production

---

## 📋 PHẦN 1: CÀI ĐẶT BAN ĐẦU (10 phút)

### 1.1 Kiểm tra môi trường
- [ ] Node.js cài đặt: `node -v` → v14+
- [ ] npm cài đặt: `npm -v` → v6+
- [ ] MongoDB cài đặt: `mongod -v` hoặc dùng Atlas
- [ ] Git cài đặt (nếu cần): `git -v`

### 1.2 Cài đặt dependencies
```bash
cd /home/asus/Van_Phong_Pham_Shop
npm install
```
- [ ] ✅ `npm install` thành công (không có error)
- [ ] ✅ Thư mục `node_modules` được tạo
- [ ] ✅ File `package-lock.json` được tạo

### 1.3 Cấu hình môi trường
- [ ] ✅ File `.env` tồn tại
- [ ] ✅ `MONGODB_URI` được cấu hình đúng
- [ ] ✅ `PORT=3000` được cấu hình
- [ ] ✅ `SESSION_SECRET` được cấu hình

**Lệnh kiểm tra:** `cat .env`

---

## 📦 PHẦN 2: MONGODB SETUP (10 phút)

### 2.1 Kiểm tra MongoDB kết nối
- [ ] ✅ MongoDB service đang chạy
  ```bash
  # Linux/Mac: ps aux | grep mongod
  # hoặc kiểm tra: mongosh ping
  ```

### 2.2 Seed dữ liệu ban đầu
```bash
npm run seed
```
- [ ] ✅ Lệnh `npm run seed` thực thi thành công
- [ ] ✅ Có thông báo "Seeding X products..."
- [ ] ✅ Có thông báo "Seed data inserted successfully"

### 2.3 Kiểm tra data trong MongoDB
```bash
mongosh
use van_phong_pham_shop
show collections
db.products.countDocuments()
```
- [ ] ✅ Collection `products` tồn tại
- [ ] ✅ Collection `users` tồn tại
- [ ] ✅ Collection `orders` tồn tại
- [ ] ✅ Có ≥ 10 sản phẩm trong collection `products`
- [ ] ✅ Sample product có structure đúng:
  ```
  ✓ _id (ObjectId)
  ✓ sku (String)
  ✓ name (String)
  ✓ price (Number)
  ✓ stock (Number)
  ✓ category (String)
  ✓ description (String)
  ✓ imageUrl (String)
  ✓ isActive (Boolean)
  ✓ createdAt (Date)
  ```

---

## 🚀 PHẦN 3: KHỞI ĐỘNG SERVER (5 phút)

### 3.1 Chạy server
```bash
npm start
```
- [ ] ✅ Không có error trong quá trình khởi động
- [ ] ✅ Thông báo: "✅ MongoDB connected successfully"
- [ ] ✅ Thông báo: "⚡ Server running at http://localhost:3000"

### 3.2 Kiểm tra server từ terminal mới
```bash
curl http://localhost:3000
```
- [ ] ✅ Response là HTML (không phải error)
- [ ] ✅ Trang chủ load thành công
- [ ] ✅ HTTP Status 200 OK

---

## 🌐 PHẦN 4: API TEST (Sử dụng Postman/Thunder Client)

### 4.1 Setup Postman/Thunder Client
- [ ] ✅ Postman hoặc Thunder Client được cài
- [ ] ✅ Base URL cấu hình: `http://localhost:3000`
- [ ] ✅ Import file `Postman_Collection.json` (nếu dùng Postman)

---

## 📖 PHẦN 5: KIỂM TRA API CÔNG KHAI (Read)

### 5.1 Lấy danh sách sản phẩm
**Request:**
```http
GET /api/products
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response có `success: true`
- [ ] ✅ Response có array `products` với ≥ 1 item
- [ ] ✅ Mỗi product có: `_id`, `name`, `price`, `stock`, `category`
- [ ] ✅ Response time < 2 giây

**Response sample:**
```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "products": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 10
    }
  }
}
```

### 5.2 Pagination test
**Request:**
```http
GET /api/products?page=1&limit=5
```
- [ ] ✅ Status: 200 OK
- [ ] ✅ Trả về 5 sản phẩm (limit=5)
- [ ] ✅ `totalPages` được tính đúng
- [ ] ✅ `currentPage` = 1

### 5.3 Search test
**Request:**
```http
GET /api/products?search=bút
```
- [ ] ✅ Status: 200 OK
- [ ] ✅ Kết quả chỉ chứa sản phẩm có "bút" trong tên hoặc mô tả
- [ ] ✅ Số lượng kết quả ≤ số lượng toàn bộ sản phẩm

### 5.4 Filter by category test
**Request:**
```http
GET /api/products?category=Bút
```
- [ ] ✅ Status: 200 OK
- [ ] ✅ Kết quả chỉ chứa sản phẩm từ category "Bút"
- [ ] ✅ Tất cả items có `category: "Bút"`

### 5.5 Chi tiết sản phẩm test
**Request:**
```http
GET /api/products/{PRODUCT_ID}
```
*(Sử dụng ID từ kết quả test 5.1)*
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response chứa chi tiết đầy đủ của sản phẩm
- [ ] ✅ ID returned khớp với ID request

**Test error case:**
```http
GET /api/products/invalid_id
```
- [ ] ✅ Status: 404 hoặc 400
- [ ] ✅ Response có `success: false`

---

## 🔐 PHẦN 6: AUTHENTICATION TEST

### 6.1 Đăng ký tài khoản (Register)
**Request:**
```http
POST /api/users/auth/register
Content-Type: application/json

{
  "username": "testuser123",
  "email": "test123@example.com",
  "password": "Test@12345",
  "confirmPassword": "Test@12345"
}
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 201 Created
- [ ] ✅ Response có `success: true`
- [ ] ✅ Response chứa user data: `_id`, `username`, `email`, `role`
- [ ] ✅ Password không được return về

**Kiểm tra MongoDB:**
```javascript
db.users.find({ email: "test123@example.com" }).pretty()
```
- [ ] ✅ User được tạo trong database
- [ ] ✅ Password được hash (không phải plain text)
- [ ] ✅ `role` = "user" (mặc định)
- [ ] ✅ `isActive` = true

**Test error cases:**
- [ ] ✅ Register với email trùng → Status 400, message "Email already exists"
- [ ] ✅ Register với password không match → Status 400
- [ ] ✅ Register với username < 3 ký tự → Status 400

### 6.2 Đăng nhập (Login)
**Request:**
```http
POST /api/users/auth/login
Content-Type: application/json

{
  "email": "test123@example.com",
  "password": "Test@12345"
}
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response có `success: true`
- [ ] ✅ Response chứa user info: `_id`, `username`, `email`, `role`
- [ ] ✅ Cookie session được tạo (xem trong browser DevTools)

**Test error cases:**
- [ ] ✅ Login với password sai → Status 401, message "Email or password incorrect"
- [ ] ✅ Login với email không tồn tại → Status 401

### 6.3 Lấy thông tin user hiện tại
**Request:**
```http
GET /api/users/profile/me
```
*(Gọi sau khi login)*
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response chứa thông tin user đã login
- [ ] ✅ Data trả về khớp với user vừa login

**Test không login:**
- [ ] ✅ Gọi endpoint trước login → Status 401 Unauthorized

### 6.4 Đăng xuất (Logout)
**Request:**
```http
POST /api/users/auth/logout
```
- [ ] ✅ Status: 200 OK
- [ ] ✅ Session được xóa
- [ ] ✅ Gọi `/api/users/profile/me` sau logout → Status 401

---

## 🛠️ PHẦN 7: CRUD OPERATIONS (Admin)

**Chuẩn bị:** 
- [ ] ✅ Đã login với tài khoản Admin (hoặc tạo tài khoản Admin)

### 7.1 CREATE - Tạo sản phẩm mới
**Request:**
```http
POST /api/products
Content-Type: multipart/form-data

- sku: TEST-SOH-001
- name: Sổ test cao cấp
- price: 75000
- stock: 30
- category: Sổ
- description: Sổ tay test bìa da cao cấp
- image: [chọn file image]
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 201 Created
- [ ] ✅ Response có `success: true`
- [ ] ✅ Response chứa product data với `_id` mới
- [ ] ✅ Ảnh được upload thành công (có `imageUrl`)

**Kiểm tra MongoDB:**
```javascript
db.products.find({ sku: "TEST-SOH-001" }).pretty()
```
- [ ] ✅ Product được tạo trong database
- [ ] ✅ Tất cả fields có giá trị đúng
- [ ] ✅ `isActive: true` (mặc định)
- [ ] ✅ `createdAt` có thời gian hiện tại

**Lưu _id:** `__________________________`

### 7.2 UPDATE - Cập nhật sản phẩm
**Request:**
```http
PUT /api/products/{PRODUCT_ID_FROM_7.1}
Content-Type: application/json

{
  "name": "Sổ test cao cấp (updated)",
  "price": 80000,
  "stock": 25
}
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response có `success: true`
- [ ] ✅ Các field được cập nhật: `name`, `price`, `stock`

**Kiểm tra MongoDB:**
```javascript
db.products.findById(ObjectId("{ID}"))
```
- [ ] ✅ Dữ liệu trong database được cập nhật
- [ ] ✅ `updatedAt` có thời gian mới nhất
- [ ] ✅ Các field khác giữ nguyên

### 7.3 READ - Lấy sản phẩm vừa tạo
**Request:**
```http
GET /api/products/{PRODUCT_ID_FROM_7.1}
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 200 OK
- [ ] ✅ Dữ liệu returned khớp với sau UPDATE

### 7.4 DELETE - Xóa sản phẩm
**Request:**
```http
DELETE /api/products/{PRODUCT_ID_FROM_7.1}
```
**Kết quả mong đợi:**
- [ ] ✅ Status: 200 OK
- [ ] ✅ Response có `success: true`
- [ ] ✅ Message: "Xóa sản phẩm thành công"

**Kiểm tra MongoDB - Option 1 (Soft delete):**
```javascript
db.products.findById(ObjectId("{ID}"))
```
- [ ] ✅ Product vẫn tồn tại nhưng `isActive: false`

**Kiểm tra MongoDB - Option 2 (Hard delete):**
- [ ] ✅ Product được xóa hoàn toàn khỏi database

**Test gọi lại product:**
```http
GET /api/products/{PRODUCT_ID_FROM_7.1}
```
- [ ] ✅ Status: 404 (nếu hard delete) hoặc không hiển thị (nếu soft delete)

### 7.5 Test Permission - Unauthorized
**Logout trước, sau đó test:**
```http
POST /api/products
```
- [ ] ✅ Status: 401 Unauthorized
- [ ] ✅ Message: "Authentication required"

---

## 📊 PHẦN 8: MONGODB DATA PERSISTENCE TEST

**Mục đích:** Kiểm tra dữ liệu được lưu vĩnh viễn

### 8.1 Dừng server
```bash
# Ctrl+C trong terminal chạy server
```
- [ ] ✅ Server dừng

### 8.2 Kiểm tra dữ liệu vẫn tồn tại
```bash
mongosh
use van_phong_pham_shop
db.products.countDocuments()
```
- [ ] ✅ Số lượng sản phẩm vẫn giữ nguyên (bao gồm cái mới tạo ở 7.1, trừ đi cái xóa ở 7.4)
- [ ] ✅ User từ test 6.1 vẫn tồn tại

### 8.3 Khởi động lại server
```bash
npm start
```
- [ ] ✅ Server start thành công
- [ ] ✅ MongoDB connect thành công
- [ ] ✅ GET `/api/products` trả về dữ liệu bao gồm các thay đổi từ trước đó

---

## 🔌 PHẦN 9: EDGE CASES & ERROR HANDLING

### 9.1 Invalid input test
```http
POST /api/users/auth/register

{
  "username": "a",  // < 3 ký tự
  "email": "invalid-email",
  "password": "short"
}
```
- [ ] ✅ Status: 400 Bad Request
- [ ] ✅ Response có chi tiết validation errors

### 9.2 Non-existent resource test
```http
GET /api/products/507f1f77bcf86cd799999999
```
- [ ] ✅ Status: 404 Not Found hoặc 200 + message "Product not found"

### 9.3 Duplicate email test
```http
POST /api/users/auth/register

{
  "username": "newuser",
  "email": "test123@example.com",  // Email từ test 6.1
  "password": "Test@12345",
  "confirmPassword": "Test@12345"
}
```
- [ ] ✅ Status: 400
- [ ] ✅ Message: "Email already exists"

### 9.4 Invalid category filter
```http
GET /api/products?category=CategoryNotExist
```
- [ ] ✅ Status: 200 OK (hoặc 400 tùy validation)
- [ ] ✅ Trả về danh sách rỗng (nếu category không tồn tại)

### 9.5 SQL Injection test (Search parameter)
```http
GET /api/products?search=<script>alert('xss')</script>
```
- [ ] ✅ Không bị execute script (safe)
- [ ] ✅ Được treat như plain text search

---

## 📈 PHẦN 10: PERFORMANCE & STRESS TEST (Tùy chọn)

### 10.1 Response time test
- [ ] ✅ GET `/api/products` < 1 giây
- [ ] ✅ GET `/api/products/:id` < 500ms
- [ ] ✅ POST `/api/users/auth/login` < 1 giây

### 10.2 Large dataset test
```http
GET /api/products?limit=1000
```
- [ ] ✅ Server không crash
- [ ] ✅ Response hợp lệ (có thể implement pagination limit)

### 10.3 Concurrent requests (Tùy chọn)
- [ ] ✅ Gửi 10+ requests cùng lúc không bị error
- [ ] ✅ Dữ liệu consistency giữ nguyên

---

## ✨ PHẦN 11: UI TEST (Nếu Frontend hoàn chỉnh)

### 11.1 Trang chủ
```
GET http://localhost:3000
```
- [ ] ✅ Trang load thành công
- [ ] ✅ Danh sách sản phẩm hiển thị
- [ ] ✅ Header/Footer hiển thị đúng

### 11.2 Trang Shop
```
GET http://localhost:3000/shop
```
- [ ] ✅ Trang load thành công
- [ ] ✅ Có list sản phẩm
- [ ] ✅ Filter, search hoạt động

### 11.3 Trang Login
```
GET http://localhost:3000/login
```
- [ ] ✅ Form login hiển thị
- [ ] ✅ Có button submit

### 11.4 Trang Register
```
GET http://localhost:3000/register
```
- [ ] ✅ Form register hiển thị
- [ ] ✅ Validation hoạt động (client-side)

### 11.5 Trang Admin
```
GET http://localhost:3000/admin
```
- [ ] ✅ Admin dashboard hiển thị (nếu đã login Admin)
- [ ] ✅ Redirect đến login (nếu chưa login)

---

## 📋 PHẦN 12: FINAL SUMMARY

### 12.1 Tổng hợp kết quả

| Tính năng | Test Date | Status | Notes |
|-----------|-----------|--------|-------|
| API Hoạt động | _________ | ☐ ✅ ☐ ❌ | |
| CRUD Hoạt động | _________ | ☐ ✅ ☐ ❌ | |
| MongoDB Lưu Data | _________ | ☐ ✅ ☐ ❌ | |
| Login/Register | _________ | ☐ ✅ ☐ ❌ | |
| Search/Filter | _________ | ☐ ✅ ☐ ❌ | |
| Error Handling | _________ | ☐ ✅ ☐ ❌ | |
| Postman Demo | _________ | ☐ ✅ ☐ ❌ | |

### 12.2 Issues Found (Nếu có)

**Issue #1:**
```
Description: _________________________________
Severity: ☐ Critical  ☐ High  ☐ Medium  ☐ Low
Reproduction Steps: _________________________
Expected Result: _____________________________
Actual Result: _______________________________
```

**Issue #2:**
```
Description: _________________________________
Severity: ☐ Critical  ☐ High  ☐ Medium  ☐ Low
Reproduction Steps: _________________________
Expected Result: _____________________________
Actual Result: _______________________________
```

### 12.3 Approval
- [ ] ✅ Tất cả tests pass
- [ ] ✅ Không có critical issues
- [ ] ✅ Sẵn sàng cho production/next phase

**QA Sign-off:** _________________ Date: ________

---

## 📚 REFERENCE

- **API Documentation:** `API_DOCUMENTATION.md`
- **Auth Guide:** `AUTHENTICATION_AND_USER_GUIDE.md`
- **Quick Reference:** `QUICK_TEST_REFERENCE.md`
- **Detailed Guide:** `TESTING_GUIDE_FOR_NEWBIE.md`
- **Postman Collection:** `Postman_Collection.json`

**Import Postman Collection:**
1. Mở Postman
2. Click "Import" (trên cùng bên trái)
3. Chọn file `Postman_Collection.json`
4. Click "Import"
5. Tất cả test cases sẽ có sẵn

---

**Tài liệu này được cập nhật:** 26/05/2026  
**Phiên bản:** 1.0
