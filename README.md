# MTIT Microservices E-Commerce System

A professional microservices-based e-commerce system built with Node.js and Express.

## 📁 Project Structure

```
├── gateway/                  # API Gateway (Port 5000)
├── product-service/          # Product Service (Port 5001)
├── order-service/            # Order Service (Port 5002)
├── inventory-service/        # Inventory Service (Port 5003)
└── payment-service/          # Payment Service (Port 5004)
```

## 🏗️ Architecture

```
Client (Postman)
        ↓
API Gateway (Port 5000)
        ↓
    ┌───┬───┬───┬───┐
    ↓   ↓   ↓   ↓   
 5001 5002 5003 5004
  Prod Ord Invent Pay
```

## 🔀 Git Branches

| Member           | Branch                    | Service             |
|------------------|---------------------------|---------------------|
| Member 1         | `feature/product-service` | Product Service     |
| Member 2         | `feature/order-service`   | Order Service       |
| Member 3         | `feature/inventory-service` | Inventory Service |
| Member 4         | `feature/gateway-payment` | Gateway + Payment   |

## 🚀 Services Overview

### Product Service (Port 5001)
- Manage products
- CRUD operations
- Swagger documentation

### Order Service (Port 5002)
- Handle orders
- Integrates with Inventory & Payment services
- Inter-service communication via Axios

### Inventory Service (Port 5003)
- Manage stock levels
- Update inventory after orders
- Validate stock availability

### Payment Service (Port 5004)
- Process payments
- Return transaction details

### API Gateway (Port 5000)
- Route requests to all services
- Single entry point

## 📋 Tech Stack

- Node.js + Express
- Swagger (swagger-ui-express)
- Axios (HTTP client)
- dotenv (environment variables)
- Nodemon (development)

---

**Assignment Project** | Microservices Architecture
