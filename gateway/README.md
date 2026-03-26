# API Gateway

This is the API Gateway for the Microservices E-Commerce System. It routes requests to the appropriate microservices.

## Features

- Request routing to all microservices
- CORS support
- Health check endpoint
- Error handling and service availability checks

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
PRODUCT_SERVICE_URL=http://localhost:3001
ORDER_SERVICE_URL=http://localhost:3002
INVENTORY_SERVICE_URL=http://localhost:3003
PAYMENT_SERVICE_URL=http://localhost:3004
```

## Installation

```bash
npm install
```

## Running the Service

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Routes

The gateway routes requests to the following services:

- **Product Service**: `http://localhost:3000/api/products/*`
- **Order Service**: `http://localhost:3000/api/orders/*`
- **Inventory Service**: `http://localhost:3000/api/inventory/*`
- **Payment Service**: `http://localhost:3000/api/payments/*`

## Health Check

```bash
GET http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "service": "API Gateway",
  "timestamp": "2026-03-26T10:00:00.000Z"
}
```

## Architecture

The API Gateway uses `http-proxy-middleware` to forward requests to the appropriate microservices based on the URL path.
