require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5002;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5001';
const ENABLE_PRODUCT_VALIDATION = process.env.ENABLE_PRODUCT_VALIDATION === 'true';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for orders
let orders = [];
let orderIdCounter = 1;

// Order statuses
const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED'
};

// ============================================
// SWAGGER CONFIGURATION
// ============================================

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'Order Service for Microservices E-Commerce System - Handles order management with full CRUD operations',
      contact: {
        name: 'Order Service Team'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Order: {
          type: 'object',
          required: ['customerName', 'email', 'phone', 'address', 'city', 'postalCode', 'items'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated order ID',
              example: 1
            },
            customerName: {
              type: 'string',
              description: 'Customer full name',
              example: 'Nimal Perera'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Customer email address',
              example: 'nimal@gmail.com'
            },
            phone: {
              type: 'string',
              description: 'Customer phone number',
              example: '0771234567'
            },
            address: {
              type: 'string',
              description: 'Delivery address',
              example: 'Colombo 10'
            },
            city: {
              type: 'string',
              description: 'City name',
              example: 'Colombo'
            },
            postalCode: {
              type: 'string',
              description: 'Postal code',
              example: '10000'
            },
            items: {
              type: 'array',
              description: 'Array of order items',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: {
                    type: 'string',
                    description: 'Product ID',
                    example: 'p001'
                  },
                  quantity: {
                    type: 'integer',
                    minimum: 1,
                    description: 'Quantity of product',
                    example: 2
                  }
                }
              }
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
              description: 'Order status',
              example: 'PENDING'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./index.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validates email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates order input data
 */
const validateOrderInput = (data) => {
  const errors = [];

  // Check required fields
  if (!data.customerName || typeof data.customerName !== 'string' || data.customerName.trim() === '') {
    errors.push('customerName is required and must be a non-empty string');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('email is required and must be a valid email format');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim() === '') {
    errors.push('phone is required and must be a non-empty string');
  }

  if (!data.address || typeof data.address !== 'string' || data.address.trim() === '') {
    errors.push('address is required and must be a non-empty string');
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim() === '') {
    errors.push('city is required and must be a non-empty string');
  }

  if (!data.postalCode || typeof data.postalCode !== 'string' || data.postalCode.trim() === '') {
    errors.push('postalCode is required and must be a non-empty string');
  }

  // Validate items array
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('items must be a non-empty array');
  } else {
    // Validate each item
    data.items.forEach((item, index) => {
      if (!item.productId || typeof item.productId !== 'string') {
        errors.push(`items[${index}].productId is required and must be a string`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`items[${index}].quantity must be a positive integer`);
      }
    });
  }

  return errors;
};

/**
 * Validates product existence by calling product-service
 */
const validateProduct = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
    return response.data.success === true;
  } catch (error) {
    // Product not found or service unavailable
    return false;
  }
};

// ============================================
// API ENDPOINTS
// ============================================

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the Order Service is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 service:
 *                   type: string
 *                   example: Order Service
 *                 timestamp:
 *                   type: string
 *                   example: 2024-03-26T10:30:00.000Z
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Order Service',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order with validation and product verification
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, email, phone, address, city, postalCode, items]
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Nimal Perera
 *               email:
 *                 type: string
 *                 example: nimal@gmail.com
 *               phone:
 *                 type: string
 *                 example: '0771234567'
 *               address:
 *                 type: string
 *                 example: Colombo 10
 *               city:
 *                 type: string
 *                 example: Colombo
 *               postalCode:
 *                 type: string
 *                 example: '10000'
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: p001
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 */
app.post('/orders', async (req, res) => {
  try {
    // Validate input
    const validationErrors = validateOrderInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validationErrors
      });
    }

    // Optional: Validate products exist (basic simulation)
    // Only runs if ENABLE_PRODUCT_VALIDATION is set to true in .env
    if (ENABLE_PRODUCT_VALIDATION) {
      for (const item of req.body.items) {
        const productExists = await validateProduct(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            error: `Product with ID ${item.productId} not found`
          });
        }
      }
    }

    // Create new order
    const newOrder = {
      id: orderIdCounter++,
      customerName: req.body.customerName.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      address: req.body.address.trim(),
      city: req.body.city.trim(),
      postalCode: req.body.postalCode.trim(),
      items: req.body.items,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieves a list of all orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 */
app.get('/orders', (req, res) => {
  try {
    const { status } = req.query;

    // Filter by status if provided
    let filteredOrders = orders;
    if (status) {
      if (!Object.values(ORDER_STATUS).includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${Object.values(ORDER_STATUS).join(', ')}`
        });
      }
      filteredOrders = orders.filter(order => order.status === status.toUpperCase());
    }

    res.status(200).json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves a single order by its ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID. Must be a number'
      });
    }

    const order = orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     description: Updates order details including customer information and items
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error
 */
app.put('/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID. Must be a number'
      });
    }

    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Validate input
    const validationErrors = validateOrderInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: validationErrors
      });
    }

    // Optional: Validate products exist
    // Only runs if ENABLE_PRODUCT_VALIDATION is set to true in .env
    if (ENABLE_PRODUCT_VALIDATION) {
      for (const item of req.body.items) {
        const productExists = await validateProduct(item.productId);
        if (!productExists) {
          return res.status(400).json({
            success: false,
            error: `Product with ID ${item.productId} not found`
          });
        }
      }
    }

    // Update order (preserve id, status, and createdAt)
    const updatedOrder = {
      ...orders[orderIndex],
      customerName: req.body.customerName.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      address: req.body.address.trim(),
      city: req.body.city.trim(),
      postalCode: req.body.postalCode.trim(),
      items: req.body.items
    };

    orders[orderIndex] = updatedOrder;

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Removes an order from the system
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Order deleted successfully
 *       404:
 *         description: Order not found
 */
app.delete('/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order ID. Must be a number'
      });
    }

    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Remove order from array
    orders.splice(orderIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 Order Service is running on http://localhost:${PORT}`);
  console.log(`📚 Swagger API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Product validation: ${ENABLE_PRODUCT_VALIDATION ? 'ENABLED' : 'DISABLED'}`);
  if (!ENABLE_PRODUCT_VALIDATION) {
    console.log(`⚠️  Product validation is disabled. Orders can be created without checking Product Service.`);
  }
});
