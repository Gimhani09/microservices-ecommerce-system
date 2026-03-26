# Payment Service - Postman Collection Guide

## 📦 Collection Overview

This Postman collection provides comprehensive testing for the Payment Service API with 25+ pre-configured requests.

## 🚀 Quick Start

### 1. Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Payment-Service.postman_collection.json`
5. Click **Import**

### 2. Start the Services

Before testing, ensure services are running:

```bash
# Terminal 1 - Start Payment Service
cd payment-service
npm run dev

# Terminal 2 - Start API Gateway (optional)
cd gateway
npm run dev
```

### 3. Run Tests

Click on any request and hit **Send** button!

---

## 📁 Collection Structure

### 1️⃣ Direct Access (Port 5004)
Test Payment Service directly without going through the gateway.

- **Health Check** - Verify service is running
- **Process Payment - Success** - Standard payment processing
- **Process Payment - Large Amount** - High-value transaction
- **Process Payment - Small Amount** - Low-value transaction
- **Get All Payments** - List all payments
- **Get Payment by ID - Valid** - Retrieve specific payment
- **Get Payment by ID - Not Found** - Test 404 error

### 2️⃣ Via API Gateway (Port 5000)
Test Payment Service through the API Gateway.

- **Gateway Health Check** - Verify gateway is running
- **Process Payment via Gateway** - Create payment through gateway
- **Get All Payments via Gateway** - List via gateway
- **Get Payment by ID via Gateway** - Retrieve via gateway

### 3️⃣ Error Scenarios
Test validation and error handling.

- **Missing Order ID** - Test required field validation
- **Missing Amount** - Test required field validation
- **Negative Amount** - Test positive number validation
- **Zero Amount** - Test non-zero validation
- **Invalid Order ID Type** - Test data type validation
- **Invalid Payment ID** - Test ID format validation
- **Route Not Found** - Test 404 handling

### 4️⃣ Integration Tests
End-to-end testing scenarios.

**Complete Payment Flow:**
- Step 1: Process Payment
- Step 2: Get All Payments
- Step 3: Get Payment by ID

**Multiple Payments Test:**
- Create 3 payments
- Verify all were created

---

## 🎯 Testing Workflows

### Scenario 1: Basic Payment Flow
1. Run **Health Check** → Confirm service is up
2. Run **Process Payment - Success** → Note the payment ID
3. Run **Get All Payments** → Verify payment in list
4. Update ID in **Get Payment by ID** request
5. Run **Get Payment by ID** → Confirm details

### Scenario 2: Gateway Integration
1. Run **Gateway Health Check** → Confirm gateway is up
2. Run **Process Payment via Gateway**
3. Run **Get All Payments via Gateway**
4. Compare with direct service responses

### Scenario 3: Error Handling
1. Run all requests in **Error Scenarios** folder
2. Verify proper error messages
3. Check HTTP status codes (400, 404)

### Scenario 4: Load Testing
1. Run **Multiple Payments Test** folder
2. Use Postman Collection Runner
3. Set iterations to 10+
4. Analyze success/failure rates (should be ~80% success)

---

## 📊 Expected Responses

### ✅ Success Response (201 Created)
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

### ⚠️ Payment Failed (201 Created - but failed status)
```json
{
  "success": false,
  "message": "Payment processing failed",
  "data": {
    "id": 2,
    "orderId": 102,
    "amount": 299.99,
    "status": "FAILED"
  }
}
```

### ❌ Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Amount must be a positive number"
}
```

### ❌ Not Found (404 Not Found)
```json
{
  "success": false,
  "error": "Payment with ID 9999 not found"
}
```

---

## 🔧 Variables

The collection includes environment variables:

- `payment_service_url` = `http://localhost:5004`
- `gateway_url` = `http://localhost:5000`

### To Use Variables in Requests:
```
{{payment_service_url}}/payments
{{gateway_url}}/api/payments
```

---

## 🧪 Using Collection Runner

1. Click **Collections** in Postman
2. Right-click on **Payment Service API**
3. Select **Run collection**
4. Configure:
   - Select folder or entire collection
   - Set iterations (e.g., 10)
   - Set delay between requests (e.g., 100ms)
5. Click **Run Payment Service API**
6. View test results and statistics

### Recommended Runner Tests:

**Test 1: Stress Test**
- Folder: Complete Payment Flow
- Iterations: 20
- Delay: 50ms

**Test 2: Validation Test**
- Folder: Error Scenarios
- Iterations: 1
- Delay: 100ms

**Test 3: Gateway Test**
- Folder: Via API Gateway
- Iterations: 10
- Delay: 100ms

---

## 📝 Tips & Tricks

### 1. Update Payment IDs
After creating payments, update the ID in "Get by ID" requests:
```
http://localhost:5004/payments/1  ← Update this number
```

### 2. Test Payment Status Distribution
Run "Process Payment - Success" 10 times:
- Expected: ~8 SUCCESS, ~2 FAILED (80/20 split)

### 3. Monitor Service Logs
Watch terminal output while running requests to see:
- Request timestamps
- Validation errors
- Payment processing results

### 4. Compare Gateway vs Direct
Run same request both ways:
- Direct: `http://localhost:5004/payments`
- Gateway: `http://localhost:5000/api/payments`

Should produce identical results!

### 5. Chain Requests
Use Postman Tests to extract data:
```javascript
// In "Process Payment" request Tests tab
pm.test("Save Payment ID", function() {
    var jsonData = pm.response.json();
    pm.environment.set("payment_id", jsonData.data.id);
});

// Then use in next request:
// http://localhost:5004/payments/{{payment_id}}
```

---

## 🐛 Troubleshooting

### Service Unavailable Error
```json
{
  "success": false,
  "error": "Payment Service unavailable"
}
```
**Solution:** Ensure Payment Service is running on port 5004

### Connection Refused
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5004`
**Solution:** Start the service with `npm run dev`

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5004`
**Solution:**
```bash
# Windows
netstat -ano | findstr :5004
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5004 | xargs kill -9
```

---

## 📚 Additional Resources

- **Swagger Documentation**: http://localhost:5004/api-docs
- **Gateway Swagger**: http://localhost:5000/api-docs
- **Service Health**: http://localhost:5004/health

---

## 🎓 Learning Path

### Beginner
1. Run Health Check
2. Process a single payment
3. Get all payments

### Intermediate
1. Test all error scenarios
2. Use Collection Runner
3. Test via Gateway

### Advanced
1. Create custom test scripts
2. Set up environment variables
3. Chain requests with variables
4. Build automated test suites

---

## 📦 Exporting Test Results

After running Collection Runner:
1. Click **Export Results**
2. Choose format (JSON/CSV)
3. Use for documentation/reporting

---

## ✅ Pre-flight Checklist

Before running tests:
- [ ] Payment Service running on port 5004
- [ ] API Gateway running on port 5000 (for gateway tests)
- [ ] Postman collection imported
- [ ] No firewall blocking localhost
- [ ] npm dependencies installed

---

Happy Testing! 🚀
