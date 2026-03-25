/**
 * ==============================================================
 * PRODUCT SERVICE - Node.js + Express
 * ==============================================================
 * 
 * PURPOSE:
 * Manage all product operations (CRUD) for the e-commerce system
 * 
 * ENDPOINTS:
 * POST   /products          → Create a new product
 * GET    /products          → Get all products
 * GET    /products/:id      → Get a specific product
 * DELETE /products/:id      → Delete a product
 * 
 * PORT: 5001
 * ==============================================================
 */

// =============== IMPORTS ===============
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// =============== EXPRESS SETUP ===============
const app = express();
const PORT = process.env.PORT || 5001;

// =============== MIDDLEWARE ===============
app.use(cors());
app.use(express.json());

// =============== IN-MEMORY DATABASE ===============
// In real production, this would be a database (MongoDB, PostgreSQL, etc.)
let products = [
  { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
  { id: 2, name: 'Mouse', price: 29.99, stock: 100 },
  { id: 3, name: 'Keyboard', price: 79.99, stock: 50 }
];

// Counter for generating unique IDs
let productIdCounter = 4;

// =============== SWAGGER DOCUMENTATION ===============
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Product Service API',
    version: '1.0.0',
    description: 'Microservice for managing products in the e-commerce system'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Product Service'
    }
  ],
  paths: {
    '/products': {
      post: {
        summary: 'Create a new product',
        tags: ['Products'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Wireless Headphones' },
                  price: { type: 'number', example: 149.99 },
                  stock: { type: 'number', example: 50 }
                },
                required: ['name', 'price', 'stock']
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        price: { type: 'number' },
                        stock: { type: 'number' }
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
        summary: 'Get all products',
        tags: ['Products'],
        responses: {
          200: {
            description: 'List of all products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          name: { type: 'string' },
                          price: { type: 'number' },
                          stock: { type: 'number' }
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
    '/products/{id}': {
      get: {
        summary: 'Get a specific product',
        tags: ['Products'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Product found' },
          404: { description: 'Product not found' }
        }
      },
      delete: {
        summary: 'Delete a product',
        tags: ['Products'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Product deleted successfully' },
          404: { description: 'Product not found' }
        }
      }
    }
  }
};

// =============== VALIDATION FUNCTION ===============
/**
 * Validates product data before creation
 * @param {Object} product - Product object to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateProduct(product) {
  // Check if name exists and is a string
  if (!product.name || typeof product.name !== 'string') {
    return { isValid: false, error: 'Product name is required and must be a string' };
  }

  // Check if name is not empty after trimming
  if (product.name.trim().length === 0) {
    return { isValid: false, error: 'Product name cannot be empty' };
  }

  // Check if price exists and is a positive number
  if (product.price === undefined || product.price === null) {
    return { isValid: false, error: 'Product price is required' };
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    return { isValid: false, error: 'Product price must be a positive number' };
  }

  // Check if stock exists and is a non-negative integer
  if (product.stock === undefined || product.stock === null) {
    return { isValid: false, error: 'Product stock is required' };
  }

  if (!Number.isInteger(product.stock) || product.stock < 0) {
    return { isValid: false, error: 'Product stock must be a non-negative integer' };
  }

  return { isValid: true };
}

// =============== ROUTES ===============

/**
 * SWAGGER ENDPOINT
 * Access Swagger UI at: http://localhost:5001/api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * POST /products
 * Create a new product
 * 
 * Request Body:
 * {
 *   "name": "Product Name",
 *   "price": 99.99,
 *   "stock": 50
 * }
 * 
 * Response: 201 Created
 * {
 *   "success": true,
 *   "message": "Product created successfully",
 *   "data": { id, name, price, stock }
 * }
 */
app.post('/products', (req, res) => {
  try {
    // Extract data from request body
    const { name, price, stock } = req.body;

    // Validate the product data
    const validation = validateProduct({ name, price, stock });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Create new product object
    const newProduct = {
      id: productIdCounter++,
      name: name.trim(),
      price,
      stock
    };

    // Add product to array
    products.push(newProduct);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /products
 * Get all products
 * 
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": [{ id, name, price, stock }, ...]
 * }
 */
app.get('/products', (req, res) => {
  try {
    res.json({
      success: true,
      message: `Retrieved ${products.length} products`,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /products/:id
 * Get a specific product by ID
 * 
 * URL Parameter:
 * - id: Product ID (number)
 * 
 * Response: 200 OK or 404 Not Found
 * {
 *   "success": true,
 *   "data": { id, name, price, stock }
 * }
 */
app.get('/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Validate ID is a number
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product ID must be a number'
      });
    }

    // Find product by ID
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${productId} not found`
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

/**
 * DELETE /products/:id
 * Delete a product by ID
 * 
 * URL Parameter:
 * - id: Product ID (number)
 * 
 * Response: 200 OK or 404 Not Found
 * {
 *   "success": true,
 *   "message": "Product deleted successfully"
 * }
 */
app.delete('/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Validate ID is a number
    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product ID must be a number'
      });
    }

    // Find product index
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Product with ID ${productId} not found`
      });
    }

    // Remove product from array
    const deletedProduct = products.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error: ' + error.message
    });
  }
});

// =============== HEALTH CHECK ENDPOINT ===============
app.get('/health', (req, res) => {
  res.json({
    status: 'Product Service is running',
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
║          PRODUCT SERVICE STARTED ✓                    ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:${PORT}
📚 Swagger Docs:     http://localhost:${PORT}/api-docs
❤️  Health Check:    http://localhost:${PORT}/health

📋 Available Endpoints:
   POST   /products          → Create a new product
   GET    /products          → Get all products
   GET    /products/:id      → Get a specific product
   DELETE /products/:id      → Delete a product

Environment: ${process.env.NODE_ENV}
  `);
});

module.exports = app;
