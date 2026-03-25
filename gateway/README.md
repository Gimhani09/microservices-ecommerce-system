# 🌐 API Gateway

## 📝 Overview

The **API Gateway** is the single entry point for all microservices in the e-commerce system. Every client request goes through the gateway, which then routes to the appropriate service.

## 🏗️ Architecture

```
Clients (Postman, Web, Mobile)
          ↓
    API Gateway (Port 5000)
          ↓
   ┌──┬──┬──┬────┐
   ↓  ↓  ↓  ↓    ↓
Product Order Inventory Payment
(5001) (5002) (5003)   (5004)
```

## 🚀 Installation & Setup

### 1️⃣ Install Dependencies

```bash
cd gateway
npm install
```

### 2️⃣ Start the Gateway

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║          API GATEWAY STARTED ✓                        ║
╚═══════════════════════════════════════════════════════╝

🌐 Gateway URL:      http://localhost:5000
📚 Documentation:    http://localhost:5000/docs
```

## 📚 Gateway Endpoints

### 1. Root Endpoint
```
GET http://localhost:5000/
```

Returns gateway info and quick start guide.

### 2. API Documentation
```
GET http://localhost:5000/docs
```

Full API documentation for all available routes.

### 3. Gateway Health Check
```
GET http://localhost:5000/health
```

Returns gateway status.

### 4. List All Services
```
GET http://localhost:5000/services
```

Shows all registered microservices.

### 5. Request Statistics
```
GET http://localhost:5000/stats
```

View request statistics by service.

## 🔗 Service Routes

### Product Service
Gateway Route: `/api/products`
Forwards to: `http://localhost:5001`

```
GET    /api/products         → Get all products
GET    /api/products/:id     → Get specific product
POST   /api/products         → Create product
DELETE /api/products/:id     → Delete product
```

## 🧪 Testing the Gateway

### Test 1: Get Products via Gateway

```bash
curl http://localhost:5000/api/products
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Retrieved 3 products",
  "data": [
    {"id": 1, "name": "Laptop", "price": 999.99, "stock": 10},
    ...
  ]
}
```

### Test 2: Create Product via Gateway

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"stock":50}'
```

### Test 3: Check Gateway Health

```bash
curl http://localhost:5000/health
```

### Test 4: View Documentation

```bash
curl http://localhost:5000/docs
```

### Test 5: View Services

```bash
curl http://localhost:5000/services
```

## 🛠️ How the Gateway Works

### Request Flow

```
1. Client sends request to gateway:
   GET http://localhost:5000/api/products

2. Gateway receives the request

3. Gateway analyzes the path:
   "/api/products" → Route to Product Service

4. Gateway rewrites the path:
   /api/products → /products (removes /api prefix)

5. Gateway forwards to Product Service:
   GET http://localhost:5001/products

6. Product Service returns response:
   { success: true, data: [...] }

7. Gateway forwards response to client:
   Client receives the same response
```

## 📊 Key Features

✅ **Single Entry Point** - Clients only need gateway URL  
✅ **Automatic Routing** - Routes requests based on path  
✅ **Health Monitoring** - Check service status  
✅ **Statistics** - Track requests per service  
✅ **Error Handling** - Handle unavailable services  
✅ **CORS Enabled** - Cross-origin requests supported  
✅ **Request Logging** - Log all requests  
✅ **Path Rewriting** - Automatic path manipulation  

## ⚙️ Configuration

Edit `.env` to change service URLs:

```
PORT=5000
PRODUCT_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5002
INVENTORY_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
```

## 🎯 Integration with Other Services

When other services are implemented:

1. **Order Service** - Automatically route `/api/orders/*` to port 5002
2. **Inventory Service** - Automatically route `/api/inventory/*` to port 5003
3. **Payment Service** - Automatically route `/api/payment/*` to port 5004

No changes needed to clients!

## 💡 Benefits

- **Simplicity**: Clients don't need to know internal service ports
- **Flexibility**: Move services without updating clients
- **Scalability**: Easy to add new services
- **Monitoring**: Centralized request logging
- **Maintenance**: Update service URLs in one place
- **Reliability**: Handle service failures gracefully

## 📋 Quick Reference

| Endpoint | Purpose |
|----------|---------|
| `/` | Gateway info |
| `/docs` | API documentation |
| `/health` | Gateway status |
| `/services` | List services |
| `/stats` | Request statistics |
| `/api/products` | Product Service |
| `/api/orders` | Order Service |
| `/api/inventory` | Inventory Service |
| `/api/payment` | Payment Service |

---

**Status:** ✅ **Complete & Running**
