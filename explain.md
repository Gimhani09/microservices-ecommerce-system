# E-Commerce Microservices System — Full Project Explanation

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [How Services Communicate](#how-services-communicate)
3. [API Gateway (Port 5000)](#api-gateway-port-5000)
4. [Product Service (Port 5001)](#product-service-port-5001)
5. [Order Service (Port 5002)](#order-service-port-5002)
6. [Inventory Service (Port 5003)](#inventory-service-port-5003)
7. [Payment Service (Port 5004)](#payment-service-port-5004)
8. [Service Interconnection Map](#service-interconnection-map)
9. [End-to-End Test Flow](#end-to-end-test-flow)
10. [Swagger UI Access](#swagger-ui-access)
11. [Error Handling](#error-handling)
12. [How to Start All Services](#how-to-start-all-services)

---

## Architecture Overview

This is a **microservices-based e-commerce system** built with **Node.js + Express**. Instead of one big application, it is split into **5 independent services**. Each service runs on its own port, manages its own data, and communicates with other services over HTTP using `axios`.

```
                   ┌──────────────────────────────────────────┐
                   │          CLIENT / BROWSER                 │
                   │     (Postman, Swagger UI, curl, etc.)     │
                   └──────────────────┬───────────────────────┘
                                      │  All requests enter here
                                      ▼
                   ┌──────────────────────────────────────────┐
                   │          API GATEWAY  :5000               │
                   │  • Single entry point for all services    │
                   │  • /api/products  → forwards to :5001     │
                   │  • /api/orders    → forwards to :5002     │
                   │  • /api/inventory → forwards to :5003     │
                   │  • /api/payments  → forwards to :5004     │
                   │  • Swagger UI at /api-docs                │
                   └───┬─────────┬──────────┬─────────┬───────┘
                       │         │          │         │
            ┌──────────┘  ┌──────┘  ┌───────┘  ┌─────┘
            ▼             ▼         ▼           ▼
      ┌──────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐
      │ PRODUCT  │  │  ORDER   │ │INVENTORY │ │ PAYMENT  │
      │  :5001   │  │  :5002   │ │  :5003   │ │  :5004   │
      └──────────┘  └────┬─────┘ └──────────┘ └────┬─────┘
                         │  calls internally         │
                         ├──→ Product  :5001         │
                         └──→ Inventory :5003    ────┘
                                                 calls internally
                                             └──→ Order :5002
```

---

## How Services Communicate

The **gateway** uses `http-proxy-middleware` to forward client requests:
- Receives a request like `GET /api/products/1`
- Strips the `/api` prefix → becomes `/products/1`
- Forwards to `http://localhost:5001/products/1`
- Returns the response to the client, adding headers:
  - `X-Gateway: API Gateway v1.0`
  - `X-Service: products`

The **order service** and **payment service** use `axios` to call other services directly (not through the gateway) when they need data.

---

## API Gateway (Port 5000)

**File:** `gateway/index.js`

The gateway does **no business logic**. It only routes and proxies requests. It also exposes a unified **Swagger UI** showing all service endpoints in one place.

### Gateway-Only Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `http://localhost:5000/` | Welcome page with quick-start links |
| `GET` | `http://localhost:5000/health` | Gateway health status |
| `GET` | `http://localhost:5000/services` | Lists all 4 configured microservices |
| `GET` | `http://localhost:5000/stats` | Request count per service |
| `GET` | `http://localhost:5000/docs` | JSON documentation page |
| `GET` | `http://localhost:5000/api-docs` | **Swagger UI** (main — all services) |

### Proxy Routing Table

| Gateway Path | Forwards To | Service |
|---|---|---|
| `/api/products/*` | `http://localhost:5001/products/*` | Product Service |
| `/api/orders/*` | `http://localhost:5002/orders/*` | Order Service |
| `/api/inventory/*` | `http://localhost:5003/inventory/*` | Inventory Service |
| `/api/payments/*` | `http://localhost:5004/payments/*` | Payment Service |

### Environment Variables (`gateway/.env`)
```
PORT=5000
NODE_ENV=development
PRODUCT_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5002
INVENTORY_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
```

---

## Product Service (Port 5001)

**File:** `product-service/index.js`  
**Storage:** In-memory array (resets on restart)

### Default Data (pre-loaded)
```json
[
  { "id": 1, "name": "Laptop",   "price": 999.99, "stock": 10  },
  { "id": 2, "name": "Mouse",    "price": 29.99,  "stock": 100 },
  { "id": 3, "name": "Keyboard", "price": 79.99,  "stock": 50  }
]
```

### All Endpoints

| Method | Direct URL | Gateway URL | Description | Body Required |
|--------|-----------|-------------|-------------|---------------|
| `GET` | `:5001/products` | `/api/products` | Get all products | — |
| `POST` | `:5001/products` | `/api/products` | Create a new product | `{ name, price, stock }` |
| `GET` | `:5001/products/:id` | `/api/products/{id}` | Get product by ID | — |
| `PUT` | `:5001/products/:id` | `/api/products/{id}` | Fully update a product | `{ name, price, stock }` |
| `PATCH` | `:5001/products/:id/stock` | `/api/products/{id}/stock` | Adjust stock quantity | `{ adjustment: -2 }` |
| `DELETE` | `:5001/products/:id` | `/api/products/{id}` | Delete a product | — |
| `GET` | `:5001/health` | — | Health check | — |
| `GET` | `:5001/api-docs` | — | Swagger UI (direct) | — |

### Request Body Examples

**POST / PUT `/api/products`**
```json
{
  "name": "Wireless Headphones",
  "price": 149.99,
  "stock": 30
}
```

**PATCH `/api/products/{id}/stock`**
```json
{ "adjustment": -2 }
```
> Use **negative** to reduce stock, **positive** to add stock.

### Validation Rules
- `name` — required, non-empty string
- `price` — required, positive number (≥ 0)
- `stock` — required, non-negative integer
- `adjustment` — non-zero integer; final stock cannot go below 0

### Example Responses

**GET /api/products**
```json
{
  "success": true,
  "message": "Retrieved 3 products",
  "data": [
    { "id": 1, "name": "Laptop", "price": 999.99, "stock": 10 }
  ]
}
```

**POST /api/products (success)**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { "id": 4, "name": "Wireless Headphones", "price": 149.99, "stock": 30 }
}
```

**PATCH stock (insufficient)**
```json
{
  "success": false,
  "error": "Insufficient stock. Current: 2, Requested reduction: 5"
}
```

---

## Order Service (Port 5002)

**File:** `order-service/index.js`  
**Storage:** In-memory array (starts empty)  
**Calls:** Product Service (`:5001`) and Inventory Service (`:5003`) via `axios`

### Environment Variables (`order-service/.env`)
```
PORT=5002
NODE_ENV=development
PRODUCT_SERVICE_URL=http://localhost:5001
INVENTORY_SERVICE_URL=http://localhost:5003
```

### Order Statuses
| Status | Meaning |
|--------|---------|
| `PENDING` | Order just created, awaiting payment |
| `CONFIRMED` | Payment was successful |
| `CANCELLED` | Payment failed |

### All Endpoints

| Method | Direct URL | Gateway URL | Description | Body Required |
|--------|-----------|-------------|-------------|---------------|
| `POST` | `:5002/orders` | `/api/orders` | Create new order *(calls Product + Inventory)* | Full order body |
| `GET` | `:5002/orders` | `/api/orders` | Get all orders (filter: `?status=PENDING`) | — |
| `GET` | `:5002/orders/:id` | `/api/orders/{id}` | Get specific order | — |
| `PUT` | `:5002/orders/:id` | `/api/orders/{id}` | Update order details | Full order body |
| `DELETE` | `:5002/orders/:id` | `/api/orders/{id}` | Delete an order | — |
| `PATCH` | `:5002/orders/:id/status` | *(internal only)* | Update order status | `{ status: "CONFIRMED" }` |
| `GET` | `:5002/health` | — | Health check | — |
| `GET` | `:5002/api-docs` | — | Swagger UI (direct) | — |

### POST /api/orders — Request Body
```json
{
  "customerName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Main St",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 3 }
  ]
}
```
> `productId` must be a **positive integer** matching a real product ID.

### What Happens Inside POST /orders (Step by Step)

```
Client sends POST /api/orders
        │
        ▼ Gateway forwards to Order Service :5002
        │
        ├─ [Step 1] Validate all input fields
        │
        ├─ [Step 2] For EACH item:
        │     ├─ [2a] → GET http://localhost:5001/products/:productId
        │     │         If not found → 400 error "Product not found"
        │     │         If found     → get name and price
        │     │
        │     └─ [2b] → GET http://localhost:5003/inventory/check/:productId?requiredQty=N
        │               If not found       → 400 "Cannot verify inventory"
        │               If not enough stock → 400 "Insufficient stock"
        │
        ├─ [Step 3] Calculate totalAmount = Σ (price × quantity)
        │
        ├─ [Step 4] Save order:
        │     status = PENDING
        │     items enriched with productName, unitPrice, subtotal
        │
        └─ [Step 5] For EACH item:
              → PATCH http://localhost:5003/inventory/:id/stock { adjustment: -N }
                Deducts ordered quantity from inventory
```

### POST /orders — Response (Success)
```json
{
  "success": true,
  "message": "Order created successfully. Stock has been reserved.",
  "data": {
    "id": 1,
    "customerName": "Nimal Perera",
    "email": "nimal@gmail.com",
    "phone": "0771234567",
    "address": "123 Main St",
    "city": "Colombo",
    "postalCode": "10000",
    "totalAmount": 2089.95,
    "status": "PENDING",
    "createdAt": "2026-03-28T10:00:00.000Z",
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

### Validation Rules
- `customerName`, `phone`, `address`, `city`, `postalCode` — required, non-empty strings
- `email` — required, valid email format
- `items` — non-empty array; each item needs `productId` (positive integer) and `quantity` (positive number)

---

## Inventory Service (Port 5003)

**File:** `inventory-service/index.js`  
**Storage:** In-memory array (resets on restart)

### Default Data (pre-loaded)
```json
[
  { "id": 1, "productId": 1, "productName": "Laptop",   "quantity": 10, "warehouseLocation": "A1" },
  { "id": 2, "productId": 2, "productName": "Mouse",    "quantity": 100, "warehouseLocation": "B3" },
  { "id": 3, "productId": 3, "productName": "Keyboard", "quantity": 50, "warehouseLocation": "B4" }
]
```
> **Note:** The inventory `id` and `productId` are different fields. `productId` links to a product in Product Service.

### All Endpoints

| Method | Direct URL | Gateway URL | Description | Body Required |
|--------|-----------|-------------|-------------|---------------|
| `POST` | `:5003/inventory` | `/api/inventory` | Add new inventory record | `{ productId, productName, quantity, warehouseLocation }` |
| `GET` | `:5003/inventory` | `/api/inventory` | Get all inventory records | — |
| `GET` | `:5003/inventory/:id` | `/api/inventory/{id}` | Get inventory record by ID | — |
| `GET` | `:5003/inventory/check/:productId` | `/api/inventory/check/{productId}` | Check stock availability | optional `?requiredQty=5` |
| `PUT` | `:5003/inventory/:id` | `/api/inventory/{id}` | Fully update an inventory record | `{ productId, productName, quantity, warehouseLocation }` |
| `PATCH` | `:5003/inventory/:id/stock` | `/api/inventory/{id}/stock` | Adjust stock quantity | `{ adjustment: -5 }` |
| `DELETE` | `:5003/inventory/:id` | `/api/inventory/{id}` | Delete an inventory record | — |
| `GET` | `:5003/health` | — | Health check | — |
| `GET` | `:5003/api-docs` | — | Swagger UI (direct) | — |

### Request Body Examples

**POST `/api/inventory`**
```json
{
  "productId": 4,
  "productName": "Wireless Headphones",
  "quantity": 30,
  "warehouseLocation": "C2"
}
```

**PATCH `/api/inventory/{id}/stock`**
```json
{ "adjustment": -5 }
```
> Use **negative** to reduce stock, **positive** to add stock.

**GET `/api/inventory/check/{productId}?requiredQty=2`** — Response
```json
{
  "success": true,
  "available": true,
  "productId": 1,
  "productName": "Laptop",
  "quantity": 10,
  "requiredQty": 2,
  "message": "Sufficient stock available (10 units in stock)"
}
```

### Validation Rules
- `productId` — positive integer; **no duplicates** allowed (one record per product)
- `productName` — required, non-empty string
- `quantity` — non-negative integer
- `warehouseLocation` — required, non-empty string
- `adjustment` — non-zero integer; final stock cannot go below 0

---

## Payment Service (Port 5004)

**File:** `payment-service/index.js`  
**Storage:** In-memory array (starts empty)  
**Calls:** Order Service (`:5002`) via `axios`

### Environment Variables (`payment-service/.env`)
```
PORT=5004
NODE_ENV=development
ORDER_SERVICE_URL=http://localhost:5002
```

### Payment Statuses
| Status | Meaning |
|--------|---------|
| `SUCCESS` | Payment went through (80% chance) |
| `FAILED` | Payment declined (20% chance) |
| `REFUNDED` | Payment was refunded |

### All Endpoints

| Method | Direct URL | Gateway URL | Description | Body Required |
|--------|-----------|-------------|-------------|---------------|
| `POST` | `:5004/payments` | `/api/payments` | Process a payment *(calls Order Service)* | `{ orderId, amount }` |
| `GET` | `:5004/payments` | `/api/payments` | Get all payments | — |
| `GET` | `:5004/payments/:id` | `/api/payments/{id}` | Get payment by ID | — |
| `GET` | `:5004/payments/order/:orderId` | `/api/payments/order/{orderId}` | Get all payments for an order | — |
| `PATCH` | `:5004/payments/:id` | `/api/payments/{id}` | Manually update payment status | `{ status: "REFUNDED" }` |
| `POST` | `:5004/payments/:id/refund` | `/api/payments/{id}/refund` | Refund a successful payment | — |
| `GET` | `:5004/health` | — | Health check | — |
| `GET` | `:5004/api-docs` | — | Swagger UI (direct) | — |

### POST /api/payments — Request Body
```json
{
  "orderId": 1,
  "amount": 2089.95
}
```

### What Happens Inside POST /payments (Step by Step)

```
Client sends POST /api/payments
        │
        ▼ Gateway forwards to Payment Service :5004
        │
        ├─ [Step 1] Validate orderId (integer) and amount (positive number)
        │
        ├─ [Step 2] → GET http://localhost:5002/orders/:orderId
        │             If not found → 400 error "Order not found"
        │
        ├─ [Step 3] Simulate payment (Math.random())
        │             < 0.8  → SUCCESS
        │             >= 0.8 → FAILED
        │
        ├─ [Step 4] Save payment record with status
        │
        └─ [Step 5] → PATCH http://localhost:5002/orders/:orderId/status
                      If SUCCESS → order becomes CONFIRMED
                      If FAILED  → order becomes CANCELLED
```

### POST /payments — Response (Success)
```json
{
  "success": true,
  "message": "Payment successful. Order #1 is now CONFIRMED.",
  "data": {
    "id": 1,
    "orderId": 1,
    "amount": 2089.95,
    "status": "SUCCESS",
    "processedAt": "2026-03-28T10:05:00.000Z"
  }
}
```

### POST /payments — Response (Failed)
```json
{
  "success": false,
  "message": "Payment failed. Order #1 has been CANCELLED.",
  "data": {
    "id": 1,
    "orderId": 1,
    "amount": 2089.95,
    "status": "FAILED",
    "processedAt": "2026-03-28T10:05:00.000Z"
  }
}
```

---

## Service Interconnection Map

```
╔══════════════════════════════════════════════════════════════════╗
║                 FULL INTERCONNECTION DIAGRAM                     ║
╚══════════════════════════════════════════════════════════════════╝

POST /api/orders  ─────────────────────────────────────────────────
Order Service :5002                                                │
    │                                                              │
    ├─[1]──→ GET :5001/products/:productId                         │
    │            ← { id, name, price, stock }                      │
    │            (validates product exists, gets price)            │
    │                                                              │
    ├─[2]──→ GET :5003/inventory/check/:productId?requiredQty=N    │
    │            ← { available: true/false, quantity: N }          │
    │            (checks if enough stock exists)                   │
    │                                                              │
    │   [Order saved: status=PENDING, totalAmount calculated]      │
    │                                                              │
    └─[3]──→ PATCH :5003/inventory/:id/stock { adjustment: -N }   │
                 (deducts ordered qty from inventory)              │
                 (runs for EVERY item in the order)               │
                                                                   │
POST /api/payments ─────────────────────────────────────────────── │
Payment Service :5004                                              │
    │                                                              │
    ├─[1]──→ GET :5002/orders/:orderId                             │
    │            ← { id, status, totalAmount, ... }                │
    │            (ensures the order actually exists)               │
    │                                                              │
    │   [Payment simulated: 80% SUCCESS / 20% FAILED]             │
    │                                                              │
    └─[2]──→ PATCH :5002/orders/:orderId/status                   │
                 { status: "CONFIRMED" }  ← if SUCCESS            │
                 { status: "CANCELLED" }  ← if FAILED             │
```

---

## End-to-End Test Flow

Follow these steps in order to see the full system working together.

### Step 1 — Verify default products exist
```
GET /api/products
```
Expected: Laptop (id:1), Mouse (id:2), Keyboard (id:3) with their stock levels.

---

### Step 2 — Create a new product (optional)
```
POST /api/products
Body:
{
  "name": "Gaming Laptop",
  "price": 1500.00,
  "stock": 5
}
```
Expected: `{ id: 4, name: "Gaming Laptop", price: 1500, stock: 5 }`

---

### Step 3 — Add inventory for the new product
```
POST /api/inventory
Body:
{
  "productId": 4,
  "productName": "Gaming Laptop",
  "quantity": 5,
  "warehouseLocation": "D1"
}
```

---

### Step 4 — Check stock availability
```
GET /api/inventory/check/4?requiredQty=2
```
Expected: `{ available: true, quantity: 5 }`

---

### Step 5 — Place an order ✅ (triggers Product + Inventory calls)
```
POST /api/orders
Body:
{
  "customerName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "phone": "0771234567",
  "address": "123 Main St",
  "city": "Colombo",
  "postalCode": "10000",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```
Expected:
- Order created with `status: "PENDING"`
- `totalAmount` auto-calculated (2×999.99 + 1×1500 = 3499.98)
- Each item enriched with `productName`, `unitPrice`, `subtotal`
- Inventory stock deducted: Laptop → 8, Gaming Laptop → 4

---

### Step 6 — Verify stock was deducted
```
GET /api/inventory
```
Expected: Laptop quantity is now **8** (was 10), Gaming Laptop is now **4** (was 5).

---

### Step 7 — Process payment ✅ (triggers Order Service call)
```
POST /api/payments
Body:
{
  "orderId": 1,
  "amount": 3499.98
}
```
Expected:
- Payment status is `SUCCESS` (80% chance) or `FAILED` (20% chance)
- Order status automatically updated to `CONFIRMED` or `CANCELLED`

---

### Step 8 — Verify order status changed
```
GET /api/orders/1
```
Expected: `status` is now `"CONFIRMED"` or `"CANCELLED"`, not `"PENDING"`.

---

### Step 9 — View payment record
```
GET /api/payments
```
or
```
GET /api/payments/order/1
```
Expected: payment record with `orderId: 1`, `status: "SUCCESS"` or `"FAILED"`.

---

### Step 10 — Refund a successful payment (if SUCCESS)
```
POST /api/payments/1/refund
```
Expected: payment status changes to `REFUNDED`.

---

## Error Test Cases

| Test | Endpoint | Body | Expected Error |
|------|----------|------|---------------|
| Invalid product in order | `POST /api/orders` | `items: [{ productId: 999, quantity: 1 }]` | 400 `Product with ID 999 not found` |
| Too much quantity | `POST /api/orders` | `items: [{ productId: 1, quantity: 999 }]` | 400 `Insufficient stock. Available: 10, Requested: 999` |
| Pay nonexistent order | `POST /api/payments` | `{ orderId: 999, amount: 100 }` | 400 `Order with ID 999 not found` |
| Duplicate inventory | `POST /api/inventory` | `{ productId: 1, ... }` | 409 `Inventory for productId 1 already exists` |
| Refund failed payment | `POST /api/payments/1/refund` | — | 400 `Only successful payments can be refunded` |
| Stock goes negative | `PATCH /api/inventory/1/stock` | `{ adjustment: -999 }` | 400 `Insufficient stock` |
| Missing required field | `POST /api/products` | `{ name: "Test" }` (no price/stock) | 400 `Product price is required` |
| Invalid email | `POST /api/orders` | `email: "notanemail"` | 400 `email must be a valid email format` |

---

## Swagger UI Access

| URL | Description |
|-----|-------------|
| `http://localhost:5000/api-docs` | **Gateway Swagger — all services in one UI (use this)** |
| `http://localhost:5001/api-docs` | Product Service Swagger (direct) |
| `http://localhost:5002/api-docs` | Order Service Swagger (direct) |
| `http://localhost:5003/api-docs` | Inventory Service Swagger (direct) |
| `http://localhost:5004/api-docs` | Payment Service Swagger (direct) |

---

## How to Start All Services

Open **5 separate terminals** and run each command:

```bash
# Terminal 1 — Gateway
cd gateway
npm run dev

# Terminal 2 — Product Service
cd product-service
npm run dev

# Terminal 3 — Order Service
cd order-service
npm run dev

# Terminal 4 — Inventory Service
cd inventory-service
npm run dev

# Terminal 5 — Payment Service
cd payment-service
npm run dev
```

All services must be running at the same time for interconnected features to work.

| Service | Port | Swagger |
|---------|------|---------|
| Gateway | 5000 | http://localhost:5000/api-docs |
| Product | 5001 | http://localhost:5001/api-docs |
| Order | 5002 | http://localhost:5002/api-docs |
| Inventory | 5003 | http://localhost:5003/api-docs |
| Payment | 5004 | http://localhost:5004/api-docs |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | HTTP server framework |
| **axios** | HTTP client for service-to-service calls |
| **http-proxy-middleware** | Gateway request proxying |
| **swagger-ui-express** | Swagger UI rendering |
| **swagger-jsdoc** | Swagger spec from JSDoc (Order Service) |
| **cors** | Cross-origin request support |
| **dotenv** | Environment variable loading |
| **nodemon** | Auto-restart on file changes (dev only) |
| **In-memory arrays** | Data storage (no database) |
