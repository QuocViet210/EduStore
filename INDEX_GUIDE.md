# 📚 CHỈ MỤC ĐẦY ĐỦ - TOÀN BỘ HƯỚNG DẪN TEST & THÊM SẢN PHẨM

---

## 🎯 CHỌN TÀI LIỆU THEO MỤC ĐÍCH

### ❓ Mục đích của bạn?

#### 🆕 "Tôi muốn học test ứng dụng từ đầu"
→ Đọc: [**TESTING_GUIDE_FOR_NEWBIE.md**](TESTING_GUIDE_FOR_NEWBIE.md)
- Hướng dẫn đầy đủ từ setup → test API → kiểm tra database
- Phù hợp cho newbie, có giải thích chi tiết

---

#### 📦 "Tôi muốn thêm sản phẩm vào database"
→ Đọc: [**ADD_PRODUCTS_GUIDE.md**](ADD_PRODUCTS_GUIDE.md)
- 3 cách thêm sản phẩm: Seed, API, MongoDB Shell
- Chi tiết từng bước, có ví dụ

---

#### 🔍 "Tôi muốn kiểm tra dữ liệu trong MongoDB"
→ Đọc: [**MONGODB_CHECK_GUIDE.md**](MONGODB_CHECK_GUIDE.md)
- Các lệnh MongoDB chi tiết
- Query nâng cao, visual guide
- Troubleshooting

---

#### ⚡ "Tôi vội, cần lệnh nhanh"
→ Đọc: [**ADD_PRODUCTS_QUICK_REFERENCE.md**](ADD_PRODUCTS_QUICK_REFERENCE.md)
- Copy-paste sẵn sàng
- Lệnh nhanh không giải thích
- **In ra để tham khảo**

---

#### 📊 "Tôi muốn hiểu cấu trúc & quy trình"
→ Đọc: [**TESTING_FLOW_DIAGRAM.md**](TESTING_FLOW_DIAGRAM.md)
- Diagram ASCII giải thích
- Data flow, authentication flow
- HTTP status codes

---

#### ✅ "Tôi cần checklist toàn bộ"
→ Đọc: [**TESTING_CHECKLIST.md**](TESTING_CHECKLIST.md)
- 12 phần kiểm tra đầy đủ
- Có checkbox để tick
- Chi tiết kỳ vọng kết quả

---

#### 🌐 "Tôi muốn test API bằng Postman"
→ Sử dụng: [**Postman_Collection.json**](Postman_Collection.json)
- Import vào Postman/Insomnia
- 20+ requests sẵn sàng
- Không cần gõ lại URL

---

#### 📚 "Tôi muốn hiểu authentication"
→ Đọc: [**AUTHENTICATION_AND_USER_GUIDE.md**](AUTHENTICATION_AND_USER_GUIDE.md)
- Login, Register chi tiết
- Validation rules
- Error cases

---

#### 📖 "Tôi muốn hiểu API endpoints"
→ Đọc: [**API_DOCUMENTATION.md**](API_DOCUMENTATION.md)
- Tài liệu API chi tiết
- Request/Response examples
- CRUD endpoints

---

---

## 📂 TẤT CẢ TÀI LIỆU

### 📋 Hướng dẫn chính

| File | Mục đích | Cho ai | Đọc bao lâu |
|------|---------|--------|------------|
| **TESTING_GUIDE_FOR_NEWBIE.md** | Hướng dẫn test toàn bộ | Newbie, lần đầu | 20-30 phút |
| **ADD_PRODUCTS_GUIDE.md** | Thêm sản phẩm (3 cách) | Muốn thêm sản phẩm | 15-20 phút |
| **MONGODB_CHECK_GUIDE.md** | Kiểm tra MongoDB chi tiết | Muốn hiểu MongoDB | 15-20 phút |
| **TESTING_FLOW_DIAGRAM.md** | Diagram & flow | Muốn hiểu cấu trúc | 10-15 phút |

---

### ⚡ Quick Reference (In ra)

| File | Mục đích | Dùng khi |
|------|---------|---------|
| **QUICK_TEST_REFERENCE.md** | Lệnh nhanh test | Cần reference nhanh |
| **ADD_PRODUCTS_QUICK_REFERENCE.md** | Lệnh nhanh thêm sản phẩm | Cần reference nhanh |

---

### ✅ Checklist & Collection

| File | Mục đích | Dùng khi |
|------|---------|---------|
| **TESTING_CHECKLIST.md** | Checklist 12 phần | Verify hết tất cả |
| **Postman_Collection.json** | API requests Postman | Test API bằng Postman |

---

### 📖 Tài liệu API & Auth (Sẵn có)

| File | Mục đích |
|------|---------|
| **API_DOCUMENTATION.md** | API endpoints chi tiết |
| **AUTHENTICATION_AND_USER_GUIDE.md** | Auth & user management |
| **BACKEND_SUMMARY.md** | Tổng hợp backend |
| **CRUD_GUIDE.md** | CRUD operations |
| **ORDER_GUIDE.md** | Order management |

---

### 🗂️ Index & Hướng dẫn

| File | Mục đích |
|------|---------|
| **TESTING_DOCUMENTATION_INDEX.md** | Index toàn bộ testing docs |
| **INDEX_GUIDE.md** (File này) | Index toàn bộ (bạn đang đọc) |

---

---

## 🚀 ROADMAP: BẠCH NGƯỜI MỚI 5 NGÀY

### ☀️ NGÀY 1: Setup & Hiểu cơ bản (60 phút)

**Bước 1:** Đọc giới thiệu (5 phút)
```
File: README.md hoặc DEMO_GUIDE.md
Mục đích: Hiểu ứng dụng là gì
```

**Bước 2:** Cài đặt (15 phút)
```
Lệnh: npm install
Check: npm -v, node -v, mongosh
```

**Bước 3:** Khởi chạy (15 phút)
```
Lệnh: npm run seed && npm start
Check: http://localhost:3000 hoạt động
```

**Bước 4:** Đọc hướng dẫn cơ bản (20 phút)
```
File: TESTING_GUIDE_FOR_NEWBIE.md (Phần 1-3)
Mục đích: Hiểu khái niệm cơ bản
```

**Bước 5:** Kiểm tra MongoDB (5 phút)
```
Lệnh: mongosh → use van_phong_pham_shop → db.products.countDocuments()
Kỳ vọng: 10 sản phẩm
```

---

### ☀️ NGÀY 2: Test API Public (60 phút)

**Bước 1:** Đọc hướng dẫn (10 phút)
```
File: TESTING_GUIDE_FOR_NEWBIE.md (Phần 5)
Mục đích: Hiểu public API
```

**Bước 2:** Cài Postman/Thunder Client (10 phút)
```
Action: Tải & cài Postman hoặc cài Thunder Client extension
```

**Bước 3:** Import Postman Collection (5 phút)
```
File: Postman_Collection.json
Action: Import vào Postman
```

**Bước 4:** Test từng endpoint (25 phút)
```
Tests:
- GET /api/products (list)
- GET /api/products?search=bút (search)
- GET /api/products?category=Bút (filter)
- GET /api/products/{ID} (detail)

Check: Tất cả return 200 + data
```

**Bước 5:** Verify dữ liệu (10 phút)
```
MongoDB: db.products.find().pretty()
Check: Dữ liệu từ API khớp với MongoDB
```

---

### ☀️ NGÀY 3: Test Auth (60 phút)

**Bước 1:** Đọc hướng dẫn (10 phút)
```
File: AUTHENTICATION_AND_USER_GUIDE.md
Mục đích: Hiểu Auth flow
```

**Bước 2:** Test Register (15 phút)
```
Postman: POST /api/users/auth/register
Body: username, email, password, confirmPassword
Check: 201 Created + user trong MongoDB
```

**Bước 3:** Test Login (15 phút)
```
Postman: POST /api/users/auth/login
Body: email, password
Check: 200 OK + session cookie
```

**Bước 4:** Test Protected Endpoint (15 phút)
```
Postman: GET /api/users/profile/me (sau login)
Check: 200 OK + user data

Logout & test lại:
Check: 401 Unauthorized
```

**Bước 5:** Verify MongoDB (5 phút)
```
MongoDB: db.users.find().pretty()
Check: User mới được tạo, password hashed
```

---

### ☀️ NGÀY 4: CRUD & Thêm Sản Phẩm (60 phút)

**Bước 1:** Đọc hướng dẫn (10 phút)
```
File: ADD_PRODUCTS_GUIDE.md
Mục đích: Hiểu 3 cách thêm sản phẩm
```

**Bước 2:** Cách 1 - Seed (5 phút)
```
Lệnh: npm run seed
Check: Sản phẩm được tạo
```

**Bước 3:** Cách 2 - API (20 phút)
```
Postman: POST /api/products (need Admin auth)
Body: sku, name, price, stock, category, image
Check: 201 Created + product trong MongoDB
Lưu _id: ___________________
```

**Bước 4:** Cách 3 - MongoDB Shell (15 phút)
```
MongoDB: db.products.insertOne({...})
Check: Product được tạo
```

**Bước 5:** Verify (10 phút)
```
Postman: GET /api/products
Check: Có sản phẩm mới

MongoDB: db.products.countDocuments()
Check: Số lượng tăng
```

---

### ☀️ NGÀY 5: CRUD Lengkap & Review (60 phút)

**Bước 1:** Đọc hướng dẫn (5 phút)
```
File: TESTING_CHECKLIST.md (Phần 7)
Mục đích: CRUD toàn bộ
```

**Bước 2:** UPDATE - Sản phẩm (15 phút)
```
Postman: PUT /api/products/{ID}
Body: name, price, stock (tuỳ chọn)
Check: 200 OK

MongoDB: Verify data cập nhật
```

**Bước 3:** DELETE - Sản phẩm (15 phút)
```
Postman: DELETE /api/products/{ID}
Check: 200 OK

MongoDB: Verify product bị xóa/ẩn
```

**Bước 4:** Data Persistence Test (15 phút)
```
Lệnh: npm start (dừng & restart server)
Check: Dữ liệu vẫn tồn tại
```

**Bước 5:** Final Review (10 phút)
```
File: TESTING_CHECKLIST.md
Action: Tick hết tất cả ✅

Kết quả: 🎉 Hoàn thành!
```

---

---

## 🎯 WORKFLOW NHANH: 15 PHÚT

Nếu bạn muốn setup nhanh nhất:

### Terminal 1
```bash
npm run seed && npm start
```

### Terminal 2
```bash
mongosh
use van_phong_pham_shop
db.products.countDocuments()
```

### Postman
1. Import: Postman_Collection.json
2. Test: GET /api/products
3. Test: POST /api/users/auth/register
4. Test: POST /api/users/auth/login

**Done!** ✅ Tất cả hoạt động

---

---

## 📋 CHECKLIST: HỌC TUẦN ĐẦU

```
NGÀY 1: Setup
[ ] npm install
[ ] npm run seed
[ ] npm start
[ ] mongosh → db.products.countDocuments()
[ ] Hiểu cơ bản ứng dụng

NGÀY 2: API
[ ] Cài Postman/Thunder Client
[ ] Import Postman_Collection.json
[ ] Test GET /api/products (5 requests)
[ ] Verify data trong MongoDB

NGÀY 3: Auth
[ ] Test POST /register
[ ] Test POST /login
[ ] Test GET /profile/me
[ ] Verify user trong MongoDB

NGÀY 4: Thêm Sản Phẩm
[ ] Cách 1: npm run seed
[ ] Cách 2: API POST /api/products
[ ] Cách 3: MongoDB insertOne()
[ ] Verify 3 sản phẩm trong MongoDB

NGÀY 5: CRUD Hoàn
[ ] Test PUT /api/products (update)
[ ] Test DELETE /api/products (delete)
[ ] Data persistence test
[ ] ✅ Tick checklist hoàn thành
```

---

---

## 🎁 BONUS: RESOURCES

### Tài liệu ngoài

| Topic | Resource | Link |
|-------|----------|------|
| MongoDB | Official Docs | https://docs.mongodb.com/ |
| Mongoose | Schema & Models | https://mongoosejs.com/ |
| Express | REST API | https://expressjs.com/ |
| Postman | API Testing | https://www.postman.com/ |

---

### Tools hữu ích

| Tool | Mục đích | Download |
|------|---------|----------|
| Postman | API Testing | https://www.postman.com/downloads/ |
| Thunder Client | VS Code Extension | Marketplace |
| MongoDB Compass | Database GUI | https://www.mongodb.com/products/compass |
| VS Code | Code Editor | https://code.visualstudio.com/ |

---

---

## 🚨 LƯU Ý QUAN TRỌNG

### ❗ Trước khi bắt đầu

```
✅ MongoDB phải running
✅ Node.js & npm cài đặt
✅ File .env cấu hình đúng
✅ npm dependencies cài đủ (npm install)
```

### ❗ Khi gặp lỗi

```
1️⃣ Kiểm tra [TROUBLESHOOTING] section trong hướng dẫn
2️⃣ Đọc error message kỹ lưỡng
3️⃣ Kiểm tra MongoDB running: mongosh ping
4️⃣ Xem terminal log của server
5️⃣ Restart server & thử lại
```

### ❗ Workflow chuẩn

```
1️⃣ Đọc hướng dẫn (5-10 phút)
2️⃣ Chạy lệnh (2-5 phút)
3️⃣ Test kết quả (5 phút)
4️⃣ Kiểm tra MongoDB (2 phút)
5️⃣ Ghi chú kết quả (1 phút)
```

---

---

## 📞 SUPPORT

**Nếu cần giúp đỡ:**

1. **Lỗi MongoDB?**
   - Xem: MONGODB_CHECK_GUIDE.md - Troubleshooting

2. **Lỗi API?**
   - Xem: ADD_PRODUCTS_GUIDE.md - Troubleshooting

3. **Không biết test?**
   - Xem: TESTING_CHECKLIST.md

4. **Cần copy lệnh?**
   - Xem: ADD_PRODUCTS_QUICK_REFERENCE.md

---

---

## ✨ SUMMARY

| Bạn muốn | → Đọc file |
|---------|----------|
| Học test toàn bộ | TESTING_GUIDE_FOR_NEWBIE.md |
| Thêm sản phẩm | ADD_PRODUCTS_GUIDE.md |
| Kiểm tra MongoDB | MONGODB_CHECK_GUIDE.md |
| Lệnh nhanh | ADD_PRODUCTS_QUICK_REFERENCE.md |
| Hiểu cấu trúc | TESTING_FLOW_DIAGRAM.md |
| Checklist hết | TESTING_CHECKLIST.md |
| API requests | Postman_Collection.json |

**Mỗi file độc lập, đủ để bạn xử lý 1 nhiệm vụ!**

---

---

## 🎉 KẾT LUẬN

Sau khi học xong **5 ngày**:

✅ Hiểu MongoDB hoạt động thế nào  
✅ Biết cách thêm sản phẩm 3 cách khác  
✅ Có thể test API bằng Postman  
✅ Hiểu Auth flow (login/register)  
✅ Biết CRUD operations  
✅ Sẵn sàng cho development tiếp theo  

---

**Tài liệu được cập nhật:** 26/05/2026  
**Phiên bản:** 1.0  
**Ngôn ngữ:** Tiếng Việt  

**Happy Learning! 🚀**
