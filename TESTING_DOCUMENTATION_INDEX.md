# 📚 TESTING DOCUMENTATION INDEX

Hướng dẫn này giúp bạn tìm đúng tài liệu cần đọc cho từng mục đích!

---

## 🎯 CHỌN ĐÚNG TÀI LIỆU CHO MỤC ĐÍCH CỦA BẠN

### ❓ "Tôi là newbie, muốn biết cách test từ đầu"
👉 **Đọc:** [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md)
- Hướng dẫn chi tiết từng bước (5-6 phút đọc)
- Giải thích cách setup, cài đặt, khởi chạy
- Test từng tính năng từng cái một
- Có troubleshooting cho lỗi phổ biến

---

### ⏱️ "Tôi vội, cần lệnh nhanh để test"
👉 **Đọc:** [QUICK_TEST_REFERENCE.md](QUICK_TEST_REFERENCE.md)
- Các lệnh nhanh (2-3 phút đọc)
- Copy-paste lệnh shell và API requests
- Không có giải thích chi tiết
- Phù hợp để in ra hoặc bookmark

---

### ✅ "Tôi cần checklist để kiểm tra hết tất cả"
👉 **Đọc:** [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- Checklist chi tiết từng step (20-30 phút để test)
- Có từng checkbox để tick khi done
- Chi tiết kỳ vọng kết quả của mỗi test
- Chỉ đạo what, where, when test

---

### 🌐 "Tôi muốn test API bằng Postman"
👉 **Sử dụng:** [Postman_Collection.json](Postman_Collection.json)
- Import trực tiếp vào Postman
- Cách import:
  1. Mở Postman
  2. Click "Import" (góc trên cùng)
  3. Chọn file `Postman_Collection.json`
  4. Click "Import"
  5. Có sẵn tất cả request tests
- Không cần gõ URL/Body lại

---

### 📊 "Tôi muốn hiểu cấu trúc & quy trình test"
👉 **Đọc:** [TESTING_FLOW_DIAGRAM.md](TESTING_FLOW_DIAGRAM.md)
- Diagram ASCII (5-10 phút đọc)
- Hiển thị data flow từ request đến database
- Mô tả các bước trong quy trình
- Giải thích HTTP status codes
- Bảng so sánh quick reference

---

### 🔍 "Muốn hiểu kỹ API endpoints"
👉 **Đọc:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Tài liệu API chi tiết (dự án sẵn có)
- Mô tả từng endpoint
- Request/Response examples
- Validation rules

---

### 🔐 "Tôi cần hiểu Authentication"
👉 **Đọc:** [AUTHENTICATION_AND_USER_GUIDE.md](AUTHENTICATION_AND_USER_GUIDE.md)
- Tài liệu Auth chi tiết (dự án sẵn có)
- Cách register/login/logout
- Validation rules cho user
- Password requirements

---

## 📖 READING ROADMAP (Nên đọc theo thứ tự này)

```
DAY 1 - Setup & Understanding
│
├─ 1. README hoặc DEMO_GUIDE (hiểu dự án chung)
├─ 2. TESTING_GUIDE_FOR_NEWBIE (đọc chi tiết)
├─ 3. TESTING_FLOW_DIAGRAM (hiểu cấu trúc)
└─ 4. Setup server & test manually
   
DAY 2 - Deep Dive
│
├─ 1. AUTHENTICATION_AND_USER_GUIDE
├─ 2. API_DOCUMENTATION
├─ 3. TESTING_CHECKLIST (đối chiếu từng test)
└─ 4. Test các case edge/error

DAY 3 - Mastery
│
├─ 1. QUICK_TEST_REFERENCE (reference nhanh)
├─ 2. Postman Collection (test bằng Postman)
├─ 3. BACKEND_SUMMARY (nếu cần)
└─ 4. CRUD_GUIDE, ORDER_GUIDE (tính năng khác)
```

---

## 🎬 THỰC HIỆN CÓN DỠI: STEP BY STEP

### Buổi 1: Setup (60 phút)

**Time: 0-15 phút**
- [ ] Đọc phần 1-2 của [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md)
- [ ] Cài Node.js, npm, MongoDB

**Time: 15-30 phút**
- [ ] Chạy: `cd /home/asus/Van_Phong_Pham_Shop && npm install`
- [ ] Tạo/check file `.env`
- [ ] Kiểm tra MongoDB: `mongosh`

**Time: 30-45 phút**
- [ ] Chạy seed: `npm run seed`
- [ ] Chạy server: `npm start`
- [ ] Test: `curl http://localhost:3000`

**Time: 45-60 phút**
- [ ] Cài Postman hoặc Thunder Client
- [ ] Import [Postman_Collection.json](Postman_Collection.json)
- [ ] Gửi request GET `/api/products`

### Buổi 2: Test Public API (60 phút)

**Time: 0-10 phút**
- [ ] Đọc phần 5.1-5.5 của [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md)
- [ ] Xem [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Phần 5

**Time: 10-40 phút**
- [ ] Dùng Postman test từng API:
  - [ ] GET /api/products (List)
  - [ ] GET /api/products?page=1&limit=5 (Pagination)
  - [ ] GET /api/products?search=bút (Search)
  - [ ] GET /api/products?category=Bút (Filter)
  - [ ] GET /api/products/{ID} (Detail)

**Time: 40-60 phút**
- [ ] Kiểm tra MongoDB: `db.products.find().limit(1).pretty()`
- [ ] Ghi chú kết quả vào [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- [ ] Tick các checkbox ✓

### Buổi 3: Test Authentication (60 phút)

**Time: 0-10 phút**
- [ ] Đọc [AUTHENTICATION_AND_USER_GUIDE.md](AUTHENTICATION_AND_USER_GUIDE.md)
- [ ] Xem [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) - Phần 6

**Time: 10-30 phút**
- [ ] Postman: POST /api/users/auth/register
  - [ ] Register user mới
  - [ ] Check: response có _id không?
- [ ] MongoDB: `db.users.find().pretty()`
  - [ ] Check: user được tạo không?

**Time: 30-50 phút**
- [ ] Postman: POST /api/users/auth/login
  - [ ] Login với user vừa tạo
  - [ ] Check: có cookie không? (DevTools)
- [ ] Postman: GET /api/users/profile/me
  - [ ] Check: nhận được data không?

**Time: 50-60 phút**
- [ ] Postman: POST /api/users/auth/logout
  - [ ] Logout
- [ ] Postman: GET /api/users/profile/me (sau logout)
  - [ ] Check: 401 Unauthorized không?
- [ ] Ghi chú vào checklist

### Buổi 4: Test CRUD Admin (60 phút)

**Time: 0-10 phút**
- [ ] Đọc phần 7 của [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- [ ] Đăng nhập lại với tài khoản Admin

**Time: 10-25 phút**
- [ ] Postman: POST /api/products (CREATE)
  - [ ] Tạo sản phẩm mới
  - [ ] Check: 201 Created?
  - [ ] Check: có _id?
  - [ ] Lưu _id: _____________________

**Time: 25-40 phút**
- [ ] Postman: PUT /api/products/{ID} (UPDATE)
  - [ ] Cập nhật giá hoặc tên
  - [ ] Check: 200 OK?
- [ ] MongoDB: `db.products.findById(ObjectId("{ID}"))`
  - [ ] Check: data cập nhật?

**Time: 40-55 phút**
- [ ] Postman: DELETE /api/products/{ID} (DELETE)
  - [ ] Xóa sản phẩm vừa tạo
  - [ ] Check: 200 OK?
- [ ] GET /api/products/{ID} lại
  - [ ] Check: 404 Not Found?

**Time: 55-60 phút**
- [ ] Ghi chú vào checklist
- [ ] Kiểm tra MongoDB data thay đổi

### Buổi 5: Data Persistence & Review (60 phút)

**Time: 0-10 phút**
- [ ] Đọc phần 8 của [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)

**Time: 10-25 phút**
- [ ] Dừng server: Ctrl+C
- [ ] MongoDB: `db.products.countDocuments()`
- [ ] Kiểm tra: số lượng có giữ nguyên?

**Time: 25-40 phút**
- [ ] Khởi động lại server: `npm start`
- [ ] Check MongoDB connected?
- [ ] Postman: GET /api/products
- [ ] Kiểm tra: dữ liệu load lại?

**Time: 40-60 phút**
- [ ] Review [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
- [ ] Tick hết tất cả ✅
- [ ] Ghi chú issues nếu có
- [ ] **🎉 HOÀN THÀNH!**

---

## 📂 TẤT CẢ TÀI LIỆU TEST

| File | Loại | Mục đích | Thời gian đọc |
|------|------|---------|----------------|
| **TESTING_GUIDE_FOR_NEWBIE.md** | 📖 Hướng dẫn | Chi tiết từng bước | 20-30 phút |
| **QUICK_TEST_REFERENCE.md** | ⚡ Reference | Lệnh nhanh | 3-5 phút |
| **TESTING_CHECKLIST.md** | ✅ Checklist | Kiểm tra hết | 30+ phút |
| **TESTING_FLOW_DIAGRAM.md** | 📊 Diagram | Hiểu cấu trúc | 10-15 phút |
| **Postman_Collection.json** | 🌐 API | Test API | Dùng trực tiếp |
| **API_DOCUMENTATION.md** | 📚 API Doc | Chi tiết API | 20-30 phút |
| **AUTHENTICATION_AND_USER_GUIDE.md** | 🔐 Auth | Auth details | 10-15 phút |

---

## 🚀 LỆNH NHANH NHẤT (Chỉ 3 dòng để khởi động)

```bash
# 1. Cài dependencies
npm install

# 2. Seed dữ liệu
npm run seed

# 3. Chạy server
npm start
```

**Kết quả:** Server chạy tại http://localhost:3000 ✅

---

## 🎯 TEST CASES QUAN TRỌNG

### Tối thiểu cần test:
1. ✅ **API hoạt động**: GET /api/products → 200 + data
2. ✅ **CRUD hoạt động**: POST/PUT/DELETE thành công
3. ✅ **MongoDB lưu dữ liệu**: Kiểm tra MongoDB Shell
4. ✅ **Login/Register**: Tạo user, login thành công
5. ✅ **Data persistence**: Stop/restart server, dữ liệu vẫn có

### Ngoài ra nên test:
- [ ] Search & Filter API
- [ ] Error handling (invalid input, non-existent ID)
- [ ] Authorization (admin vs user)
- [ ] Session timeout
- [ ] Image upload (CREATE product)

---

## ❓ FAQ - CÂU HỎI THƯỜNG GẶP

### Q1: File nào tôi nên in ra?
**A:** In [QUICK_TEST_REFERENCE.md](QUICK_TEST_REFERENCE.md) hoặc phần Summary của [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md)

### Q2: Tôi nên dùng Postman hay Thunder Client?
**A:** Cả hai đều được. Postman phổ biến hơn, Thunder Client nhanh hơn (VSCode extension)

### Q3: Làm sao import Postman Collection?
**A:** Xem [QUICK_TEST_REFERENCE.md](QUICK_TEST_REFERENCE.md) - phần "Import Postman Collection"

### Q4: MongoDB connection error, sao?
**A:** Xem [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md) - phần Troubleshooting

### Q5: Làm sao để test mà không cần Postman?
**A:** Dùng Terminal với `curl`:
```bash
curl http://localhost:3000/api/products
```

### Q6: Test được multiple requests cùng lúc không?
**A:** Có, nhưng phải setup properly (ngoài phạm vi hướng dẫn này)

---

## 🎓 RESOURCES THÊM

- **VS Code Extension:** Thunder Client (dễ hơn Postman)
- **Node Version Manager:** nvm (để quản lý node versions)
- **Database GUI:** MongoDB Compass (để xem data GUI)
- **API Testing:** Insomnia (thay thế Postman)

---

## 📞 SUPPORT

Nếu gặp vấn đề:

1. **Lỗi MongoDB?**
   → Xem [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md) - Troubleshooting

2. **Lỗi API?**
   → Check [QUICK_TEST_REFERENCE.md](QUICK_TEST_REFERENCE.md) - "LỖI PHỔ BIẾN"

3. **Không biết test gì tiếp?**
   → Theo [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) từng bước

4. **Muốn hiểu cấu trúc?**
   → Đọc [TESTING_FLOW_DIAGRAM.md](TESTING_FLOW_DIAGRAM.md)

---

## ✨ SUMMARY

**5 bước để bắt đầu test:**

1. 📖 Đọc [TESTING_GUIDE_FOR_NEWBIE.md](TESTING_GUIDE_FOR_NEWBIE.md) (20 phút)
2. ⚙️ Chạy: `npm install && npm run seed && npm start` (15 phút)
3. 🌐 Import [Postman_Collection.json](Postman_Collection.json) vào Postman
4. ✅ Follow [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) test từng case
5. 🎉 Tick hết ✅ = **Done!**

---

**Tài liệu được tạo:** 26/05/2026  
**Bản phát hành:** 1.0  
**Ngôn ngữ:** Tiếng Việt  

**Happy Testing! 🚀**
