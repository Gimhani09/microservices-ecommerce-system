# API Gateway

Central entry point for all microservices in the e-commerce system.

## Overview

The API Gateway acts as a reverse proxy, routing requests to the appropriate microservices. It provides a unified interface for clients and handles cross-cutting concerns like logging and error handling.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **Documentation**: Swagger/OpenAPI

## Features

- Single entry point for all microservices
- Request routing and forwarding
- Method preservation (GET, POST, DELETE, etc.)
- Header and body forwarding
- Comprehensive error handling
- Service unavailable detection (503)
- Request logging middleware
- Swagger API documentation
- Health check endpoint
- Modular route organization

## Architecture

```
Client Request
      ↓
  API Gateway (Port 5000)
      ↓
  ┌─────────┬──────────┬───────────┬──────────┐
  ↓         ↓          ↓           ↓          ↓
Products  Orders  Inventory  Payments  (More...)
:5001     :5002     :5003      :5004
```

## Installation

```bash
# Navigate to gateway directory
cd gateway

# Install dependencies
npm install
```

## Configuration

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development

# Microservice URLs
PRODUCT_SERVICE_URL=http://localhost:5001
ORDER_SERVICE_URL=http://localhost:5002
INVENTORY_SERVICE_URL=http://localhost:5003
PAYMENT_SERVICE_URL=http://localhost:5004
```

## Running the Gateway

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The gateway will start on **PORT 5000**

## API Routes

### Product Service Routes
```
GET    /api/products           → Get all products
POST   /api/products           → Create a product
GET    /api/products/:id       → Get product by ID
DELETE /api/products/:id       → Delete product
```

### Order Service Routes
```
GET    /api/orders             → Get all orders
POST   /api/orders             → Create an order
GET    /api/orders/:id         → Get order by ID
DELETE /api/orders/:id         → Delete order
```

### Inventory Service Routes
```
GET    /api/inventory          → Get inventory
POST   /api/inventory          → Update inventory
GET    /api/inventory/:id      → Get inventory by product ID
```

### Payment Service Routes
```
GET    /api/payments           → Get all payments
POST   /api/payments           → Process a payment
GET    /api/payments/:id       → Get payment by ID
```

### System Routes
```
GET    /health                 → Gateway health check
GET    /api-docs               → Swagger documentation
```

## Testing with cURL

### Test Gateway Health
```bash
curl http://localhost:5000/health
```

### Create Product (via Gateway)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "stock": 10
  }'
```

### Get All Products (via Gateway)
```bash
curl http://localhost:5000/api/products
```

### Get Product by ID (via Gateway)
```bash
curl http://localhost:5000/api/products/1
```

### Process Payment (via Gateway)
```bash
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 101,
    "amount": 299.99
  }'
```

### Get All Payments (via Gateway)
```bash
curl http://localhost:5000/api/payments
```

## Error Handling

### Service Unavailable (503)
When a microservice is down or unreachable:
```json
{
  "success": false,
  "error": "Product Service unavailable",
  "message": "Unable to reach Product Service. Please ensure it is running."
}
```

### Route Not Found (404)
When accessing a non-existent route:
```json
{
  "success": false,
  "error": "Route not found",
  "path": "/api/unknown",
  "method": "GET",
  "message": "The requested endpoint does not exist"
}
```

### Internal Server Error (500)
For unexpected errors:
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Error details..."
}
```

## Documentation

Access interactive Swagger documentation:
```
http://localhost:5000/api-docs
```

## Request Flow

1. Client sends request to Gateway
2. Gateway logs the request
3. Gateway routes to appropriate service
4. Gateway forwards method, headers, and body
5. Service processes request
6. Gateway returns service response to client
7. If service unavailable, Gateway returns 503

## Modular Route Structure

Routes are organized in separate files:
- `routes/productRoutes.js` - Product service forwarding
- `routes/orderRoutes.js` - Order service forwarding
- `routes/inventoryRoutes.js` - Inventory service forwarding
- `routes/paymentRoutes.js` - Payment service forwarding

Each route handler:
- Constructs target URL
- Preserves HTTP method
- Forwards headers and body
- Handles service errors
- Returns appropriate status codes

## Running the Full System

1. Start Product Service:
```bash
cd product-service && npm run dev
```

2. Start Payment Service:
```bash
cd payment-service && npm run dev
```

3. Start API Gateway:
```bash
cd gateway && npm run dev
```

4. Access via Gateway:
```
http://localhost:5000/api-docs
```

## Monitoring

The gateway logs all incoming requests:
```
[2026-03-26T10:30:00.000Z] GET /api/products
[2026-03-26T10:30:01.000Z] POST /api/payments
```

## Future Enhancements

- Authentication & Authorization
- Rate limiting
- Request/Response caching
- Load balancing
- Circuit breaker pattern
- Request/Response transformation
- Analytics and monitoring
- API versioning support
