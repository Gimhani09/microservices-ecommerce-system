# E-Commerce Microservices System

A complete microservices-based e-commerce system built with Node.js, Express, and Axios.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Step-by-Step Installation](#step-by-step-installation)
- [Running the Services](#running-the-services)
- [Testing the System](#testing-the-system)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         Client Application              │
└──────────────┬──────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│      API Gateway (Port 5000)             │
│  • Request Routing                       │
│  • Error Handling                        │
│  • Logging                               │
└──┬──────┬──────┬──────┬─────────────────┘
   │      │      │      │
   ↓      ↓      ↓      ↓
┌─────┐ ┌────┐ ┌────┐ ┌────────┐
│Prod │ │Ord │ │Inv │ │Payment │
│5001 │ │5002│ │5003│ │5004    │
└─────┘ └────┘ └────┘ └────────┘
```

### Services

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **API Gateway** | 5000 | ✅ Ready | Single entry point, routes to all services |
| **Product Service** | 5001 | ✅ Ready | Manages products (CRUD operations) |
| **Order Service** | 5002 | 🔄 Planned | Manages orders |
| **Inventory Service** | 5003 | 🔄 Planned | Manages inventory |
| **Payment Service** | 5004 | ✅ Ready | Processes payments |

---

## ✅ Prerequisites

Before running this project, ensure you have:

### Required Software

1. **Node.js** (v14 or higher)
   ```bash
   node --version  # Should be v14.0.0 or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version  # Should be 6.0.0 or higher
   ```

### Install Node.js

- **Windows/Mac**: Download from [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Install Product Service dependencies
cd product-service
npm install
cd ..

# Install Payment Service dependencies
cd payment-service
npm install
cd ..

# Install API Gateway dependencies
cd gateway
npm install
cd ..
```

### Step 2: Start the Services (3 Terminals)

**Terminal 1 - Product Service:**
```bash
cd product-service
npm run dev
```

**Terminal 2 - Payment Service:**
```bash
cd payment-service
npm run dev
```

**Terminal 3 - API Gateway:**
```bash
cd gateway
npm run dev
```

### Step 3: Test the System

Open in browser: http://localhost:5000/api-docs

Or test with cURL:
```bash
curl http://localhost:5000/health
```

---

## 📦 Step-by-Step Installation

### Step 1: Navigate to Project Root

```bash
cd d:/Projects/MTIT-2/microservices-ecommerce-system
```

### Step 2: Install Dependencies for Each Service

#### Install Product Service Dependencies
```bash
cd product-service
npm install
cd ..
```

**Expected output:**
```
added 57 packages, and audited 58 packages in 3s
```

#### Install Payment Service Dependencies
```bash
cd payment-service
npm install
cd ..
```

#### Install API Gateway Dependencies
```bash
cd gateway
npm install
cd ..
```

### Step 3: Verify Installation

Check that `node_modules` folder exists in each service directory:
```bash
ls product-service/node_modules
ls payment-service/node_modules
ls gateway/node_modules
```

---

## ▶️ Running the Services

You need to run each service in a **separate terminal window**.

### Terminal 1: Start Product Service

```bash
cd product-service
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║          PRODUCT SERVICE STARTED ✓                    ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:5001
📚 Swagger Docs:     http://localhost:5001/api-docs
❤️  Health Check:    http://localhost:5001/health
```

✅ **Service is ready when you see this banner!**

### Terminal 2: Start Payment Service

```bash
cd payment-service
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║          PAYMENT SERVICE STARTED ✓                    ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:5004
📚 Swagger Docs:     http://localhost:5004/api-docs
❤️  Health Check:    http://localhost:5004/health
```

✅ **Service is ready when you see this banner!**

### Terminal 3: Start API Gateway

```bash
cd gateway
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════╗
║          API GATEWAY STARTED ✓                        ║
╚═══════════════════════════════════════════════════════╝

🌐 Gateway URL:      http://localhost:5000
📚 Swagger Docs:     http://localhost:5000/api-docs
❤️  Health Check:    http://localhost:5000/health

📋 Available Routes:
   /api/products   → Product Service   (http://localhost:5001)
   /api/orders     → Order Service     (http://localhost:5002)
   /api/inventory  → Inventory Service (http://localhost:5003)
   /api/payments   → Payment Service   (http://localhost:5004)
```

✅ **Gateway is ready when you see this banner!**

---

## 🧪 Testing the System

### Method 1: Browser Testing (Easiest)

#### 1. Test Health Endpoints

Open these URLs in your browser:
- **Gateway**: http://localhost:5000/health
- **Product Service**: http://localhost:5001/health
- **Payment Service**: http://localhost:5004/health

#### 2. Access Swagger Documentation

- **Gateway API Docs**: http://localhost:5000/api-docs
- **Product Service API Docs**: http://localhost:5001/api-docs
- **Payment Service API Docs**: http://localhost:5004/api-docs

You can **test all endpoints** directly from Swagger UI!

### Method 2: cURL Testing

#### Test 1: Gateway Health Check ✓
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "API Gateway is running",
  "port": 5000,
  "timestamp": "2026-03-26T..."
}
```

#### Test 2: Create a Product via Gateway ✓
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Laptop\",\"price\":999.99,\"stock\":10}"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 4,
    "name": "Laptop",
    "price": 999.99,
    "stock": 10
  }
}
```

#### Test 3: Get All Products via Gateway ✓
```bash
curl http://localhost:5000/api/products
```

#### Test 4: Process a Payment via Gateway ✓
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":101,\"amount\":299.99}"
```

**Expected Response (80% success rate):**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "id": 1,
    "orderId": 101,
    "amount": 299.99,
    "status": "SUCCESS"
  }
}
```

#### Test 5: Get All Payments ✓
```bash
curl http://localhost:5000/api/payments
```

### Method 3: Postman Testing

1. **Import** the Postman collection:
   ```
   payment-service/Payment-Service.postman_collection.json
   ```

2. **Read** the guide:
   ```
   payment-service/POSTMAN-GUIDE.md
   ```

3. **Run** 25+ pre-configured test requests!

---

## 📚 API Documentation

### Access Swagger UI (Interactive Testing)

All services include interactive API documentation where you can **test endpoints directly**:

- **API Gateway**: http://localhost:5000/api-docs
- **Product Service**: http://localhost:5001/api-docs
- **Payment Service**: http://localhost:5004/api-docs

### Available Endpoints

#### Via API Gateway (Recommended ⭐)

**Products:**
```
GET    http://localhost:5000/api/products      # Get all products
POST   http://localhost:5000/api/products      # Create product
GET    http://localhost:5000/api/products/:id  # Get product by ID
DELETE http://localhost:5000/api/products/:id  # Delete product
```

**Payments:**
```
GET    http://localhost:5000/api/payments      # Get all payments
POST   http://localhost:5000/api/payments      # Process payment
GET    http://localhost:5000/api/payments/:id  # Get payment by ID
```

**System:**
```
GET    http://localhost:5000/health            # Gateway health check
```

---

## 🐛 Troubleshooting

### Problem 1: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution (Windows):**
```bash
# Find process using the port
netstat -ano | findstr :5001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Solution (Linux/Mac):**
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9
```

### Problem 2: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Navigate to the service directory
cd product-service  # or payment-service or gateway

# Reinstall dependencies
npm install
```

### Problem 3: Gateway Returns 503 Service Unavailable

**Error:**
```json
{
  "success": false,
  "error": "Product Service unavailable"
}
```

**Solution:**
- Ensure the target service is running
- Check the service is running on the correct port
- Verify services are accessible at their URLs

### Problem 4: nodemon Command Not Found

**Error:**
```
'nodemon' is not recognized as an internal or external command
```

**Solution:**
```bash
# Use npm start instead (no auto-reload)
npm start

# OR install nodemon globally
npm install -g nodemon
```

---

## 🎯 Complete Testing Example

Here's a complete workflow to test everything:

```bash
# 1. Check all services are running
curl http://localhost:5000/health
curl http://localhost:5001/health
curl http://localhost:5004/health

# 2. Create a product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Mouse","price":49.99,"stock":25}'

# 3. Get all products
curl http://localhost:5000/api/products

# 4. Get specific product (ID from step 2)
curl http://localhost:5000/api/products/4

# 5. Process a payment
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId":101,"amount":49.99}'

# 6. Get all payments
curl http://localhost:5000/api/payments

# 7. Get specific payment (ID from step 5)
curl http://localhost:5000/api/payments/1
```

---

## 📁 Project Structure

```
microservices-ecommerce-system/
├── gateway/                              # API Gateway (Port 5000)
│   ├── routes/
│   │   ├── productRoutes.js             # Product service routing
│   │   ├── orderRoutes.js               # Order service routing
│   │   ├── inventoryRoutes.js           # Inventory service routing
│   │   └── paymentRoutes.js             # Payment service routing
│   ├── index.js                         # Gateway main file
│   ├── package.json
│   ├── .env                             # Gateway configuration
│   └── README.md
│
├── product-service/                      # Product Service (Port 5001)
│   ├── index.js                         # Product service main file
│   ├── package.json
│   ├── .env                             # Product service configuration
│   └── README.md
│
├── payment-service/                      # Payment Service (Port 5004)
│   ├── index.js                         # Payment service main file
│   ├── package.json
│   ├── .env                             # Payment service configuration
│   ├── README.md
│   ├── POSTMAN-GUIDE.md                 # Postman testing guide
│   └── Payment-Service.postman_collection.json
│
└── README.md                            # This file
```

---

## 📊 Service Startup Checklist

Before testing, verify all services are running:

- [ ] **Product Service** running on port 5001
- [ ] **Payment Service** running on port 5004
- [ ] **API Gateway** running on port 5000
- [ ] All services show startup banner
- [ ] No error messages in terminals
- [ ] Health checks return 200 OK

**Quick Check Command:**
```bash
curl http://localhost:5000/health && \
curl http://localhost:5001/health && \
curl http://localhost:5004/health
```

---

## 🎓 Technology Stack

- **Runtime**: Node.js v14+
- **Framework**: Express.js
- **HTTP Client**: Axios
- **API Documentation**: Swagger/OpenAPI
- **Environment**: dotenv
- **Development**: nodemon
- **Architecture**: Microservices

---

## 📈 What's Implemented

### ✅ Completed Services

1. **Product Service** (Port 5001)
   - Complete CRUD operations
   - Input validation
   - Swagger documentation
   - Health check endpoint

2. **Payment Service** (Port 5004)
   - Payment processing with simulation (80% success)
   - Complete validation
   - Swagger documentation
   - Health check endpoint

3. **API Gateway** (Port 5000)
   - Routing to all services
   - Request/response forwarding
   - Error handling (503, 500, 404)
   - Request logging
   - Swagger documentation
   - Health check endpoint

### 🔄 Planned Services

- Order Service (Port 5002)
- Inventory Service (Port 5003)

---

## 🚀 Next Steps

After running the project:

1. **Explore Swagger UI** - Test all endpoints interactively
2. **Import Postman Collection** - Run comprehensive tests
3. **Review Service Logs** - Understand request flow
4. **Modify Code** - Services auto-reload with nodemon
5. **Add New Features** - Follow the existing patterns

---

## 📞 Need Help?

1. Check the [Troubleshooting](#troubleshooting) section
2. Review service-specific README files:
   - `gateway/README.md`
   - `product-service/README.md`
   - `payment-service/README.md`
3. Check Swagger documentation at `/api-docs`
4. Review terminal logs for error messages

---

## 📝 Assignment Information

**Project**: MTIT Microservices E-Commerce System
**Architecture**: Microservices Pattern
**Team**: 4 Members

### Git Branch Structure

| Member   | Branch                      | Service           |
|----------|----------------------------|-------------------|
| Member 1 | `feature/product-service`  | Product Service   |
| Member 2 | `feature/order-service`    | Order Service     |
| Member 3 | `feature/inventory-service`| Inventory Service |
| Member 4 | `feature/gateway-payment`  | Gateway + Payment |

---

**Happy Coding! 🚀**
