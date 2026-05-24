# 🎯 HƯỚNG DẪN DEMO PROJECT HOÀN CHỈNH

## ✅ **HỆ THỐNG ĐÃ HOÀN THÀNH**

Project hiện đã có **tất cả chức năng cần thiết** để demo:

### **📊 Backend (API)**
- ✅ MongoDB kết nối & lưu dữ liệu
- ✅ Authentication: Register, Login, Logout
- ✅ CRUD Products (Create, Read, Update, Delete)
- ✅ CRUD Users (Admin quản lý)
- ✅ CRUD Orders (Tạo, xem, quản lý)
- ✅ Validation & Error Handling
- ✅ Stock Management (Tự động trừ/hoàn lại)
- ✅ Role-based Access Control (User vs Admin)

### **🎨 Frontend (Views)**
- ✅ Trang chủ (index)
- ✅ Danh sách sản phẩm (shop)
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng
- ✅ Checkout
- ✅ **Trang đăng nhập** (/login)
- ✅ **Trang đăng ký** (/register)
- ✅ **Trang hồ sơ** (/profile)
- ✅ **Admin Dashboard** (/admin)
- ✅ **Quản lý sản phẩm** (/admin/products)
- ✅ **Quản lý đơn hàng** (/admin/orders)
- ✅ **Quản lý người dùng** (/admin/users)

---

## 🚀 **BƯỚC 1: KHỞI CHẠY SERVER**

Server đã chạy tại: **http://localhost:3000**

```bash
# Nếu cần restart, chạy:
cd /home/asus/Van_Phong_Pham_Shop
npm start
```

Xác nhận output:
```
✅ Server đang chạy tại http://localhost:3000
✅ MongoDB Connected: 127.0.0.1
```

---

## 📱 **BƯỚC 2: TEST FRONTEND - KHÔNG CẦN POSTMAN**

### **2.1 - Vào Trang Chủ**
```
http://localhost:3000/
```
✅ Xem danh sách sản phẩm, hình ảnh, giá tiền

---

### **2.2 - Đăng Ký Tài Khoản Mới**
```
http://localhost:3000/register
```

**Form đăng ký:**
```
Username: testuser123
Email: testuser@example.com
Password: password123
Confirm Password: password123
```

✅ Click "Đăng Ký" → Sẽ redirect đến trang đăng nhập
✅ Check MongoDB: Collection `users` được tạo

---

### **2.3 - Đăng Nhập**
```
http://localhost:3000/login
```

**Login:**
```
Email: testuser@example.com
Password: password123
```

✅ Click "Đăng Nhập" → Redirect trang chủ
✅ Lúc này session được tạo

---

### **2.4 - Xem Hồ Sơ Cá Nhân**
```
http://localhost:3000/profile
```

✅ Xem thông tin: Username, Email, Role (user)
✅ Nút "Đổi Mật Khẩu", "Đăng Xuất"

---

### **2.5 - Xem Sản Phẩm & Thêm Vào Giỏ**
```
http://localhost:3000/shop
```

✅ Click vào sản phẩm → Xem chi tiết
✅ Thêm vào giỏ hàng
✅ Checkout → Tạo đơn hàng
✅ Order được lưu vào MongoDB!

---

## 👨‍💼 **BƯỚC 3: DEMO ADMIN - QUẢN LÝ HỆ THỐNG**

### **3.1 - Tạo Tài Khoản Admin**
```
http://localhost:3000/register
```

**Dữ liệu:**
```
Username: admin123
Email: admin@example.com
Password: admin123
Confirm Password: admin123
```

> **Lưu ý:** Sau khi đăng ký, bạn cần **update role thành admin** trong MongoDB:
```bash
mongosh mongodb://127.0.0.1:27017/EduStore
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

---

### **3.2 - Đăng Nhập Admin**
```
http://localhost:3000/login
```

**Login:**
```
Email: admin@example.com
Password: admin123
```

✅ Redirect trang chủ

---

### **3.3 - Vào Admin Dashboard**
```
http://localhost:3000/admin
```

✅ Xem thống kê:
   - Tổng số sản phẩm
   - Tổng số khách hàng
   - Tổng số đơn hàng
   - Doanh thu
- Đơn hàng gần đây
- Sản phẩm mới

---

### **3.4 - Quản Lý Sản Phẩm**
```
http://localhost:3000/admin/products
```

#### **Thêm Sản Phẩm:**
```
/admin/products/add
```

**Form:**
```
SKU: BUT-100
Tên: Bút bi xanh
Giá: 5000
Stock: 100
Danh mục: Bút
Mô tả: Bút bi chất lượng cao
Ảnh: Upload file JPG/PNG
```

✅ Click "Thêm" → Lưu vào MongoDB

#### **Chỉnh Sửa Sản Phẩm:**
```
Click nút "✏️ Sửa" trên danh sách
```

✅ Thay đổi thông tin → Click "Lưu Thay Đổi"

#### **Xóa Sản Phẩm:**
```
Click nút "🗑️ Xóa" trên danh sách
```

✅ Sản phẩm được ẩn (soft delete)

---

### **3.5 - Quản Lý Đơn Hàng**
```
http://localhost:3000/admin/orders
```

✅ Danh sách tất cả đơn hàng
✅ Filter theo trạng thái (Chờ xác nhận, Đã xác nhận, Đang giao, Đã giao)

#### **Xem Chi Tiết Đơn Hàng:**
```
Click nút "👁️ Xem" trên danh sách
```

✅ Thông tin khách hàng
✅ Địa chỉ giao hàng
✅ Chi tiết sản phẩm
✅ Cập nhật trạng thái & thanh toán

#### **Cập Nhật Trạng Thái:**
```
- Thay đổi "Trạng Thái Đơn": pending → confirmed → shipped → delivered
- Thay đổi "Thanh Toán": pending → paid
- Thêm ghi chú
- Click "💾 Lưu Thay Đổi"
```

---

### **3.6 - Quản Lý Người Dùng**
```
http://localhost:3000/admin/users
```

✅ Danh sách tất cả người dùng
✅ Tìm kiếm theo tên / email
✅ Xem thông tin chi tiết

---

## 🗄️ **BƯỚC 4: KIỂM TRA MONGODB**

Mở Terminal và chạy:

```bash
mongosh mongodb://127.0.0.1:27017/EduStore
```

### **Xem Dữ Liệu:**
```javascript
// Xem tất cả users
db.users.find().pretty()

// Xem tất cả products
db.products.find().pretty()

// Xem tất cả orders
db.orders.find().pretty()

// Đếm số lượng
db.users.countDocuments()
db.products.countDocuments()
db.orders.countDocuments()
```

---

## 🧪 **BƯỚC 5: TEST VALIDATIONS & ERRORS**

### **Test Validation Register:**
```
http://localhost:3000/register
```

- **Username < 3 ký tự** → Error "Username phải ít nhất 3 ký tự"
- **Email không hợp lệ** → Error "Email không hợp lệ"
- **Password < 6 ký tự** → Error "Mật khẩu phải ít nhất 6 ký tự"
- **Password không khớp** → Error "Mật khẩu không khớp"

### **Test Validation Products:**
- **Thêm sản phẩm không có tên** → Error
- **Giá âm** → Error
- **Stock âm** → Error

### **Test Stock Management:**
1. Tạo đơn hàng (Stock sẽ bị trừ)
2. Hủy đơn hàng (Stock sẽ hoàn lại)
3. Kiểm tra MongoDB → Stock thay đổi đúng

---

## 📊 **FLOW DEMO HOÀN CHỈNH**

```
1. Mở http://localhost:3000
   ↓
2. Xem danh sách sản phẩm
   ↓
3. Vào /register → Đăng ký tài khoản
   ↓
4. Vào /login → Đăng nhập
   ↓
5. Vào /profile → Xem hồ sơ
   ↓
6. Vào /shop → Xem sản phẩm
   ↓
7. Click sản phẩm → Thêm vào giỏ
   ↓
8. Checkout → Tạo đơn hàng
   ↓
9. Vào /admin → Admin Dashboard
   ↓
10. Quản lý sản phẩm, đơn hàng, người dùng
   ↓
11. MongoDB: Kiểm tra tất cả dữ liệu
   ↓
✅ DEMO THÀNH CÔNG!
```

---

## 🐛 **Troubleshooting**

### **Lỗi: "Trang không tồn tại"**
- Kiểm tra URL đúng chưa
- Kiểm tra server có chạy không (http://localhost:3000)

### **Lỗi: "Chưa đăng nhập"**
- Cần login trước vào /login
- Session hết hạn → Login lại

### **Lỗi: "Không có quyền truy cập"**
- Chỉ Admin có thể vào /admin
- Cần update role = "admin" trong MongoDB

### **MongoDB không có dữ liệu**
```bash
# Kiểm tra kết nối
mongosh mongodb://127.0.0.1:27017/EduStore
db.users.find()
```

---

## 📝 **TÓMLẠI - ĐỦ CHỨC NĂNG DEMO**

```
✅ Backend API hoàn chỉnh (27 endpoints)
✅ Frontend Views tất cả (login, register, shop, admin)
✅ Authentication & Authorization
✅ CRUD Operations (Products, Users, Orders)
✅ Validation & Error Handling
✅ MongoDB Integration
✅ Stock Management
✅ Admin Dashboard & Management

🎉 PROJECT SẴN SÀNG DEMO!
```

---

## 🎓 **File Tham Khảo**

- [CODE_SUPPLEMENTS.md](CODE_SUPPLEMENTS.md) - Mã bổ sung chi tiết
- [CRUD_GUIDE.md](CRUD_GUIDE.md) - Hướng dẫn Product CRUD
- [AUTHENTICATION_AND_USER_GUIDE.md](AUTHENTICATION_AND_USER_GUIDE.md) - Auth & User
- [ORDER_GUIDE.md](ORDER_GUIDE.md) - Order Management
- [BACKEND_SUMMARY.md](BACKEND_SUMMARY.md) - Tóm tắt backend

---

**Chúc bạn demo thành công! 🚀**
