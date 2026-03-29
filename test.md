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
| 9 | GET | `http://localhost:5000/api/products/1` | Get product by ID |
| 10 | PUT | `http://localhost:5000/api/products/1` | Update a product |
| 11 | PATCH | `http://localhost:5000/api/products/1/stock` | Adjust product stock |
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
| 2 | POST | `http://localhost:5001/products` | `http://localhost:5000/api/products` | Create new product |
| 3 | GET | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Get product by ID |
| 4 | GET | `http://localhost:5001/products/2` | `http://localhost:5000/api/products/2` | Get product by ID |
| 5 | PUT | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Full update product |
| 6 | PATCH | `http://localhost:5001/products/1/stock` | `http://localhost:5000/api/products/1/stock` | Adjust product stock |
| 7 | DELETE | `http://localhost:5001/products/1` | `http://localhost:5000/api/products/1` | Delete product |
| 8 | GET | `http://localhost:5001/health` | — | Health check |
| 9 | GET | `http://localhost:5001/api-docs` | `http://localhost:5000/api-docs` | Swagger UI |

### Request Bodies for Product Service

**POST / PUT — Create or Update Product:**
```json
{
  "name": "Wireless Headphones",
  "price": 149.99,
  "stock": 30
}
```

**PATCH /products/1/stock — Adjust Stock:**
```json
{
  "adjustment": -2
}
```
> Negative reduces stock, positive adds stock.

### Default Seed Data (available on startup):
```
ID 1 - Laptop      | price: 999.99 | stock: 10
ID 2 - Mouse       | price: 29.99  | stock: 100
ID 3 - Keyboard    | price: 79.99  | stock: 50
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
| B4 | POST create new product — direct | `POST http://localhost:5001/products` | — |
| B5 | POST create new product — **via gateway** | — | `POST http://localhost:5000/api/products` |
| B6 | GET product by ID — direct | `GET http://localhost:5001/products/1` | — |
| B7 | GET product by ID — **via gateway** | — | `GET http://localhost:5000/api/products/1` |
| B8 | PATCH adjust product stock | `PATCH http://localhost:5001/products/1/stock` | `PATCH http://localhost:5000/api/products/1/stock` |
| B9 | Product Service health check | `GET http://localhost:5001/health` | — |

**Body for B4/B5 (POST create product):**
```json
{
  "name": "Gaming Laptop",
  "price": 1500.00,
  "stock": 5
}
```
**Body for B8 (PATCH stock):**
```json
{ "adjustment": -2 }
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
