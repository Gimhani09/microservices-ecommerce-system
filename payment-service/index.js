/**
 * ==============================================================
 * PAYMENT SERVICE - Node.js + Express
 * ==============================================================
 *
 * PURPOSE:
 * Handle all payment processing for the e-commerce system
 *
 * ENDPOINTS:
 * POST   /payments          → Process a new payment
 * GET    /payments          → Get all payments
 * GET    /payments/:id      → Get a specific payment
 * GET    /health            → Health check
 *
 * PORT: 5004
 * ==============================================================
 */

// =============== IMPORTS ===============
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// =============== EXPRESS SETUP ===============
const app = express();
const PORT = process.env.PORT || 5004;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:5002';

// =============== MIDDLEWARE ===============
app.use(cors());
app.use(express.json());

// =============== IN-MEMORY DATABASE ===============
// In real production, this would be a database (MongoDB, PostgreSQL, etc.)
let payments = [];

// Counter for generating unique IDs
let paymentIdCounter = 1;

const VALID_STATUSES = ['SUCCESS', 'FAILED', 'REFUNDED'];

// =============== SWAGGER DOCUMENTATION ===============
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Payment Service API',
    version: '1.0.0',
    description: 'Microservice for processing payments in the e-commerce system'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Payment Service'
    }
  ],
  paths: {
    '/payments': {
      post: {
        summary: 'Process a new payment',
        description: 'Validates the order, retrieves the order total from Order Service (client-provided amount is ignored for security), then simulates payment processing.',
        tags: ['Payments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  orderId: { type: 'number', example: 1, description: 'ID of the order to pay for' },
                  simulateStatus: {
                    type: 'string',
                    enum: ['SUCCESS', 'FAILED'],
                    example: 'SUCCESS',
                    description: 'Optional: force a specific payment result for demo/testing. Omit to use random (80% success rate).'
                  }
                },
                required: ['orderId']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Payment processed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        orderId: { type: 'number' },
                        amount: { type: 'number' },
                        status: { type: 'string', enum: ['SUCCESS', 'FAILED'] }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid input' }
        }
      },
      get: {
        summary: 'Get all payments',
        tags: ['Payments'],
        responses: {
          200: {
            description: 'List of all payments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          orderId: { type: 'number' },
                          amount: { type: 'number' },
                          status: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/payments/order/{orderId}': {
      get: {
        summary: 'Get payments for an order',
        tags: ['Payments'],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Payments for the order' },
          400: { description: 'Invalid order ID' }
        }
      }
    },
    '/payments/{id}': {
      get: {
        summary: 'Get a specific payment',
        tags: ['Payments'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Payment found' },
          404: { description: 'Payment not found' }
        }
      },
      patch: {
        summary: 'Update payment status',
        tags: ['Payments'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: VALID_STATUSES
                  }
                },
                required: ['status']
              }
            }
          }
        },
        responses: {
          200: { description: 'Payment status updated' },
          400: { description: 'Invalid status or ID' },
          404: { description: 'Payment not found' }
        }
      }
    },
    '/payments/{id}/refund': {
      post: {
        summary: 'Create a refund for a successful payment',
        description: 'MVP scope: this endpoint updates Payment status to REFUNDED only. It does not automatically reverse order fulfillment or inventory.',
        tags: ['Payments'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Refund processed' },
          400: { description: 'Refund not allowed' },
          404: { description: 'Payment not found' }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check endpoint',
        tags: ['System'],
        responses: {
          200: { description: 'Service is running' }
        }
      }
    }
  }
};

// =============== VALIDATION FUNCTION ===============
/**
 * Validates payment data before processing
 * @param {Object} payment - Payment object to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validatePayment(payment) {
  // Check if orderId exists and is a number
  if (payment.orderId === undefined || payment.orderId === null) {
    return { isValid: false, error: 'Order ID is required' };
  }

  if (typeof payment.orderId !== 'number' || !Number.isInteger(payment.orderId)) {
    return { isValid: false, error: 'Order ID must be an integer' };
  }

  return { isValid: true };
}

// =============== PAYMENT PROCESSING SIMULATOR ===============
/**
 * Simulates payment processing.
 * In production, this would integrate with a real payment gateway (Stripe, PayPal, etc.)
 *
 * @param {string|undefined} simulateStatus - Force 'SUCCESS' or 'FAILED' (for demo/testing). If omitted, uses 80% random success.
 * @returns {string} - "SUCCESS" or "FAILED"
 */
function processPayment(simulateStatus) {
  if (simulateStatus === 'SUCCESS' || simulateStatus === 'FAILED') {
    return simulateStatus;
  }
  // 80% success rate
  const random = Math.random();
  return random < 0.8 ? 'SUCCESS' : 'FAILED';
}

function parseIdParam(param) {
  const numericId = parseInt(param, 10);
  return Number.isNaN(numericId) ? null : numericId;
}

function findPaymentById(id) {
  return payments.find(p => p.id === id);
}

/**
 * Checks the Order Service to verify an order exists.
 * Returns { order, serviceDown } where serviceDown=true means service is unreachable.
 */
async function getOrder(orderId) {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/orders/${orderId}`);
    return { order: response.data.success ? response.data.data : null, serviceDown: false };
  } catch (error) {
    if (!error.response) {
      return { order: null, serviceDown: true };
    }
    return { order: null, serviceDown: false };
  }
}

/**
 * Updates order status in Order Service after payment.
 * CONFIRMED for successful payment, CANCELLED for failed.
 */
async function updateOrderStatus(orderId, status) {
  try {
    await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, { status });
  } catch (error) {
    console.error(`Failed to update order ${orderId} status to ${status}:`, error.message);
  }
}

// =============== ROUTES ===============

/**
 * SWAGGER ENDPOINT
 * Access Swagger UI at: http://localhost:5004/api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * POST /payments
 * Process a new payment
 *
 * Request Body:
 * {
 *   "orderId": 101,
 *   "amount": 299.99
 * }
 *
 * Response: 201 Created
 * {
 *   "success": true,
 *   "message": "Payment processed successfully",
 *   "data": { id, orderId, amount, status }
 * }
 */
app.post('/payments', async (req, res) => {
  try {
    // 1. Extract and validate payment data
    const { orderId, simulateStatus } = req.body;

    const validation = validatePayment({ orderId });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Validate simulateStatus if provided
    if (simulateStatus !== undefined && !['SUCCESS', 'FAILED'].includes(simulateStatus)) {
      return res.status(400).json({
        success: false,
        error: 'simulateStatus must be either "SUCCESS" or "FAILED"'
      });
    }

    // 2. Verify the order exists in Order Service and get the authoritative total amount
    const { order, serviceDown } = await getOrder(orderId);
    if (serviceDown) {
      return res.status(503).json({
        success: false,
        error: 'Order Service is currently unavailable. Please try again later.'
      });
    }
    if (!order) {
      return res.status(400).json({
        success: false,
        error: `Order with ID ${orderId} not found in Order Service`
      });
    }

    // Use the verified order total — do NOT trust the client-provided amount
    const amount = order.totalAmount;

    // 3. Simulate payment processing
    const status = processPayment(simulateStatus);

    // 4. Create new payment record
    const newPayment = {
      id: paymentIdCounter++,
      orderId,
      amount,
      status,
      processedAt: new Date().toISOString()
    };

    payments.push(newPayment);

    // 5. Update order status based on payment result
    const orderStatus = status === 'SUCCESS' ? 'CONFIRMED' : 'CANCELLED';
    await updateOrderStatus(orderId, orderStatus);

    res.status(201).json({
      success: status === 'SUCCESS',
      message: status === 'SUCCESS'
        ? `Payment successful. Order #${orderId} is now CONFIRMED.`
        : `Payment failed. Order #${orderId} has been CANCELLED and stock has been restored.`,
      data: newPayment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /payments
 * Get all payments
 *
 * Response: 200 OK
 * {
 *   "success": true,
 *   "message": "Retrieved X payments",
 *   "data": [{ id, orderId, amount, status }, ...]
 * }
 */
app.get('/payments', (req, res) => {
  try {
    res.json({
      success: true,
      message: `Retrieved ${payments.length} payments`,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /payments/order/:orderId
 * Get payments for a specific order
 */
app.get('/payments/order/:orderId', (req, res) => {
  try {
    const orderId = parseIdParam(req.params.orderId);

    if (orderId === null) {
      return res.status(400).json({
        success: false,
        error: 'Order ID must be a number'
      });
    }

    const orderPayments = payments.filter(p => p.orderId === orderId);

    res.json({
      success: true,
      message: `Retrieved ${orderPayments.length} payments for order ${orderId}`,
      data: orderPayments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /payments/:id
 * Get a specific payment by ID
 *
 * URL Parameter:
 * - id: Payment ID (number)
 *
 * Response: 200 OK or 404 Not Found
 * {
 *   "success": true,
 *   "data": { id, orderId, amount, status }
 * }
 */
app.get('/payments/:id', (req, res) => {
  try {
    const paymentId = parseIdParam(req.params.id);

    // Validate ID is a number
    if (paymentId === null) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID must be a number'
      });
    }

    // Find payment by ID
    const payment = findPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: `Payment with ID ${paymentId} not found`
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * PATCH /payments/:id
 * Update payment status
 */
app.patch('/payments/:id', (req, res) => {
  try {
    const paymentId = parseIdParam(req.params.id);
    const { status } = req.body;

    if (paymentId === null) {
      return res.status(400).json({ success: false, error: 'Payment ID must be a number' });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const payment = findPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: `Payment with ID ${paymentId} not found` });
    }

    payment.status = status;

    res.json({
      success: true,
      message: 'Payment status updated',
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

/**
 * POST /payments/:id/refund
 * Mark payment as refunded (only if previously SUCCESS).
 * Scope note: refund updates payment record only.
 */
app.post('/payments/:id/refund', (req, res) => {
  try {
    const paymentId = parseIdParam(req.params.id);
    if (paymentId === null) {
      return res.status(400).json({ success: false, error: 'Payment ID must be a number' });
    }

    const payment = findPaymentById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: `Payment with ID ${paymentId} not found` });
    }

    if (payment.status !== 'SUCCESS') {
      return res.status(400).json({
        success: false,
        error: 'Only successful payments can be refunded'
      });
    }

    payment.status = 'REFUNDED';

    res.json({
      success: true,
      message: 'Payment refunded. MVP scope: order status and inventory are not changed automatically by refund.',
      scope: {
        paymentUpdated: true,
        orderUpdated: false,
        inventoryRestored: false
      },
      data: payment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// =============== HEALTH CHECK ENDPOINT ===============
app.get('/health', (req, res) => {
  res.json({
    status: 'Payment Service is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// =============== ERROR HANDLING ===============
// 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// =============== START SERVER ===============
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║          PAYMENT SERVICE STARTED ✓                    ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:${PORT}
📚 Swagger Docs:     http://localhost:${PORT}/api-docs
❤️  Health Check:    http://localhost:${PORT}/health

📋 Available Endpoints:
   POST   /payments          → Process a new payment
   GET    /payments          → Get all payments
   GET    /payments/:id      → Get a specific payment

Environment: ${process.env.NODE_ENV}
  `);
});

module.exports = app;
