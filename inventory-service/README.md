# 📦 Inventory Service

## 📝 Overview

The **Inventory Service** is a microservice responsible for managing stock levels and inventory records in the e-commerce system. It tracks how many units of each product are available, where they are stored, and exposes endpoints that other services (such as the Order Service) can call to validate and adjust stock in real time.

### What it does:
- ✅ Add new inventory records for products
- ✅ Retrieve all inventory records
- ✅ Retrieve a specific inventory record by ID
- ✅ Fully update an inventory record
- ✅ Adjust stock quantity (increase or decrease) — used when orders are placed
- ✅ Delete an inventory record
- ✅ Check stock availability for a product (used for order validation)
- ✅ Swagger API documentation

---

## 🏗️ Architecture

```
Inventory Service (Port 5003)
│
├─── In-memory Array (inventory)
│    └── { id, productId, productName, quantity, warehouseLocation, lastUpdated }
│
├─── Express.js (HTTP Server)
│
└─── Swagger UI (API Documentation at /api-docs)
```

This service operates independently and can be accessed:
- **Directly:** `http://localhost:5003`
- **Via API Gateway:** `http://localhost:5000/inventory`

---

## 🚀 Installation & Setup

### 1️⃣ Install Dependencies

```bash
cd inventory-service
npm install
```

### 2️⃣ Configure Environment

The `.env` file is already set:
```
PORT=5003
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
║          INVENTORY SERVICE STARTED ✓                  ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:5003
📚 Swagger Docs:     http://localhost:5003/api-docs
❤️  Health Check:    http://localhost:5003/health
```

---

## 📚 API Endpoints

### 1. Add Inventory Record
**Endpoint:** `POST /inventory`

**Request Body:**
```json
{
  "productId": 4,
  "productName": "Wireless Headphones",
  "quantity": 35,
  "warehouseLocation": "C2"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Inventory record created successfully",
  "data": {
    "id": 4,
    "productId": 4,
    "productName": "Wireless Headphones",
    "quantity": 35,
    "warehouseLocation": "C2",
    "lastUpdated": "2026-03-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Inventory Records
**Endpoint:** `GET /inventory`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Retrieved 3 inventory records",
  "count": 3,
  "data": [
    { "id": 1, "productId": 1, "productName": "Laptop", "quantity": 10, "warehouseLocation": "A1", "lastUpdated": "..." },
    { "id": 2, "productId": 2, "productName": "Mouse", "quantity": 100, "warehouseLocation": "B3", "lastUpdated": "..." },
    { "id": 3, "productId": 3, "productName": "Keyboard", "quantity": 50, "warehouseLocation": "B4", "lastUpdated": "..." }
  ]
}
```

---

### 3. Get Inventory Record by ID
**Endpoint:** `GET /inventory/:id`

**Example:** `GET /inventory/1`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Laptop",
    "quantity": 10,
    "warehouseLocation": "A1",
    "lastUpdated": "2026-03-26T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Inventory record with ID 99 not found"
}
```

---

### 4. Update Inventory Record (Full Update)
**Endpoint:** `PUT /inventory/:id`

**Example:** `PUT /inventory/1`

**Request Body:**
```json
{
  "productId": 1,
  "productName": "Laptop Pro",
  "quantity": 20,
  "warehouseLocation": "A2"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inventory record updated successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Laptop Pro",
    "quantity": 20,
    "warehouseLocation": "A2",
    "lastUpdated": "2026-03-26T11:00:00.000Z"
  }
}
```

---

### 5. Adjust Stock Quantity
**Endpoint:** `PATCH /inventory/:id/stock`

Use a **positive number** to add stock, and a **negative number** to reduce stock (e.g. after an order is placed).

**Example:** `PATCH /inventory/1/stock`

**Request Body (reduce by 3):**
```json
{
  "adjustment": -3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Stock decreased by 3 units",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Laptop",
    "quantity": 7,
    "warehouseLocation": "A1",
    "lastUpdated": "2026-03-26T12:00:00.000Z"
  }
}
```

**Error Response (400 — insufficient stock):**
```json
{
  "success": false,
  "error": "Insufficient stock. Current: 2, Attempted reduction: 5"
}
```

---

### 6. Check Stock Availability
**Endpoint:** `GET /inventory/check/:productId`

Used by the Order Service or any client to verify that enough stock exists before placing an order.

**Example:** `GET /inventory/check/1?requiredQty=5`

**Success Response (200 — sufficient stock):**
```json
{
  "success": true,
  "available": true,
  "productId": 1,
  "productName": "Laptop",
  "quantity": 10,
  "requiredQty": 5,
  "message": "Sufficient stock available (10 units in stock)"
}
```

**Success Response (200 — insufficient stock):**
```json
{
  "success": true,
  "available": false,
  "productId": 1,
  "productName": "Laptop",
  "quantity": 2,
  "requiredQty": 5,
  "message": "Insufficient stock. Requested: 5, Available: 2"
}
```

---

### 7. Delete Inventory Record
**Endpoint:** `DELETE /inventory/:id`

**Example:** `DELETE /inventory/1`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inventory record deleted successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Laptop",
    "quantity": 10,
    "warehouseLocation": "A1",
    "lastUpdated": "..."
  }
}
```

---

### 8. Health Check
**Endpoint:** `GET /health`

```json
{
  "status": "Inventory Service is running",
  "port": 5003,
  "totalRecords": 3,
  "timestamp": "2026-03-26T10:00:00.000Z"
}
```

---

## 🌐 Swagger Documentation

Once the service is running, open:

| Access Method | URL |
|---|---|
| Direct (native) | http://localhost:5003/api-docs |
| Via API Gateway | http://localhost:5000/inventory-docs |

---

## 🔗 Accessing via API Gateway (Port 5000)

When the API Gateway is running, all inventory endpoints are also accessible at:

```
http://localhost:5000/inventory
http://localhost:5000/inventory/:id
http://localhost:5000/inventory/:id/stock
http://localhost:5000/inventory/check/:productId
```

This means clients only need to know the gateway URL — they do not need to remember port 5003.

---

## 📊 Data Model

| Field | Type | Description |
|---|---|---|
| `id` | number | Auto-generated unique identifier |
| `productId` | number | Reference to the Product Service product ID |
| `productName` | string | Name of the product |
| `quantity` | number | Current stock level (non-negative integer) |
| `warehouseLocation` | string | Shelf/location code in the warehouse |
| `lastUpdated` | string (ISO 8601) | Timestamp of the last stock update |

---

## 🔀 Inter-Service Communication

The **Order Service** communicates with the Inventory Service to:
1. **Check availability** before confirming an order → `GET /inventory/check/:productId?requiredQty=N`
2. **Deduct stock** after an order is placed → `PATCH /inventory/:id/stock` with a negative adjustment

---

## 🧪 Sample Test Flow (Postman)

1. `GET /inventory` — verify seed data (3 records)
2. `GET /inventory/check/1?requiredQty=5` — check Laptop stock
3. `POST /inventory` — add a new product inventory
4. `PATCH /inventory/4/stock` with `{ "adjustment": -10 }` — simulate an order
5. `PUT /inventory/4` — update full record
6. `DELETE /inventory/4` — remove the record

---

## 📁 Folder Structure

```
inventory-service/
├── index.js         ← Main service file (routes + swagger + server)
├── package.json     ← Dependencies and scripts
├── .env             ← Environment variables (PORT=5003)
└── README.md        ← This file
```
