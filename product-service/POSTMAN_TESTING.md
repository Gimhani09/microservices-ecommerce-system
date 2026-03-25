# 🧪 PRODUCT SERVICE - POSTMAN TESTING GUIDE

## 📌 Quick Setup

### 1. Open Postman
- Download from: https://www.postman.com/downloads/
- Create a new Workspace or use existing one

### 2. Create Collection
- Click "New" → "Collection" → Name: "Product Service"
- You'll add requests here

---

## 📝 Test Requests

### REQUEST 1: Health Check
**Purpose:** Verify service is running

- **Method:** GET
- **URL:** `http://localhost:5001/health`
- **Headers:** None needed
- **Body:** None

**Expected Response (Status 200):**
```json
{
  "status": "Product Service is running",
  "port": "5001",
  "timestamp": "2026-03-25T15:42:36.054Z"
}
```

---

### REQUEST 2: Create Product
**Purpose:** Add a new product to database

- **Method:** POST
- **URL:** `http://localhost:5001/products`
- **Headers:** 
  - Key: `Content-Type`
  - Value: `application/json`
- **Body:** (Select "raw" → "JSON")
```json
{
  "name": "Wireless Charger",
  "price": 49.99,
  "stock": 75
}
```

**Expected Response (Status 201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 5,
    "name": "Wireless Charger",
    "price": 49.99,
    "stock": 75
  }
}
```

---

### REQUEST 3: Get All Products
**Purpose:** List all products in database

- **Method:** GET
- **URL:** `http://localhost:5001/products`
- **Headers:** None needed
- **Body:** None

**Expected Response (Status 200):**
```json
{
  "success": true,
  "message": "Retrieved 4 products",
  "data": [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 10},
    {"id": 2, "name": "Mouse", "price": 29.99, "stock": 100},
    {"id": 4, "name": "USB-C Cable", "price": 15.99, "stock": 200},
    {"id": 5, "name": "Wireless Charger", "price": 49.99, "stock": 75}
  ]
}
```

---

### REQUEST 4: Get Single Product
**Purpose:** Retrieve a specific product by ID

- **Method:** GET
- **URL:** `http://localhost:5001/products/1`
  - Replace `1` with the product ID you want
- **Headers:** None needed
- **Body:** None

**Expected Response (Status 200):**
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

---

### REQUEST 5: Delete Product
**Purpose:** Remove a product from database

- **Method:** DELETE
- **URL:** `http://localhost:5001/products/4`
  - Replace `4` with the product ID you want to delete
- **Headers:** None needed
- **Body:** None

**Expected Response (Status 200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": 4,
    "name": "USB-C Cable",
    "price": 15.99,
    "stock": 200
  }
}
```

---

## ❌ Error Testing

### TEST 1: Non-existent Product
**Purpose:** Test 404 error handling

- **Method:** GET
- **URL:** `http://localhost:5001/products/999`

**Expected Response (Status 404):**
```json
{
  "success": false,
  "error": "Product with ID 999 not found"
}
```

---

### TEST 2: Missing Required Field
**Purpose:** Test validation error

- **Method:** POST
- **URL:** `http://localhost:5001/products`
- **Body:**
```json
{
  "name": "Test Product"
}
```

**Expected Response (Status 400):**
```json
{
  "success": false,
  "error": "Product price is required"
}
```

---

### TEST 3: Negative Price
**Purpose:** Test validation error

- **Method:** POST
- **URL:** `http://localhost:5001/products`
- **Body:**
```json
{
  "name": "Invalid Product",
  "price": -100,
  "stock": 10
}
```

**Expected Response (Status 400):**
```json
{
  "success": false,
  "error": "Product price must be a positive number"
}
```

---

### TEST 4: Non-integer Stock
**Purpose:** Test validation error

- **Method:** POST
- **URL:** `http://localhost:5001/products`
- **Body:**
```json
{
  "name": "Invalid Product",
  "price": 99.99,
  "stock": 10.5
}
```

**Expected Response (Status 400):**
```json
{
  "success": false,
  "error": "Product stock must be a non-negative integer"
}
```

---

## 📊 Complete Test Flow

Here's a recommended order to test everything:

### Step 1: Verify Service Running
```
REQUEST → Health Check
EXPECT  → Status 200
```

### Step 2: Create Products
```
REQUEST → Create Product (Wireless Charger)
EXPECT  → Status 201, ID assigned
```

### Step 3: Retrieve All
```
REQUEST → Get All Products  
EXPECT  → Status 200, List of all products
```

### Step 4: Retrieve One
```
REQUEST → Get Product by ID (1)
EXPECT  → Status 200, Single product
```

### Step 5: Test Error - Not Found
```
REQUEST → Get Product by ID (999)
EXPECT  → Status 404, Error message
```

### Step 6: Test Validation
```
REQUEST → Create Product with negative price
EXPECT  → Status 400, Validation error
```

### Step 7: Delete Product
```
REQUEST → Delete Product (4)
EXPECT  → Status 200, Deleted product data
```

### Step 8: Confirm Deletion
```
REQUEST → Get All Products
EXPECT  → Status 200, Deleted product not in list
```

---

## 💾 Save Test Collection

To keep track of all requests:

1. In Postman, click **"Save"** button (top right)
2. Name: `Product Service Tests`
3. All requests are saved for later use

---

## 🔗 Swagger UI Alternative

You can also test using Swagger UI:

1. Open browser: `http://localhost:5001/api-docs`
2. Click on each endpoint
3. Click **"Try it out"**
4. Fill in parameters/body
5. Click **"Execute"**
6. See response immediately

---

## 📋 Validation Rules Reference

When creating/updating products, remember:

| Field | Type | Rule | Example |
|-------|------|------|---------|
| name | string | Required, non-empty | "Laptop" |
| price | number | Required, ≥ 0 | 999.99 |
| stock | integer | Required, ≥ 0 | 50 |

---

## 🎯 Success Indicators

After running all tests, you should see:

✅ All GET requests return 200  
✅ POST request returns 201  
✅ DELETE request returns 200  
✅ 404 errors for non-existent IDs  
✅ 400 errors for invalid data  
✅ Consistent JSON response format  
✅ Proper error messages  

---

## 🆘 Troubleshooting

### Service Not Running?
```bash
cd product-service
npm start
```

### Port Already in Use?
Check if another service is on 5001:
```bash
netstat -ano | findstr :5001
```

### Connection Refused?
Make sure you're using `http://localhost:5001` (not https)

### Postman Not Sending?
- Check method (GET, POST, DELETE)
- Check URL spelling
- Check Content-Type header for POST

---

## 📸 Screenshots for Presentation

Recommended screenshots to capture:

1. **Swagger UI** - http://localhost:5001/api-docs
2. **Health Check Response** - Status 200
3. **Create Product** - Status 201
4. **Product List** - All products displayed
5. **Specific Product** - Single product retrieved
6. **Error Response** - 404 error
7. **Validation Error** - 400 error

---

**Happy Testing! ✅**

For more details, check:
- README.md (Complete documentation)
- TESTING_REPORT.md (Detailed test results)
- index.js (Source code with comments)
