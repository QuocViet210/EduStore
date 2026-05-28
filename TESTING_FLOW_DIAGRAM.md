# 🎯 TESTING FLOW DIAGRAM & VISUAL GUIDE

---

## 1️⃣ OVERALL TESTING WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING VAN PHONG PHAM SHOP                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ SETUP & CONFIG  │  (15 min)
│                 │
│ ✓ npm install   │
│ ✓ .env config   │
│ ✓ MongoDB start │
│ ✓ npm run seed  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ START SERVER    │  (5 min)
│                 │
│ ✓ npm start     │
│ ✓ Port 3000 OK  │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────────────┐
    │   PHASE 1: PUBLIC API TEST (Read)       │
    │                                         │
    │ GET /api/products                       │
    │ GET /api/products?search=...            │
    │ GET /api/products?category=...          │
    │ GET /api/products/:id                   │
    │                                         │
    │ Expected: 200 OK + Data + MongoDB       │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │   PHASE 2: AUTHENTICATION TEST          │
    │                                         │
    │ POST /auth/register          [201]      │
    │ POST /auth/login             [200]      │
    │ GET /users/profile/me        [200]      │
    │ POST /auth/logout            [200]      │
    │                                         │
    │ Expected: User created in MongoDB       │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │   PHASE 3: ADMIN CRUD TEST              │
    │                                         │
    │ POST /api/products           [201]      │
    │ PUT /api/products/:id        [200]      │
    │ DELETE /api/products/:id     [200]      │
    │                                         │
    │ Expected: Product in MongoDB            │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │   PHASE 4: DATA PERSISTENCE TEST        │
    │                                         │
    │ Stop Server (Ctrl+C)                    │
    │ Check MongoDB data still exists         │
    │ Restart Server                          │
    │ Verify data loaded correctly            │
    │                                         │
    │ Expected: All data preserved            │
    └────────┬────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────────┐
    │   PHASE 5: ERROR HANDLING & EDGE CASES  │
    │                                         │
    │ Invalid input → 400 Bad Request         │
    │ Non-existent ID → 404 Not Found         │
    │ Duplicate email → 400 Conflict          │
    │ No auth → 401 Unauthorized              │
    │                                         │
    │ Expected: Proper error messages         │
    └────────┬────────────────────────────────┘
             │
             ▼
        ╔═════════════════╗
        ║ ALL TEST PASS ✅ ║
        ╚═════════════════╝
```

---

## 2️⃣ API ENDPOINTS STRUCTURE

```
┌────────────────────────────────────────────────────────┐
│         HTTP://LOCALHOST:3000 (BASE URL)               │
└────────────────────────────────────────────────────────┘

├─ PUBLIC ENDPOINTS (No Auth Required)
│  │
│  ├─ GET  /api/products                    [LIST]
│  │   Query: ?page=1&limit=10&search=&category=
│  │   Response: [200 OK] Products array + Pagination
│  │
│  ├─ GET  /api/products/:id                [GET ONE]
│  │   Response: [200 OK] Single product
│  │
│  ├─ POST /api/users/auth/register         [CREATE USER]
│  │   Body: {username, email, password, confirmPassword}
│  │   Response: [201 Created] User data
│  │
│  └─ POST /api/users/auth/login            [LOGIN]
│      Body: {email, password}
│      Response: [200 OK] User data + Session
│
├─ PROTECTED ENDPOINTS (Auth Required)
│  │
│  ├─ GET  /api/users/profile/me            [GET PROFILE]
│  │   Headers: Cookie (from login)
│  │   Response: [200 OK] Current user data
│  │
│  ├─ POST /api/users/auth/logout           [LOGOUT]
│  │   Response: [200 OK] Message
│  │
│  └─ PUT  /api/users/profile/me            [UPDATE PROFILE]
│      Body: {username, email, ...}
│      Response: [200 OK] Updated user
│
└─ ADMIN ENDPOINTS (Admin Auth Required)
   │
   ├─ POST   /api/products                  [CREATE]
   │  Body: FormData {sku, name, price, stock, ...}
   │  Response: [201 Created] Product data
   │
   ├─ PUT    /api/products/:id              [UPDATE]
   │  Body: JSON {name, price, stock, ...}
   │  Response: [200 OK] Updated product
   │
   └─ DELETE /api/products/:id              [DELETE]
      Response: [200 OK] Success message
```

---

## 3️⃣ DATA FLOW: FROM REQUEST TO DATABASE

### Scenario: Create a new product

```
┌──────────────────────┐
│   POSTMAN/THUNDER    │
│   POST /api/products │
│   Body + Image       │
└──────────┬───────────┘
           │
           ▼
    ┌──────────────────┐
    │  EXPRESS SERVER  │
    │  Validate Auth   │
    │  Validate Data   │
    │  Process Image   │
    └──────────┬───────┘
               │
               ▼
        ┌──────────────────┐
        │  MONGOOSE MODEL  │
        │  Product.create()│
        │  Build schema    │
        └──────────┬───────┘
                   │
                   ▼
            ┌──────────────────┐
            │    MONGODB       │
            │  Insert Document │
            │  Get _id         │
            └──────────┬───────┘
                       │
                       ▼
            ┌──────────────────┐
            │  DATABASE FILE   │
            │  /data/db/...    │
            │  (Persistent!)   │
            └──────────┬───────┘
                       │
                       ▼
            ┌──────────────────┐
            │  RESPONSE JSON   │
            │  201 Created     │
            │  {_id, ...}      │
            └──────────┬───────┘
                       │
                       ▼
               ┌────────────────┐
               │ POSTMAN RESULT │
               │ Success ✅      │
               └────────────────┘
```

---

## 4️⃣ AUTHENTICATION FLOW

### Login/Session Flow

```
┌─────────────────────────────────────────┐
│   User submits credentials              │
│   POST /api/users/auth/login            │
│   {email: "user@example.com",           │
│    password: "Test@12345"}              │
└────────────┬────────────────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Validate email exists      │
    │ Compare password hash      │
    │ Match? ✓ Yes              │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Create Session             │
    │ Store user _id in session  │
    │ Set session cookie         │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Response 200 OK            │
    │ + Session Cookie           │
    │ + User data (no password)  │
    └────────┬───────────────────┘
             │
             ▼
    ┌────────────────────────────┐
    │ Subsequent requests        │
    │ Browser sends session      │
    │ cookie automatically       │
    │                            │
    │ GET /api/users/profile/me  │
    │ Middleware checks session  │
    │ ✓ Authenticated            │
    │ Return user data           │
    └────────────────────────────┘
```

### Logout Flow

```
┌─────────────────────┐
│ POST /auth/logout   │
└────────┬────────────┘
         │
         ▼
    ┌────────────────────┐
    │ Clear Session      │
    │ Remove session id  │
    │ Delete cookie      │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Response 200 OK    │
    │ Logout successful  │
    └────────┬───────────┘
             │
             ▼
    ┌────────────────────┐
    │ Next request:      │
    │ GET /profile/me    │
    │ No session cookie  │
    │ ✗ 401 Unauthorized │
    └────────────────────┘
```

---

## 5️⃣ MONGODB DATA STRUCTURE

```
DATABASE: van_phong_pham_shop
│
├─ COLLECTION: products
│  │
│  ├─ Document #1
│  │  {
│  │    _id: ObjectId("507f1f77bcf86cd799439011"),
│  │    sku: "BUT-001",
│  │    name: "Bút bi xanh",
│  │    price: 5000,
│  │    stock: 100,
│  │    category: "Bút",
│  │    description: "...",
│  │    imageUrl: "/img/...",
│  │    isActive: true,
│  │    createdAt: ISODate("2024-05-22T..."),
│  │    updatedAt: ISODate("2024-05-22T...")
│  │  }
│  │
│  └─ Document #2, #3, ... (10+ documents)
│
├─ COLLECTION: users
│  │
│  ├─ Document #1
│  │  {
│  │    _id: ObjectId("507f1f77bcf86cd799439012"),
│  │    username: "testuser1",
│  │    email: "test@example.com",
│  │    password: "$2b$10$...", [HASHED]
│  │    role: "user",  or "admin"
│  │    isActive: true,
│  │    createdAt: ISODate("..."),
│  │    updatedAt: ISODate("...")
│  │  }
│  │
│  └─ Document #2, #3, ...
│
└─ COLLECTION: orders
   │
   ├─ Document #1
   │  {
   │    _id: ObjectId("507f1f77bcf86cd799439013"),
   │    userId: ObjectId("507f1f77bcf86cd799439012"),
   │    items: [
   │      {
   │        productId: ObjectId("507f1f77bcf86cd799439011"),
   │        quantity: 2,
   │        price: 5000
   │      }
   │    ],
   │    totalPrice: 10000,
   │    status: "pending",
   │    createdAt: ISODate("..."),
   │    updatedAt: ISODate("...")
   │  }
   │
   └─ Document #2, #3, ...
```

---

## 6️⃣ TESTING ENVIRONMENT SETUP

```
DEVELOPMENT MACHINE
│
├─ Terminal 1 (MongoDB)
│  │
│  └─ $ mongod
│     ✅ MongoDB Server Running on Port 27017
│
├─ Terminal 2 (Express Server)
│  │
│  └─ $ npm start
│     ✅ Server Running at http://localhost:3000
│
├─ Terminal 3 (MongoDB Shell - Optional)
│  │
│  └─ $ mongosh
│     > use van_phong_pham_shop
│     > db.products.find()
│
└─ Postman/Thunder Client (API Testing)
   │
   └─ GET http://localhost:3000/api/products
      ✅ Response: 200 OK + Products
```

---

## 7️⃣ HTTP STATUS CODES & MEANINGS

```
┌────────────────────────────────────────────────────┐
│ SUCCESS RESPONSES (2xx)                            │
├────────────────────────────────────────────────────┤
│                                                    │
│ 200 OK                                             │
│ └─ Request succeeded                              │
│    Examples: GET, PUT, DELETE, POST (sometimes)   │
│                                                    │
│ 201 Created                                        │
│ └─ Resource created successfully                  │
│    Examples: POST /api/products, POST /register   │
│                                                    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ CLIENT ERROR RESPONSES (4xx)                       │
├────────────────────────────────────────────────────┤
│                                                    │
│ 400 Bad Request                                    │
│ └─ Invalid data/validation failed                 │
│    Examples: Missing fields, wrong format         │
│                                                    │
│ 401 Unauthorized                                   │
│ └─ Authentication required but not provided       │
│    Examples: No login, expired session            │
│                                                    │
│ 403 Forbidden                                      │
│ └─ Not authorized to perform action               │
│    Examples: User trying to delete other user     │
│                                                    │
│ 404 Not Found                                      │
│ └─ Resource does not exist                        │
│    Examples: Invalid product ID, wrong URL        │
│                                                    │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ SERVER ERROR RESPONSES (5xx)                       │
├────────────────────────────────────────────────────┤
│                                                    │
│ 500 Internal Server Error                         │
│ └─ Server error occurred                          │
│    Examples: Unhandled exception, database down   │
│                                                    │
│ 503 Service Unavailable                           │
│ └─ Server temporarily unavailable                 │
│    Examples: Maintenance, MongoDB down            │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 8️⃣ REQUEST/RESPONSE EXAMPLE

### Example 1: Get Products (Success)

```
┌─────────────────────────────────────┐
│         REQUEST (Client)            │
├─────────────────────────────────────┤
│ GET /api/products?page=1&limit=2    │
│ Host: localhost:3000                │
│ Connection: keep-alive              │
│ User-Agent: PostmanRuntime/...      │
└─────────────────────────────────────┘
           │
           │ HTTP 200 OK
           │
           ▼
┌─────────────────────────────────────┐
│     RESPONSE (Server)               │
├─────────────────────────────────────┤
│ {                                   │
│   "success": true,                  │
│   "message": "Lấy danh sách...",   │
│   "data": {                         │
│     "products": [                   │
│       {                             │
│         "_id": "507f...",           │
│         "sku": "BUT-001",           │
│         "name": "Bút bi xanh",      │
│         "price": 5000,              │
│         "stock": 100,               │
│         "category": "Bút"           │
│       },                            │
│       { ... }                       │
│     ],                              │
│     "pagination": {                 │
│       "currentPage": 1,             │
│       "totalPages": 5,              │
│       "totalItems": 10              │
│     }                               │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

### Example 2: Register (Error)

```
┌─────────────────────────────────────┐
│         REQUEST (Client)            │
├─────────────────────────────────────┤
│ POST /api/users/auth/register       │
│ Content-Type: application/json      │
│                                     │
│ {                                   │
│   "username": "user",               │
│   "email": "duplicate@example.com", │
│   "password": "Test@12345",         │
│   "confirmPassword": "Test@12345"   │
│ }                                   │
└─────────────────────────────────────┘
           │
           │ HTTP 400 Bad Request
           │ (Email already exists)
           │
           ▼
┌─────────────────────────────────────┐
│     RESPONSE (Server - Error)       │
├─────────────────────────────────────┤
│ {                                   │
│   "success": false,                 │
│   "message": "Email này đã được     │
│                đăng ký"             │
│ }                                   │
└─────────────────────────────────────┘
```

---

## 9️⃣ COMMON TESTING PATTERNS

### Pattern 1: Full CRUD Lifecycle

```
Step 1: CREATE
─────────────
POST /api/products
Response: 201 Created + {_id: "ABC123", ...}
MongoDB: ✓ Product added

      ↓

Step 2: READ
────────────
GET /api/products/ABC123
Response: 200 OK + Product data
MongoDB: ✓ Product found

      ↓

Step 3: UPDATE
──────────────
PUT /api/products/ABC123
Body: {price: 6000}
Response: 200 OK + Updated product
MongoDB: ✓ Product updated (price=6000)

      ↓

Step 4: DELETE
──────────────
DELETE /api/products/ABC123
Response: 200 OK
MongoDB: ✓ Product removed/deactivated

      ↓

Step 5: READ AGAIN (Verification)
──────────────────────────────────
GET /api/products/ABC123
Response: 404 Not Found (or not in list)
MongoDB: ✓ Product not found
```

### Pattern 2: Authentication Lifecycle

```
Step 1: REGISTER
────────────────
POST /api/users/auth/register
Response: 201 Created + User data
MongoDB: ✓ User created (password hashed)

      ↓

Step 2: LOGIN
─────────────
POST /api/users/auth/login
Response: 200 OK + Session cookie
Browser: ✓ Cookie stored

      ↓

Step 3: USE PROTECTED ENDPOINT
───────────────────────────────
GET /api/users/profile/me
Headers: Cookie (auto-sent)
Response: 200 OK + My user data
Middleware: ✓ Auth check passed

      ↓

Step 4: LOGOUT
──────────────
POST /api/users/auth/logout
Response: 200 OK
Cookie: ✓ Cleared

      ↓

Step 5: PROTECTED ENDPOINT AGAIN
────────────────────────────────
GET /api/users/profile/me
Headers: No cookie
Response: 401 Unauthorized
Middleware: ✓ Auth check failed
```

---

## 🔟 QUICK REFERENCE TABLE

| Component | What to Test | Expected | Check |
|-----------|-------------|----------|-------|
| **Server** | npm start | Port 3000 running | ✓ |
| **MongoDB** | mongosh + show databases | van_phong_pham_shop exists | ✓ |
| **GET /api/products** | No params | 200 OK + 10+ products | ✓ |
| **GET /api/products?search=bút** | Search param | 200 OK + filtered results | ✓ |
| **POST /register** | New email | 201 Created + user in DB | ✓ |
| **POST /login** | Correct credentials | 200 OK + session cookie | ✓ |
| **POST /login** | Wrong credentials | 401 Unauthorized | ✓ |
| **POST /api/products** | Admin auth | 201 Created + product in DB | ✓ |
| **PUT /api/products/:id** | Update data | 200 OK + updated in DB | ✓ |
| **DELETE /api/products/:id** | Delete | 200 OK + removed from DB | ✓ |

---

**Tài liệu này cập nhật lần cuối:** 26/05/2026
