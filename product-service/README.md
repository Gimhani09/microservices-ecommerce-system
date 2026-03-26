# 📦 Product Service

## 📝 Overview

The **Product Service** is a microservice responsible for managing all product-related operations in the e-commerce system.

### What it does:
- ✅ Create new products
- ✅ Retrieve all products
- ✅ Retrieve a specific product by ID
- ✅ Delete products
- ✅ Validate product data
- ✅ Provide Swagger API documentation

---

## 🏗️ Architecture

```
Product Service (Port 5001)
│
├─── In-memory Array (products)
│    └── { id, name, price, stock }
│
├─── Express.js (HTTP Server)
│
└─── Swagger UI (API Documentation)
```

---

## 🚀 Installation & Setup

### 1️⃣ Install Dependencies

```bash
cd product-service
npm install
```

### 2️⃣ Configure Environment

The `.env` file is already set:
```
PORT=5001
NODE_ENV=development
```

### 3️⃣ Start the Service

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║          PRODUCT SERVICE STARTED ✓                    ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:5001
📚 Swagger Docs:     http://localhost:5001/api-docs
❤️  Health Check:    http://localhost:5001/health
```

---

## 📚 API Endpoints

### 1. Create a Product
**Endpoint:** `POST /products`

**Request Example:**
```json
{
  "name": "Wireless Headphones",
  "price": 149.99,
  "stock": 30
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 4,
    "name": "Wireless Headphones",
    "price": 149.99,
    "stock": 30
  }
}
```

---

### 2. Get All Products
**Endpoint:** `GET /products`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 2 products",
  "data": [
    { "id": 1, "name": "Laptop", "price": 999.99, "stock": 10 },
    { "id": 2, "name": "Mouse", "price": 29.99, "stock": 100 },
    { "id": 3, "name": "Keyboard", "price": 79.99, "stock": 50 },
    { "id": 4, "name": "Wireless Headphones", "price": 149.99, "stock": 30 }
  ]
}
```

---

### 3. Get a Specific Product
**Endpoint:** `GET /products/:id`

**Example:** `GET /products/1`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "stock": 10
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Product with ID 999 not found"
}
```

---

### 4. Delete a Product
**Endpoint:** `DELETE /products/:id`

**Example:** `DELETE /products/2`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": 2,
    "name": "Mouse",
    "price": 29.99,
    "stock": 100
  }
}
```

---

### 5. Health Check
**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "Product Service is running",
  "port": 5001,
  "timestamp": "2026-03-25T10:30:00.000Z"
}
```

---

## 🧪 Testing Instructions

### Method 1: Using Postman (Recommended)

#### Step 1: Create a Product
1. Open **Postman**
2. Click **New Request**
3. Set method to **POST**
4. URL: `http://localhost:5001/products`
5. Go to **Body** tab → Select **raw** → **JSON**
6. Paste:
```json
{
  "name": "USB-C Cable",
  "price": 15.99,
  "stock": 200
}
```
7. Click **Send**
8. **Expected Result:** Status 201, product created ✅

---

#### Step 2: Get All Products
1. New Request
2. Method: **GET**
3. URL: `http://localhost:5001/products`
4. Click **Send**
5. **Expected Result:** Array of all products ✅

---

#### Step 3: Get Specific Product
1. New Request
2. Method: **GET**
3. URL: `http://localhost:5001/products/1`
4. Click **Send**
5. **Expected Result:** Product with ID 1 ✅

---

#### Step 4: Delete a Product
1. New Request
2. Method: **DELETE**
3. URL: `http://localhost:5001/products/3`
4. Click **Send**
5. **Expected Result:** Status 200, product deleted ✅

---

#### Step 5: Test Error Handling
1. **Test Invalid Data:**
   - Try: `POST /products` with missing "name"
   - Expected: Status 400, validation error ✅

2. **Test Non-existent Product:**
   - Try: `GET /products/999`
   - Expected: Status 404, product not found ✅

---

### Method 2: Using cURL (Command Line)

```bash
# Create a product
curl -X POST http://localhost:5001/products \
  -H "Content-Type: application/json" \
  -d '{"name":"USB Cable","price":15.99,"stock":200}'

# Get all products
curl http://localhost:5001/products

# Get specific product
curl http://localhost:5001/products/1

# Delete a product
curl -X DELETE http://localhost:5001/products/2

# Health check
curl http://localhost:5001/health
```

---

### Method 3: Using Swagger UI

1. Open browser: `http://localhost:5001/api-docs`
2. You'll see interactive API documentation
3. Click on each endpoint
4. Click **"Try it out"**
5. Fill in the data
6. Click **"Execute"**
7. See the response immediately ✅

---

## 🛡️ Validation Rules

The Product Service validates all input:

| Field | Rule | Error |
|-------|------|-------|
| name | Required, non-empty string | "Product name is required and must be a string" |
| price | Required, positive number | "Product price must be a positive number" |
| stock | Required, non-negative integer | "Product stock must be a non-negative integer" |

### Example Validation Tests:

❌ **Missing name:**
```json
{ "price": 100, "stock": 10 }
→ Error: Product name is required
```

❌ **Negative price:**
```json
{ "name": "Test", "price": -50, "stock": 10 }
→ Error: Product price must be a positive number
```

❌ **Invalid stock:**
```json
{ "name": "Test", "price": 100, "stock": 5.5 }
→ Error: Product stock must be a non-negative integer
```

---

## 💾 In-Memory Database

**Current Products:**
```javascript
[
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Mouse', price: 29.99, stock: 100 },
  { id: 3, name: 'Keyboard', price: 79.99, stock: 50 }
]
```

**Note:** Data is stored in memory. When the service restarts, all data is reset to default.

---

## 📋 Code Explanation

### Key Components:

1. **Express Server Setup**
   - CORS enabled for cross-service communication
   - JSON middleware for parsing requests

2. **Swagger Documentation**
   - Interactive API docs at `/api-docs`
   - Full endpoint specifications
   - Request/response examples

3. **Validation Function**
   - Checks all required fields
   - Validates data types
   - Returns helpful error messages

4. **Error Handling**
   - Try-catch in all endpoints
   - Proper HTTP status codes
   - Consistent JSON responses

5. **Routes**
   - POST /products (create)
   - GET /products (list all)
   - GET /products/:id (get one)
   - DELETE /products/:id (delete)

---

## ✅ Quick Verification Checklist

After implementation, verify:

- [x] Service starts without errors
- [x] Swagger UI works at `http://localhost:5001/api-docs`
- [x] Can create a product via POST
- [x] Can retrieve products via GET
- [x] Can delete a product via DELETE
- [x] Validation works (try invalid data)
- [x] Error handling works (try non-existent ID)
- [x] Health check endpoint works

---

## 📖 What You Learned

1. **Express.js** - Build HTTP servers
2. **CRUD Operations** - Create, Read, Update, Delete
3. **Validation** - Validate user input
4. **Swagger Documentation** - Document APIs professionally
5. **Error Handling** - Handle errors gracefully
6. **REST Principles** - Build RESTful services

---

## 🔗 Integration with Other Services

This service will later be integrated with:
- **Order Service** - Calls this service to get product details
- **Inventory Service** - Works with product stock levels
- **API Gateway** - Accessible via `/api/products`

---

## 🎓 Questions & Help

- Check the `index.js` file for detailed code comments
- See the API examples above for testing
- Use Swagger UI for interactive testing

---

**Author:** MTIT E-Commerce Team  
**Created:** March 2026  
**Status:** ✅ Complete & Ready for Integration
