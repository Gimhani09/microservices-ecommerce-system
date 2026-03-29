# IT4020 Assignment 2 — Complete Testing Guide
## Microservices E-Commerce System

> **All services must be running before testing.**
> Start each service in a separate terminal with `npm start`.
> 
> | Service | Port | Start Command |
> |---------|------|--------------|
> | API Gateway | 5000 | `cd gateway && npm start` |
> | Product Service | 5001 | `cd product-service && npm start` |
> | Order Service | 5002 | `cd order-service && npm start` |
> | Inventory Service | 5003 | `cd inventory-service && npm start` |
> | Payment Service | 5004 | `cd payment-service && npm start` |

---

## TABLE OF CONTENTS

1. [API Gateway Endpoints](#1-api-gateway-endpoints)
2. [Product Service Endpoints](#2-product-service-endpoints)
3. [Inventory Service Endpoints](#3-inventory-service-endpoints)
4. [Order Service Endpoints](#4-order-service-endpoints)
5. [Payment Service Endpoints](#5-payment-service-endpoints)
6. [Swagger UI URLs](#6-swagger-ui-urls)
7. [Screenshot Checklist for Assignment Document](#7-screenshot-checklist-for-assignment-document)
8. [Change Tests (Latest Verification)](#change-tests-latest-verification)

---

## 1. API GATEWAY ENDPOINTS

> Base URL: `http://localhost:5000`

### 1.1 Gateway Utility Routes

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 1 | GET | `http://localhost:5000/` | Gateway welcome page |
| 2 | GET | `http://localhost:5000/health` | Gateway health check |
| 3 | GET | `http://localhost:5000/services` | List all configured microservices |
| 4 | GET | `http://localhost:5000/stats` | Request count per service |
| 5 | GET | `http://localhost:5000/docs` | JSON API documentation |
| 6 | GET | `http://localhost:5000/api-docs` | **Unified Swagger UI (all services)** |

### 1.2 Product Routes via Gateway

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 7 | GET | `http://localhost:5000/api/products` | Get all products |
| 8 | POST | `http://localhost:5000/api/products` | Create a product |
| 9 | GET | `http://localhost:5000/api/products?q=demo&isActive=true` | Search/filter products |
| 10 | GET | `http://localhost:5000/api/products/1` | Get product by ID |
| 11 | PUT | `http://localhost:5000/api/products/1` | Update a product |
| 12 | DELETE | `http://localhost:5000/api/products/1` | Delete a product |

### 1.3 Inventory Routes via Gateway

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 13 | GET | `http://localhost:5000/api/inventory` | Get all inventory records |
| 14 | POST | `http://localhost:5000/api/inventory` | Add new inventory record |
| 15 | GET | `http://localhost:5000/api/inventory/1` | Get inventory record by ID |
| 16 | PUT | `http://localhost:5000/api/inventory/1` | Update inventory record |
| 17 | PATCH | `http://localhost:5000/api/inventory/1/stock` | Adjust stock by inventory ID |
| 18 | PATCH | `http://localhost:5000/api/inventory/product/1/stock` | Adjust stock by product ID |
| 19 | DELETE | `http://localhost:5000/api/inventory/1` | Delete inventory record |
| 20 | GET | `http://localhost:5000/api/inventory/check/1?requiredQty=2` | Check stock availability |

### 1.4 Order Routes via Gateway

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 21 | POST | `http://localhost:5000/api/orders` | Create a new order |
| 22 | GET | `http://localhost:5000/api/orders` | Get all orders |
| 23 | GET | `http://localhost:5000/api/orders?status=PENDING` | Filter orders by status |
| 24 | GET | `http://localhost:5000/api/orders/1` | Get order by ID |
| 25 | PUT | `http://localhost:5000/api/orders/1` | Update order details |
| 26 | DELETE | `http://localhost:5000/api/orders/1` | Delete an order |

### 1.5 Payment Routes via Gateway

| # | Method | URL | Description |
|---|--------|-----|-------------|
| 27 | POST | `http://localhost:5000/api/payments` | Process a payment |
| 28 | GET | `http://localhost:5000/api/payments` | Get all payments |
| 29 | GET | `http://localhost:5000/api/payments/1` | Get payment by ID |
| 30 | GET | `http://localhost:5000/api/payments/order/1` | Get all payments for an order |
| 31 | PATCH | `http://localhost:5000/api/payments/1` | Update payment status |
| 32 | POST | `http://localhost:5000/api/payments/1/refund` | Refund a payment |

---

## 2. PRODUCT SERVICE ENDPOINTS

> Base URL: `http://localhost:5001`

| # | Method | Direct URL | Gateway Equivalent | Description |
|---|--------|-----------|-------------------|-------------|
| 1 | GET | `http://localhost:5001/products` | `http://localhost:5000/api/products` | Get all products |
| 2 | GET | `http://localhost:5001/products?q=demo&isActive=true` | `http://localhost:5000/api/products?q=demo&isActive=true` | Search/filter products |
| 3 | POST | `http://localhost:5001/products` | `http://localhost:5000/api/products` | Create new product |
| 4 | GET | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Get product by ID |
| 5 | GET | `http://localhost:5001/products/2` | `http://localhost:5000/api/products/2` | Get product by ID |
| 6 | PUT | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Full update product |
| 7 | DELETE | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Delete product |
| 8 | GET | `http://localhost:5001/health` | — | Health check |
| 9 | GET | `http://localhost:5001/api-docs` | `http://localhost:5000/api-docs` | Swagger UI |

### Request Bodies for Product Service

**POST / PUT — Create or Update Product:**
```json
{
  "name": "Wireless Headphones",
  "price": 149.99,
  "category": "Electronics",
  "description": "Over-ear Bluetooth headphones",
  "brand": "SoundMax",
  "isActive": true
}
```

### Default Seed Data (available on startup):
```
ID 1 - Laptop      | price: 999.99 | category: Electronics | brand: TechPro   | isActive: true
ID 2 - Mouse       | price: 29.99  | category: Accessories | brand: ClickX    | isActive: true
ID 3 - Keyboard    | price: 79.99  | category: Accessories | brand: KeyMaster | isActive: true
```

---

## 3. INVENTORY SERVICE ENDPOINTS

> Base URL: `http://localhost:5003`

| # | Method | Direct URL | Gateway Equivalent | Description |
|---|--------|-----------|-------------------|-------------|
| 1 | GET | `http://localhost:5003/inventory` | `http://localhost:5000/api/inventory` | Get all inventory records |
| 2 | POST | `http://localhost:5003/inventory` | `http://localhost:5000/api/inventory` | Add new inventory record |
| 3 | GET | `http://localhost:5003/inventory/1` | `http://localhost:5000/api/inventory/1` | Get record by ID |
| 4 | PUT | `http://localhost:5003/inventory/1` | `http://localhost:5000/api/inventory/1` | Full update record |
| 5 | PATCH | `http://localhost:5003/inventory/1/stock` | `http://localhost:5000/api/inventory/1/stock` | Adjust stock by inventory ID |
| 6 | PATCH | `http://localhost:5003/inventory/product/1/stock` | `http://localhost:5000/api/inventory/product/1/stock` | Adjust stock by product ID |
| 7 | DELETE | `http://localhost:5003/inventory/1` | `http://localhost:5000/api/inventory/1` | Delete record |
| 8 | GET | `http://localhost:5003/inventory/check/1` | `http://localhost:5000/api/inventory/check/1` | Check stock availability |
| 9 | GET | `http://localhost:5003/inventory/check/1?requiredQty=5` | `http://localhost:5000/api/inventory/check/1?requiredQty=5` | Check if enough stock |
| 10 | GET | `http://localhost:5003/health` | — | Health check |
| 11 | GET | `http://localhost:5003/api-docs` | `http://localhost:5000/api-docs` | Swagger UI |

### Request Bodies for Inventory Service

**POST — Add New Inventory Record:**
```json
{
  "productId": 4,
  "productName": "Wireless Headphones",
  "quantity": 30,
  "warehouseLocation": "C2"
}
```

**PATCH /inventory/1/stock — Adjust by Inventory ID:**
```json
{
  "adjustment": -5
}
```

**PATCH /inventory/product/1/stock — Adjust by Product ID:**
```json
{
  "adjustment": -2
}
```

**PUT — Full Update:**
```json
{
  "productId": 1,
  "productName": "Laptop Pro",
  "quantity": 20,
  "warehouseLocation": "A2"
}
```

### Default Seed Data (available on startup):
```
ID 1 - productId:1 Laptop     qty:10  location:A1
ID 2 - productId:2 Mouse      qty:100 location:B3
ID 3 - productId:3 Keyboard   qty:50  location:B4
```

---

## 4. ORDER SERVICE ENDPOINTS

> Base URL: `http://localhost:5002`

| # | Method | Direct URL | Gateway Equivalent | Description |
|---|--------|-----------|-------------------|-------------|
| 1 | POST | `http://localhost:5002/orders` | `http://localhost:5000/api/orders` | Create new order |
| 2 | GET | `http://localhost:5002/orders` | `http://localhost:5000/api/orders` | Get all orders |
| 3 | GET | `http://localhost:5002/orders?status=PENDING` | `http://localhost:5000/api/orders?status=PENDING` | Filter by status |
| 4 | GET | `http://localhost:5002/orders/1` | `http://localhost:5000/api/orders/1` | Get order by ID |
| 5 | PUT | `http://localhost:5002/orders/1` | `http://localhost:5000/api/orders/1` | Update order |
| 6 | DELETE | `http://localhost:5002/orders/1` | `http://localhost:5000/api/orders/1` | Delete order |
| 7 | GET | `http://localhost:5002/health` | — | Health check |
| 8 | GET | `http://localhost:5002/api-docs` | `http://localhost:5000/api-docs` | Swagger UI |

> **Note:** `PATCH /orders/:id/status` is an internal endpoint called by Payment Service only — it is not exposed in the gateway Swagger.

### Request Body for POST /orders — Create Order:
```json
{
  "customerName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Main Street",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 3 }
  ]
}
```

### Order Status Lifecycle:
```
PENDING  →  (payment SUCCESS)  →  CONFIRMED
PENDING  →  (payment FAILED)   →  CANCELLED  (inventory restored automatically)
```

### Example Response for POST /orders:
```json
{
  "success": true,
  "message": "Order created successfully. Stock has been reserved.",
  "data": {
    "id": 1,
    "customerName": "Nimal Perera",
    "totalAmount": 2089.95,
    "status": "PENDING",
    "items": [
      { "productName": "Laptop", "quantity": 2, "unitPrice": 999.99, "subtotal": 1999.98 },
      { "productName": "Mouse",  "quantity": 3, "unitPrice": 29.99,  "subtotal": 89.97  }
    ]
  }
}
```

---

## 5. PAYMENT SERVICE ENDPOINTS

> Base URL: `http://localhost:5004`

| # | Method | Direct URL | Gateway Equivalent | Description |
|---|--------|-----------|-------------------|-------------|
| 1 | POST | `http://localhost:5004/payments` | `http://localhost:5000/api/payments` | Process a payment |
| 2 | GET | `http://localhost:5004/payments` | `http://localhost:5000/api/payments` | Get all payments |
| 3 | GET | `http://localhost:5004/payments/1` | `http://localhost:5000/api/payments/1` | Get payment by ID |
| 4 | GET | `http://localhost:5004/payments/order/1` | `http://localhost:5000/api/payments/order/1` | Get payments for an order |
| 5 | PATCH | `http://localhost:5004/payments/1` | `http://localhost:5000/api/payments/1` | Update payment status |
| 6 | POST | `http://localhost:5004/payments/1/refund` | `http://localhost:5000/api/payments/1/refund` | Refund a payment |
| 7 | GET | `http://localhost:5004/health` | — | Health check |
| 8 | GET | `http://localhost:5004/api-docs` | `http://localhost:5000/api-docs` | Swagger UI |

### Request Body for POST /payments — Process Payment:
```json
{
  "orderId": 1,
  "simulateStatus": "SUCCESS"
}
```
> `simulateStatus` is **optional**. Use `"SUCCESS"` or `"FAILED"` to force a result for demos/screenshots. Omit to use the 80% random success rate.
>
> **Security Note:** `amount` is NOT in the request — it is read directly from Order Service (`order.totalAmount`) to prevent client-side tampering.

### Request Body for PATCH /payments/1 — Update Status:
```json
{
  "status": "REFUNDED"
}
```
> Allowed values: `SUCCESS`, `FAILED`, `REFUNDED`

---

## 6. SWAGGER UI URLs

| Service | Direct Swagger URL | Via Gateway |
|---------|-------------------|-------------|
| **API Gateway (all services unified)** | — | **`http://localhost:5000/api-docs`** |
| Product Service | `http://localhost:5001/api-docs` | `http://localhost:5000/api-docs` |
| Order Service | `http://localhost:5002/api-docs` | `http://localhost:5000/api-docs` |
| Inventory Service | `http://localhost:5003/api-docs` | `http://localhost:5000/api-docs` |
| Payment Service | `http://localhost:5004/api-docs` | `http://localhost:5000/api-docs` |

> The Gateway Swagger at `http://localhost:5000/api-docs` shows **all 4 microservices** in one unified UI, grouped by tags: Products, Orders, Inventory, Payment.

---

## 7. SCREENSHOT CHECKLIST FOR ASSIGNMENT DOCUMENT

> Take each screenshot with the browser showing the full URL in the address bar.
> For Postman/Swagger tries, make sure the response body is visible.

---

### SECTION A — Gateway Architecture Screenshots

| SS# | What to Capture | URL / Action |
|-----|----------------|-------------|
| A1 | Gateway welcome page | `GET http://localhost:5000/` |
| A2 | Gateway health check response | `GET http://localhost:5000/health` |
| A3 | Gateway services list (shows all 4 services) | `GET http://localhost:5000/services` |
| A4 | **Gateway unified Swagger UI** (full page — shows all 4 service groups) | `http://localhost:5000/api-docs` |

---

### SECTION B — Product Service Screenshots

| SS# | What to Capture | Direct URL | Gateway URL |
|-----|----------------|-----------|-------------|
| B1 | Product Service Swagger UI | `http://localhost:5001/api-docs` | — |
| B2 | GET all products — direct | `GET http://localhost:5001/products` | — |
| B3 | GET all products — **via gateway** | — | `GET http://localhost:5000/api/products` |
| B4 | GET products with filters (`q`, `isActive`) | `GET http://localhost:5001/products?q=demo&isActive=true` | `GET http://localhost:5000/api/products?q=demo&isActive=true` |
| B5 | POST create new product — direct | `POST http://localhost:5001/products` | — |
| B6 | POST create new product — **via gateway** | — | `POST http://localhost:5000/api/products` |
| B7 | GET product by ID — direct | `GET http://localhost:5001/products/1` | — |
| B8 | GET product by ID — **via gateway** | — | `GET http://localhost:5000/api/products/1` |
| B9 | Product Service health check | `GET http://localhost:5001/health` | — |

**Body for B5/B6 (POST create product):**
```json
{
  "name": "Gaming Laptop",
  "price": 1500.00,
  "category": "Electronics",
  "description": "High-performance laptop",
  "brand": "TechPro",
  "isActive": true
}
```

---

### SECTION C — Inventory Service Screenshots

| SS# | What to Capture | Direct URL | Gateway URL |
|-----|----------------|-----------|-------------|
| C1 | Inventory Service Swagger UI | `http://localhost:5003/api-docs` | — |
| C2 | GET all inventory — direct | `GET http://localhost:5003/inventory` | — |
| C3 | GET all inventory — **via gateway** | — | `GET http://localhost:5000/api/inventory` |
| C4 | POST add inventory record — direct | `POST http://localhost:5003/inventory` | — |
| C5 | POST add inventory record — **via gateway** | — | `POST http://localhost:5000/api/inventory` |
| C6 | GET check stock availability | `GET http://localhost:5003/inventory/check/1?requiredQty=2` | `GET http://localhost:5000/api/inventory/check/1?requiredQty=2` |
| C7 | PATCH adjust stock by product ID | `PATCH http://localhost:5003/inventory/product/1/stock` | `PATCH http://localhost:5000/api/inventory/product/1/stock` |
| C8 | Inventory Service health check | `GET http://localhost:5003/health` | — |

**Body for C4/C5 (POST add inventory):**
```json
{
  "productId": 4,
  "productName": "Gaming Laptop",
  "quantity": 5,
  "warehouseLocation": "D1"
}
```
**Body for C7 (PATCH stock by productId):**
```json
{ "adjustment": -1 }
```

---

### SECTION D — Order Service Screenshots

| SS# | What to Capture | Direct URL | Gateway URL |
|-----|----------------|-----------|-------------|
| D1 | Order Service Swagger UI | `http://localhost:5002/api-docs` | — |
| D2 | GET all orders — direct (empty at start) | `GET http://localhost:5002/orders` | — |
| D3 | POST create order — direct (shows product+inventory integration) | `POST http://localhost:5002/orders` | — |
| D4 | POST create order — **via gateway** (same result, different port) | — | `POST http://localhost:5000/api/orders` |
| D5 | GET order by ID — shows enriched items (productName, unitPrice, subtotal, totalAmount) | `GET http://localhost:5002/orders/1` | `GET http://localhost:5000/api/orders/1` |
| D6 | GET all orders — **via gateway** | — | `GET http://localhost:5000/api/orders` |
| D7 | GET filtered orders?status=PENDING | `GET http://localhost:5002/orders?status=PENDING` | `GET http://localhost:5000/api/orders?status=PENDING` |
| D8 | Order Service health check | `GET http://localhost:5002/health` | — |

**Body for D3/D4 (POST create order):**
```json
{
  "customerName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Main Street",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 3 }
  ]
}
```

> **Important for document:** The response for D3/D4 shows `totalAmount` automatically calculated and items enriched with `productName`, `unitPrice`, `subtotal` — this demonstrates inter-service communication.

---

### SECTION E — Payment Service Screenshots

| SS# | What to Capture | Direct URL | Gateway URL |
|-----|----------------|-----------|-------------|
| E1 | Payment Service Swagger UI | `http://localhost:5004/api-docs` | — |
| E2 | POST payment SUCCESS — direct | `POST http://localhost:5004/payments` | — |
| E3 | POST payment SUCCESS — **via gateway** | — | `POST http://localhost:5000/api/payments` |
| E4 | GET order after SUCCESS (status = CONFIRMED) | `GET http://localhost:5002/orders/1` | `GET http://localhost:5000/api/orders/1` |
| E5 | POST payment FAILED — direct | `POST http://localhost:5004/payments` | — |
| E6 | GET order after FAILED (status = CANCELLED) | `GET http://localhost:5002/orders/2` | `GET http://localhost:5000/api/orders/2` |
| E7 | GET inventory after FAILED (stock restored) | `GET http://localhost:5003/inventory` | `GET http://localhost:5000/api/inventory` |
| E8 | POST refund | `POST http://localhost:5004/payments/1/refund` | `POST http://localhost:5000/api/payments/1/refund` |
| E9 | GET all payments | `GET http://localhost:5004/payments` | `GET http://localhost:5000/api/payments` |
| E10 | Payment Service health check | `GET http://localhost:5004/health` | — |

**Body for E2/E3 (POST payment — SUCCESS):**
```json
{
  "orderId": 1,
  "simulateStatus": "SUCCESS"
}
```

**Body for E5 (POST payment — FAILED):**
```json
{
  "orderId": 2,
  "simulateStatus": "FAILED"
}
```

> **Important for document:** E2/E3 shows that `amount` comes from `order.totalAmount` — client does not control the amount. E4 confirms order is `CONFIRMED`. E6+E7 show order is `CANCELLED` and inventory was automatically restored.

---

### SECTION F — Error Handling Screenshots

| SS# | What to Capture | URL | Body |
|-----|----------------|-----|------|
| F1 | Invalid product ID in order | `POST http://localhost:5000/api/orders` | `items: [{ "productId": 999, "quantity": 1 }]` |
| F2 | Insufficient stock | `POST http://localhost:5000/api/orders` | `items: [{ "productId": 1, "quantity": 9999 }]` |
| F3 | Order not found for payment | `POST http://localhost:5000/api/payments` | `{ "orderId": 9999 }` |
| F4 | Duplicate inventory | `POST http://localhost:5000/api/inventory` | `{ "productId": 1, ... }` |
| F5 | Refund a failed payment | `POST http://localhost:5000/api/payments/2/refund` | — |

---

## END-TO-END TEST SEQUENCE (Step-by-Step for Demo)

Run these in order for a complete demo:

```
Step 1:  GET  http://localhost:5000/services              ← Show gateway knows all services
Step 2:  GET  http://localhost:5000/api/products          ← Show seed products
Step 3:  GET  http://localhost:5000/api/inventory         ← Show seed inventory (qty: 10, 100, 50)
Step 4:  POST http://localhost:5000/api/orders            ← Create order (2×Laptop + 3×Mouse)
Step 5:  GET  http://localhost:5000/api/inventory         ← Laptop: 10→8, Mouse: 100→97
Step 6:  GET  http://localhost:5000/api/orders/1          ← Status=PENDING, total=2089.95
Step 7:  POST http://localhost:5000/api/payments          ← simulateStatus=SUCCESS
Step 8:  GET  http://localhost:5000/api/orders/1          ← Status=CONFIRMED
Step 9:  GET  http://localhost:5000/api/payments          ← See payment record

--- Test failure scenario ---
Step 10: POST http://localhost:5000/api/orders            ← Create second order (1×Laptop)
Step 11: GET  http://localhost:5000/api/inventory         ← Laptop: 8→7
Step 12: POST http://localhost:5000/api/payments          ← simulateStatus=FAILED (orderId=2)
Step 13: GET  http://localhost:5000/api/orders/2          ← Status=CANCELLED
Step 14: GET  http://localhost:5000/api/inventory         ← Laptop: 7→8 (stock RESTORED)

--- Test refund ---
Step 15: POST http://localhost:5000/api/payments/1/refund ← Refund successful payment
Step 16: GET  http://localhost:5000/api/payments/1        ← Status=REFUNDED
```

---

## CHANGE TESTS (Latest Verification)

> Verified on **2026-03-29** against local running services and gateway.

| # | Test | Endpoint | Expected | Result |
|---|------|----------|----------|--------|
| 1 | Gateway health | `GET http://localhost:5000/health` | 200 | PASS |
| 2 | Product create with new fields | `POST http://localhost:5001/products` | 201 + returns `isActive` | PASS |
| 3 | Product filter support | `GET http://localhost:5001/products?q=Demo&isActive=true` | 200 | PASS |
| 4 | Inventory create for new product | `POST http://localhost:5003/inventory` | 201 | PASS |
| 5 | Inactive product order block | `POST http://localhost:5000/api/orders` | 400 + `Product is inactive and cannot be ordered` | PASS |
| 6 | Order create (active product) | `POST http://localhost:5000/api/orders` | 201 | PASS |
| 7 | Payment success updates order | `POST http://localhost:5000/api/payments` + `GET /orders/{id}` | `CONFIRMED` | PASS |
| 8 | Refund scope response | `POST http://localhost:5004/payments/{id}/refund` | 200 + `scope` object | PASS |

### Change-Test Request Body: Inactive Product
```json
{
  "name": "Tmp",
  "price": 10,
  "isActive": false
}
```

### Change-Test Request Body: Order (should fail for inactive product)
```json
{
  "customerName": "Test User",
  "email": "test@example.com",
  "phone": "0771234567",
  "address": "Street 1",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": "<inactiveProductId>", "quantity": 1 }
  ]
}
```

---

## POSTMAN QUICK REFERENCE

If using Postman, set this environment:

| Variable | Value |
|----------|-------|
| `GATEWAY` | `http://localhost:5000` |
| `PRODUCT` | `http://localhost:5001` |
| `ORDER` | `http://localhost:5002` |
| `INVENTORY` | `http://localhost:5003` |
| `PAYMENT` | `http://localhost:5004` |

Then use `{{GATEWAY}}/api/products`, `{{PRODUCT}}/products`, etc.

Set `Content-Type: application/json` header for all POST/PUT/PATCH requests.

---

---

# FULL SYSTEM PRESENTATION DEMO SCRIPT
## Complete Step-by-Step Test with All Inputs & Expected Responses

> Use **Postman** or **Swagger UI at `http://localhost:5000/api-docs`** for all steps.
> All requests go through the **API Gateway on port 5000**.
> Set header: `Content-Type: application/json` for all POST / PUT / PATCH requests.
> Run steps **in order** — later steps depend on data created by earlier steps.

---

## PHASE 1 — Show the Gateway is Working

---

### STEP 1 — Check Gateway is Running

```
METHOD : GET
URL    : http://localhost:5000/health
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "service": "API Gateway",
  "timestamp": "2026-03-29T10:00:00.000Z"
}
```

> **What to say:** "Our API Gateway is running on port 5000. All client requests go here — no one talks directly to the microservices."

---

### STEP 2 — Show All Registered Microservices

```
METHOD : GET
URL    : http://localhost:5000/services
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "gateway": "E-Commerce API Gateway",
  "services": {
    "products":  "http://localhost:5001",
    "orders":    "http://localhost:5002",
    "inventory": "http://localhost:5003",
    "payments":  "http://localhost:5004"
  }
}
```

> **What to say:** "The gateway knows about all 4 microservices. Clients only need to know port 5000 — they never need to know individual service ports."

---

### STEP 3 — Open Unified Swagger UI

```
Open browser: http://localhost:5000/api-docs
```

> **What to say:** "The gateway provides a single Swagger UI that documents ALL four microservices in one place. You can see Products, Orders, Inventory, and Payments all grouped here."
>
> **Screenshot:** Take a screenshot of the full Swagger page showing all 4 service groups expanded.

---

## PHASE 2 — Product Service Demo

---

### STEP 4 — View All Existing Products (via Gateway)

```
METHOD : GET
URL    : http://localhost:5000/api/products
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 3 products",
  "data": [
    { "id": 1, "name": "Laptop",   "price": 999.99, "stock": 10 },
    { "id": 2, "name": "Mouse",    "price": 29.99,  "stock": 100 },
    { "id": 3, "name": "Keyboard", "price": 79.99,  "stock": 50 }
  ]
}
```

> **What to say:** "Product Service has 3 products pre-loaded. Stock is currently 10 Laptops, 100 Mice, 50 Keyboards."

---

### STEP 5 — Also call Product Service directly (same result, different port)

```
METHOD : GET
URL    : http://localhost:5001/products
BODY   : none
```

**Expected Response:** Same as Step 4.

> **What to say:** "The gateway proxies the request — same data, same result. The gateway just routes requests transparently."

---

### STEP 6 — Create a New Product (via Gateway)

```
METHOD  : POST
URL     : http://localhost:5000/api/products
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "name": "Gaming Laptop",
  "price": 1500.00,
  "stock": 5
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 4,
    "name": "Gaming Laptop",
    "price": 1500,
    "stock": 5
  }
}
```

> **What to say:** "We created a fourth product — Gaming Laptop at $1500 with 5 units stock."

---

### STEP 7 — Get Single Product by ID (via Gateway)

```
METHOD : GET
URL    : http://localhost:5000/api/products/4
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": { "id": 4, "name": "Gaming Laptop", "price": 1500, "stock": 5 }
}
```

---

## PHASE 3 — Inventory Service Demo

---

### STEP 8 — View All Inventory Records (via Gateway)

```
METHOD : GET
URL    : http://localhost:5000/api/inventory
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "productId": 1, "productName": "Laptop",   "quantity": 10,  "warehouseLocation": "A1" },
    { "id": 2, "productId": 2, "productName": "Mouse",    "quantity": 100, "warehouseLocation": "B3" },
    { "id": 3, "productId": 3, "productName": "Keyboard", "quantity": 50,  "warehouseLocation": "B4" }
  ]
}
```

> **What to say:** "Inventory Service tracks stock per product. Notice it has its own `id` separate from `productId`. Currently Laptop has 10 units."

---

### STEP 9 — Add Inventory for the New Product (via Gateway)

```
METHOD  : POST
URL     : http://localhost:5000/api/inventory
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "productId": 4,
  "productName": "Gaming Laptop",
  "quantity": 5,
  "warehouseLocation": "D1"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Inventory record created successfully",
  "data": {
    "id": 4,
    "productId": 4,
    "productName": "Gaming Laptop",
    "quantity": 5,
    "warehouseLocation": "D1"
  }
}
```

> **What to say:** "We added inventory for the Gaming Laptop — 5 units at warehouse location D1."

---

### STEP 10 — Check Stock Availability (via Gateway)

```
METHOD : GET
URL    : http://localhost:5000/api/inventory/check/4?requiredQty=2
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "available": true,
  "productId": 4,
  "productName": "Gaming Laptop",
  "quantity": 5,
  "requiredQty": 2,
  "message": "Sufficient stock available (5 units in stock)"
}
```

> **What to say:** "The Inventory Service can check whether enough stock is available before allowing an order. This is called by Order Service automatically."

---

## PHASE 4 — Order Service Demo (Inter-Service Communication)

---

### STEP 11 — Create Order #1 (SUCCESS scenario)

> **This is the most important demo step.** This single request triggers calls to both Product Service and Inventory Service internally.

```
METHOD  : POST
URL     : http://localhost:5000/api/orders
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "customerName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Galle Road",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 3 }
  ]
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully. Stock has been reserved.",
  "data": {
    "id": 1,
    "customerName": "Nimal Perera",
    "email": "nimal@gmail.com",
    "phone": "0771234567",
    "address": "123 Galle Road",
    "city": "Colombo",
    "postalCode": "10000",
    "totalAmount": 2089.95,
    "status": "PENDING",
    "createdAt": "2026-03-29T10:05:00.000Z",
    "items": [
      {
        "productId": 1,
        "productName": "Laptop",
        "quantity": 2,
        "unitPrice": 999.99,
        "subtotal": 1999.98
      },
      {
        "productId": 2,
        "productName": "Mouse",
        "quantity": 3,
        "unitPrice": 29.99,
        "subtotal": 89.97
      }
    ]
  }
}
```

> **What to say:**
> "This single POST request triggered a chain of events:
> 1. Order Service called Product Service to verify Laptop and Mouse exist and get their prices
> 2. Order Service called Inventory Service to check sufficient stock
> 3. Total was auto-calculated: (2 × 999.99) + (3 × 29.99) = $2089.95
> 4. Items are enriched with productName, unitPrice, subtotal
> 5. Inventory stock was automatically deducted
> Status is PENDING — waiting for payment."

---

### STEP 12 — Verify Inventory Was Automatically Deducted

```
METHOD : GET
URL    : http://localhost:5000/api/inventory
BODY   : none
```

**Expected Response — notice stock reduced:**
```json
{
  "data": [
    { "productId": 1, "productName": "Laptop", "quantity": 8  },
    { "productId": 2, "productName": "Mouse",  "quantity": 97 },
    { "productId": 3, "productName": "Keyboard","quantity": 50 }
  ]
}
```

> **What to say:** "Laptop went from 10 → 8 (we ordered 2). Mouse went from 100 → 97 (we ordered 3). This happened automatically — Order Service called Inventory Service in the background."

---

## PHASE 5 — Payment Service Demo (Successful Payment)

---

### STEP 13 — Process Payment for Order #1 (FORCE SUCCESS)

```
METHOD  : POST
URL     : http://localhost:5000/api/payments
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "orderId": 1,
  "simulateStatus": "SUCCESS"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Payment successful. Order #1 is now CONFIRMED.",
  "data": {
    "id": 1,
    "orderId": 1,
    "amount": 2089.95,
    "status": "SUCCESS",
    "processedAt": "2026-03-29T10:07:00.000Z"
  }
}
```

> **What to say:**
> "Notice: we did NOT send the amount in the request body — only the orderId. Payment Service fetches the amount from Order Service itself (order.totalAmount = $2089.95). This prevents a customer from sending amount=1 to pay only $1 for a $2000 order.
> We used simulateStatus=SUCCESS here so we can show a guaranteed success for the demo."

---

### STEP 14 — Verify Order #1 is Now CONFIRMED

```
METHOD : GET
URL    : http://localhost:5000/api/orders/1
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customerName": "Nimal Perera",
    "totalAmount": 2089.95,
    "status": "CONFIRMED",
    "items": [...]
  }
}
```

> **What to say:** "After successful payment, Order Service was automatically called by Payment Service to update the status from PENDING to CONFIRMED. The order and payment services are communicating."

---

### STEP 15 — View the Payment Record

```
METHOD : GET
URL    : http://localhost:5000/api/payments
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 1 payments",
  "data": [
    {
      "id": 1,
      "orderId": 1,
      "amount": 2089.95,
      "status": "SUCCESS",
      "processedAt": "2026-03-29T10:07:00.000Z"
    }
  ]
}
```

---

## PHASE 6 — Payment Failure Demo (Stock Restoration)

---

### STEP 16 — Create Order #2 (for failure scenario)

```
METHOD  : POST
URL     : http://localhost:5000/api/orders
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "customerName": "Kasun Silva",
  "email": "kasun@gmail.com",
  "phone": "0712345678",
  "address": "45 Temple Road",
  "city": "Kandy",
  "postalCode": "20000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully. Stock has been reserved.",
  "data": {
    "id": 2,
    "customerName": "Kasun Silva",
    "totalAmount": 3499.98,
    "status": "PENDING",
    "items": [
      { "productName": "Laptop",       "quantity": 2, "unitPrice": 999.99, "subtotal": 1999.98 },
      { "productName": "Gaming Laptop","quantity": 1, "unitPrice": 1500,   "subtotal": 1500.00 }
    ]
  }
}
```

---

### STEP 17 — Check Inventory After Order #2 (stock reduced again)

```
METHOD : GET
URL    : http://localhost:5000/api/inventory
BODY   : none
```

**Expected Response — Laptop and Gaming Laptop stock reduced:**
```json
{
  "data": [
    { "productId": 1, "productName": "Laptop",        "quantity": 6 },
    { "productId": 2, "productName": "Mouse",         "quantity": 97 },
    { "productId": 3, "productName": "Keyboard",      "quantity": 50 },
    { "productId": 4, "productName": "Gaming Laptop", "quantity": 4 }
  ]
}
```

> **What to say:** "Laptop went from 8 → 6 (ordered 2 more). Gaming Laptop went from 5 → 4 (ordered 1). Stock is reserved."

---

### STEP 18 — Process Payment for Order #2 (FORCE FAILED)

```
METHOD  : POST
URL     : http://localhost:5000/api/payments
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "orderId": 2,
  "simulateStatus": "FAILED"
}
```

**Expected Response (201 Created — but payment failed):**
```json
{
  "success": false,
  "message": "Payment failed. Order #2 has been CANCELLED and stock has been restored.",
  "data": {
    "id": 2,
    "orderId": 2,
    "amount": 3499.98,
    "status": "FAILED",
    "processedAt": "2026-03-29T10:12:00.000Z"
  }
}
```

> **What to say:** "Payment failed. Notice the message says 'stock has been restored'. Payment Service told Order Service to cancel the order, and Order Service automatically restored the inventory."

---

### STEP 19 — Verify Order #2 is CANCELLED

```
METHOD : GET
URL    : http://localhost:5000/api/orders/2
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "customerName": "Kasun Silva",
    "totalAmount": 3499.98,
    "status": "CANCELLED"
  }
}
```

---

### STEP 20 — Verify Inventory Was Automatically RESTORED

```
METHOD : GET
URL    : http://localhost:5000/api/inventory
BODY   : none
```

**Expected Response — stock back to what it was before Order #2:**
```json
{
  "data": [
    { "productId": 1, "productName": "Laptop",        "quantity": 8 },
    { "productId": 2, "productName": "Mouse",         "quantity": 97 },
    { "productId": 3, "productName": "Keyboard",      "quantity": 50 },
    { "productId": 4, "productName": "Gaming Laptop", "quantity": 5 }
  ]
}
```

> **What to say:** "Laptop is back to 8 (was 6 after the failed order). Gaming Laptop is back to 5 (was 4). Stock is fully restored automatically — this is business logic consistency. A cancelled order does not consume inventory."

---

## PHASE 7 — Refund Demo

---

### STEP 21 — Refund the Successful Payment

```
METHOD : POST
URL    : http://localhost:5000/api/payments/1/refund
BODY   : none
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment refunded",
  "data": {
    "id": 1,
    "orderId": 1,
    "amount": 2089.95,
    "status": "REFUNDED",
    "processedAt": "2026-03-29T10:07:00.000Z"
  }
}
```

> **What to say:** "Payment #1 is now REFUNDED. Only successful payments can be refunded — if you try to refund a FAILED payment, you get a 400 error."

---

### STEP 22 — Try Refunding a FAILED Payment (Error Case)

```
METHOD : POST
URL    : http://localhost:5000/api/payments/2/refund
BODY   : none
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Only successful payments can be refunded"
}
```

---

## PHASE 8 — Validation & Error Handling Demo

---

### STEP 23 — Try to Order a Non-Existent Product

```
METHOD  : POST
URL     : http://localhost:5000/api/orders
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "customerName": "Test User",
  "email": "test@test.com",
  "phone": "0700000000",
  "address": "Test",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 999, "quantity": 1 }
  ]
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Product with ID 999 not found in Product Service"
}
```

> **What to say:** "Order Service validated that product ID 999 does not exist by calling Product Service in real time. The order was rejected."

---

### STEP 24 — Try to Order More Than Available Stock

```
METHOD  : POST
URL     : http://localhost:5000/api/orders
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "customerName": "Test User",
  "email": "test@test.com",
  "phone": "0700000000",
  "address": "Test",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 9999 }
  ]
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Insufficient stock for \"Laptop\". Available: 8, Requested: 9999"
}
```

> **What to say:** "Order Service checked Inventory Service in real time. Only 8 Laptops are available — the order for 9999 was rejected before being saved."

---

### STEP 25 — Try to Pay for a Non-Existent Order

```
METHOD  : POST
URL     : http://localhost:5000/api/payments
HEADERS : Content-Type: application/json
BODY:
```
```json
{
  "orderId": 9999
}
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Order with ID 9999 not found in Order Service"
}
```

---

## PHASE 9 — View Final State of All Data

---

### STEP 26 — Final: All Orders

```
METHOD : GET
URL    : http://localhost:5000/api/orders
BODY   : none
```

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    { "id": 1, "customerName": "Nimal Perera", "totalAmount": 2089.95, "status": "CONFIRMED" },
    { "id": 2, "customerName": "Kasun Silva",  "totalAmount": 3499.98, "status": "CANCELLED" }
  ]
}
```

---

### STEP 27 — Final: All Payments

```
METHOD : GET
URL    : http://localhost:5000/api/payments
BODY   : none
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Retrieved 2 payments",
  "data": [
    { "id": 1, "orderId": 1, "amount": 2089.95, "status": "REFUNDED" },
    { "id": 2, "orderId": 2, "amount": 3499.98, "status": "FAILED"   }
  ]
}
```

---

### STEP 28 — Final: All Inventory

```
METHOD : GET
URL    : http://localhost:5000/api/inventory
BODY   : none
```

**Expected Final Inventory:**
```json
{
  "data": [
    { "productId": 1, "productName": "Laptop",        "quantity": 8  },
    { "productId": 2, "productName": "Mouse",         "quantity": 97 },
    { "productId": 3, "productName": "Keyboard",      "quantity": 50 },
    { "productId": 4, "productName": "Gaming Laptop",  "quantity": 5  }
  ]
}
```

> Laptop: started at 10, deducted 2 for confirmed Order #1 → final = **8**
> Mouse: started at 100, deducted 3 for confirmed Order #1 → final = **97**
> Gaming Laptop: started at 5, deducted 1 for Order #2 then **restored** (cancelled) → final = **5**

---

## SUMMARY OF WHAT THE DEMO PROVES

| What was demonstrated | Step # |
|----------------------|--------|
| Gateway routes all requests — one port for everything | 1, 2 |
| Unified Swagger UI covers all 4 services | 3 |
| Product CRUD via gateway and directly | 4–7 |
| Inventory CRUD + stock check via gateway and directly | 8–10 |
| Order creation auto-validates product (cross-service call) | 11 |
| Order creation auto-checks inventory (cross-service call) | 11 |
| Total amount auto-calculated from real prices | 11 |
| Stock automatically deducted when order created | 12 |
| Payment amount taken from Order Service — client cannot tamper | 13 |
| Order status updated to CONFIRMED after successful payment | 14 |
| Stock NOT restored after successful payment (correct) | 17 |
| Order cancelled and stock RESTORED after failed payment | 18–20 |
| Refund only works on SUCCESS payments | 21–22 |
| Validation rejects invalid products | 23 |
| Validation rejects insufficient stock | 24 |
| Validation rejects payment for non-existent order | 25 |
