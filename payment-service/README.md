# Payment Service

Payment processing microservice for the e-commerce system.

## Overview

This service handles all payment operations including processing new payments, retrieving payment history, and checking payment status.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Documentation**: Swagger/OpenAPI
- **Storage**: In-memory (for development)

## Features

- Process payments with simulated success/failure (80% success rate)
- Retrieve all payments
- Get specific payment details
- Input validation
- Comprehensive error handling
- Swagger API documentation
- Health check endpoint

## Installation

```bash
# Navigate to payment-service directory
cd payment-service

# Install dependencies
npm install
```

## Running the Service

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The service will start on **PORT 5004**

## API Endpoints

### Process Payment
```bash
POST /payments
Content-Type: application/json

{
  "orderId": 101,
  "amount": 299.99
}
```

**Response (201 Created):**
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

### Get All Payments
```bash
GET /payments
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Retrieved 5 payments",
  "data": [
    {
      "id": 1,
      "orderId": 101,
      "amount": 299.99,
      "status": "SUCCESS"
    }
  ]
}
```

### Get Payment by ID
```bash
GET /payments/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderId": 101,
    "amount": 299.99,
    "status": "SUCCESS"
  }
}
```

### Health Check
```bash
GET /health
```

**Response (200 OK):**
```json
{
  "status": "Payment Service is running",
  "port": 5004,
  "timestamp": "2026-03-26T10:30:00.000Z"
}
```

## Testing with cURL

### Process a payment
```bash
curl -X POST http://localhost:5004/payments \
  -H "Content-Type: application/json" \
  -d '{"orderId": 101, "amount": 299.99}'
```

### Get all payments
```bash
curl http://localhost:5004/payments
```

### Get specific payment
```bash
curl http://localhost:5004/payments/1
```

### Health check
```bash
curl http://localhost:5004/health
```

## Validation Rules

- **orderId**: Required, must be an integer
- **amount**: Required, must be a positive number

## Payment Status

- `SUCCESS`: Payment processed successfully (80% probability)
- `FAILED`: Payment processing failed (20% probability)

## Documentation

Access interactive Swagger documentation:
```
http://localhost:5004/api-docs
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Amount must be a positive number"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Payment with ID 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error: ..."
}
```

## Environment Variables

Create a `.env` file:
```
PORT=5004
NODE_ENV=development
```

## Integration

This service is designed to be called through the API Gateway:
```
API Gateway → http://localhost:5004/payments
```

## Future Enhancements

- Integration with real payment gateways (Stripe, PayPal)
- Database persistence
- Payment refund functionality
- Transaction history tracking
- Webhook support for payment notifications
