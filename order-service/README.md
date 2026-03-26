# Order Service 📦

A production-quality Order Service for the Microservices E-Commerce System. This service handles all order management operations including creation, updates, status tracking, and inter-service communication with the Product Service.

## 🚀 Features

- **Full CRUD Operations** - Create, Read, Update, Delete orders
- **Data Validation** - Comprehensive input validation with detailed error messages
- **Order Status Management** - Track orders through PENDING, CONFIRMED, CANCELLED states
- **Inter-Service Communication** - Validates products by communicating with Product Service via Axios
- **Swagger Documentation** - Complete API documentation with interactive UI
- **Error Handling** - Robust error handling with consistent response formats
- **CORS Enabled** - Cross-Origin Resource Sharing for API Gateway integration
- **Health Check** - Service health monitoring endpoint

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Product Service running on port 5001 (for product validation)

## 🛠️ Installation

1. **Navigate to order-service directory:**
   ```bash
   cd order-service
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - The `.env` file is already configured with default values
   - Modify if needed:
     ```env
     PORT=5002
     PRODUCT_SERVICE_URL=http://localhost:5001
     INVENTORY_SERVICE_URL=http://localhost:5003
     PAYMENT_SERVICE_URL=http://localhost:5004

     # Product Validation Setting
     # Set to 'true' to enable product validation (requires Product Service running)
     # Set to 'false' to disable (for standalone testing)
     ENABLE_PRODUCT_VALIDATION=false
     ```

   **Important:**
   - By default, `ENABLE_PRODUCT_VALIDATION=false` to allow standalone testing
   - Set to `true` when Product Service is running to validate products exist
   - This prevents the "Product not found" error when testing without Product Service

## 🎯 Running the Service

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The service will start on **http://localhost:5002**

### 🎛️ Two Operation Modes

#### Mode 1: Standalone (Default - Product Validation Disabled)
```env
ENABLE_PRODUCT_VALIDATION=false
```
- **Use case:** Testing Order Service independently without Product Service
- **Behavior:** Orders can be created with any productId (no validation)
- **Best for:** Development, debugging, or when Product Service is unavailable

#### Mode 2: Integrated (Product Validation Enabled)
```env
ENABLE_PRODUCT_VALIDATION=true
```
- **Use case:** Production or full microservices testing
- **Behavior:** Validates each productId exists by calling Product Service
- **Requires:** Product Service must be running on port 5001
- **Best for:** Integration testing and production deployment

## 📚 API Documentation

Once the service is running, access the interactive Swagger documentation at:

**http://localhost:5002/api-docs**

## 🔌 API Endpoints

### Health Check
- **GET** `/health` - Check service status

### Order Management

#### Create Order
- **POST** `/orders`
- **Request Body:**
  ```json
  {
    "customerName": "Nimal Perera",
    "email": "nimal@gmail.com",
    "phone": "0771234567",
    "address": "Colombo 10",
    "city": "Colombo",
    "postalCode": "10000",
    "items": [
      {
        "productId": "p001",
        "quantity": 2
      }
    ]
  }
  ```
- **Response:** `201 Created`

#### Get All Orders
- **GET** `/orders`
- **Query Parameters:**
  - `status` (optional): Filter by PENDING, CONFIRMED, or CANCELLED
- **Response:** `200 OK`

#### Get Order by ID
- **GET** `/orders/:id`
- **Response:** `200 OK` or `404 Not Found`

#### Update Order
- **PUT** `/orders/:id`
- **Request Body:** (same as Create Order)
- **Response:** `200 OK`

#### Delete Order
- **DELETE** `/orders/:id`
- **Response:** `200 OK`

#### Update Order Status
- **PATCH** `/orders/:id/status`
- **Request Body:**
  ```json
  {
    "status": "CONFIRMED"
  }
  ```
- **Valid Statuses:** PENDING, CONFIRMED, CANCELLED
- **Response:** `200 OK`

## 📝 Request/Response Examples

### Example 1: Create an Order

**Request:**
```bash
POST http://localhost:5002/orders
Content-Type: application/json

{
  "customerName": "Saman Silva",
  "email": "saman@gmail.com",
  "phone": "0777654321",
  "address": "Main Street, Kandy",
  "city": "Kandy",
  "postalCode": "20000",
  "items": [
    {
      "productId": "p001",
      "quantity": 3
    },
    {
      "productId": "p002",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customerName": "Saman Silva",
    "email": "saman@gmail.com",
    "phone": "0777654321",
    "address": "Main Street, Kandy",
    "city": "Kandy",
    "postalCode": "20000",
    "items": [
      {
        "productId": "p001",
        "quantity": 3
      },
      {
        "productId": "p002",
        "quantity": 1
      }
    ],
    "status": "PENDING",
    "createdAt": "2024-03-26T10:30:00.000Z"
  }
}
```

### Example 2: Get All Orders

**Request:**
```bash
GET http://localhost:5002/orders
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "customerName": "Saman Silva",
      "email": "saman@gmail.com",
      "phone": "0777654321",
      "address": "Main Street, Kandy",
      "city": "Kandy",
      "postalCode": "20000",
      "items": [...],
      "status": "PENDING",
      "createdAt": "2024-03-26T10:30:00.000Z"
    }
  ]
}
```

### Example 3: Update Order Status

**Request:**
```bash
PATCH http://localhost:5002/orders/1/status
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "customerName": "Saman Silva",
    "email": "saman@gmail.com",
    "status": "CONFIRMED",
    ...
  }
}
```

## ✅ Validation Rules

### Order Creation/Update
- **customerName**: Required, non-empty string
- **email**: Required, valid email format (example@domain.com)
- **phone**: Required, non-empty string
- **address**: Required, non-empty string
- **city**: Required, non-empty string
- **postalCode**: Required, non-empty string
- **items**: Required, non-empty array
  - Each item must have:
    - **productId**: Required string
    - **quantity**: Required positive integer

### Order Status
- Must be one of: `PENDING`, `CONFIRMED`, `CANCELLED`

## 🔄 Inter-Service Communication

The Order Service communicates with other microservices:

1. **Product Service** (Port 5001)
   - Validates product existence before creating/updating orders
   - Endpoint: `GET http://localhost:5001/products/:id`

2. **Inventory Service** (Port 5003) - *Future Integration*
   - Check stock availability
   - Update inventory after order confirmation

3. **Payment Service** (Port 5004) - *Future Integration*
   - Process payments
   - Handle payment status updates

## ⚠️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "details": ["detailed error 1", "detailed error 2"]
}
```

### Common Error Codes:
- **400** - Bad Request (validation errors)
- **404** - Not Found (order doesn't exist)
- **500** - Internal Server Error

## 🧪 Testing with Postman

1. Import the API endpoints from Swagger UI
2. Start the Product Service on port 5001
3. Start the Order Service on port 5002
4. Create a product first (via Product Service)
5. Create an order referencing the product ID
6. Test all CRUD operations

### Sample Test Flow:
```bash
# 1. Check health
GET http://localhost:5002/health

# 2. Create order
POST http://localhost:5002/orders
(with valid JSON body)

# 3. Get all orders
GET http://localhost:5002/orders

# 4. Get specific order
GET http://localhost:5002/orders/1

# 5. Update order status
PATCH http://localhost:5002/orders/1/status
{"status": "CONFIRMED"}

# 6. Update order details
PUT http://localhost:5002/orders/1
(with updated JSON body)

# 7. Delete order
DELETE http://localhost:5002/orders/1
```

## 📊 Order Statuses

| Status | Description |
|--------|-------------|
| **PENDING** | Order created, awaiting confirmation |
| **CONFIRMED** | Order confirmed and being processed |
| **CANCELLED** | Order cancelled by customer or system |

## 🏗️ Architecture

```
Order Service (Port 5002)
    ↓
Express.js Server
    ├── Routes (REST API)
    ├── Validation Layer
    ├── In-Memory Storage
    └── Axios (Inter-Service Communication)
        ↓
Product Service (Port 5001)
```

## 📦 Dependencies

- **express** - Web framework
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **axios** - HTTP client for inter-service communication
- **swagger-ui-express** - Swagger UI
- **swagger-jsdoc** - Swagger specification generator
- **nodemon** - Development auto-reload (dev dependency)

## 🔐 Security Considerations

- Input validation prevents invalid data
- Email format validation
- Positive integer validation for quantities
- Product existence verification
- Consistent error messages (no sensitive info leakage)

## 🚀 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Authentication & Authorization
- [ ] Order history tracking
- [ ] Payment integration
- [ ] Inventory verification before order creation
- [ ] Email notifications
- [ ] Order total calculation
- [ ] Pagination for order list
- [ ] Search and filtering capabilities
- [ ] Rate limiting

## 📝 Notes

- This service uses in-memory storage (data resets on restart)
- For production, integrate a persistent database
- Product validation requires Product Service to be running
- All timestamps are in ISO 8601 format

## 👥 Team

**Order Service Team**
MTIT Microservices E-Commerce System
Academic Project

## 📄 License

ISC

---

**🎓 Academic Project** | Modern Topics in IT | Microservices Architecture
