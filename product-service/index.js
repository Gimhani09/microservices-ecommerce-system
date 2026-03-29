/**
 * ==============================================================
 * PRODUCT SERVICE - Node.js + Express
 * ==============================================================
 * 
 * PURPOSE:
 * Manage all product operations (CRUD) for the e-commerce system
 * 
 * ENDPOINTS:
 * POST   /products              → Create a new product
 * GET    /products              → Get all products (supports search/filter)
 * GET    /products/:id          → Get a specific product
 * PUT    /products/:id          → Fully update a product
 * DELETE /products/:id          → Delete a product
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
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    category: 'Electronics',
    description: 'Portable computer for work and study',
    brand: 'TechPro',
    isActive: true
  },
  {
    id: 2,
    name: 'Mouse',
    price: 29.99,
    category: 'Accessories',
    description: 'Wireless ergonomic mouse',
    brand: 'ClickX',
    isActive: true
  },
  {
    id: 3,
    name: 'Keyboard',
    price: 79.99,
    category: 'Accessories',
    description: 'Mechanical keyboard with backlight',
    brand: 'KeyMaster',
    isActive: true
  }
];

// Counter for generating unique IDs
let productIdCounter = 4;

// =============== SWAGGER DOCUMENTATION ===============
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Product Service API',
    version: '1.0.0',
    description: 'Microservice for managing product catalog data (name, price, category, description, brand, isActive). Stock is managed by Inventory Service.'
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
                  category: { type: 'string', example: 'Electronics' },
                  description: { type: 'string', example: 'Over-ear Bluetooth headphones' },
                  brand: { type: 'string', example: 'SoundMax' },
                  isActive: { type: 'boolean', example: true }
                },
                required: ['name', 'price']
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
                        category: { type: 'string' },
                        description: { type: 'string' },
                        brand: { type: 'string' },
                        isActive: { type: 'boolean' }
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
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search by name, category, description, or brand' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category (exact match, case-insensitive)' },
          { name: 'brand', in: 'query', schema: { type: 'string' }, description: 'Filter by brand (exact match, case-insensitive)' },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' }, description: 'Filter active/inactive products' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Filter minimum product price' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Filter maximum product price' }
        ],
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
                          category: { type: 'string' },
                          description: { type: 'string' },
                          brand: { type: 'string' },
                          isActive: { type: 'boolean' }
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
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        responses: {
          200: { description: 'Product found' },
          404: { description: 'Product not found' }
        }
      },
      put: {
        summary: 'Fully update a product',
        tags: ['Products'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                  name:  { type: 'string',  example: 'Laptop Pro' },
                  price: { type: 'number',  example: 1199.99 },
                  category: { type: 'string', example: 'Electronics' },
                  description: { type: 'string', example: 'Upgraded laptop with better performance' },
                  brand: { type: 'string', example: 'TechPro' },
                  isActive: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Product updated successfully' },
          400: { description: 'Invalid input' },
          404: { description: 'Product not found' }
        }
      },
      delete: {
        summary: 'Delete a product',
        tags: ['Products'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'number' } }],
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

  if (product.category !== undefined && typeof product.category !== 'string') {
    return { isValid: false, error: 'Product category must be a string' };
  }

  if (product.description !== undefined && typeof product.description !== 'string') {
    return { isValid: false, error: 'Product description must be a string' };
  }

  if (product.brand !== undefined && typeof product.brand !== 'string') {
    return { isValid: false, error: 'Product brand must be a string' };
  }

  if (product.isActive !== undefined && typeof product.isActive !== 'boolean') {
    return { isValid: false, error: 'Product isActive must be a boolean' };
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
 *   "category": "Electronics",
 *   "description": "Product description",
 *   "brand": "Brand Name",
 *   "isActive": true
 * }
 * 
 * Response: 201 Created
 * {
 *   "success": true,
 *   "message": "Product created successfully",
 *   "data": { id, name, price, category, description, brand, isActive }
 * }
 */
app.post('/products', (req, res) => {
  try {
    // Extract data from request body
    const { name, price, category, description, brand, isActive } = req.body;

    // Validate the product data
    const validation = validateProduct({ name, price, category, description, brand, isActive });
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
      category: (category || 'General').trim(),
      description: (description || '').trim(),
      brand: (brand || 'Generic').trim(),
      isActive: isActive !== undefined ? isActive : true
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
 * Get all products with optional search/filter
 * 
 * Response: 200 OK
 * {
 *   "success": true,
 *   "data": [{ id, name, price }, ...]
 * }
 */
app.get('/products', (req, res) => {
  try {
    const { q, category, brand, isActive, minPrice, maxPrice } = req.query;
    let filteredProducts = [...products];

    if (q) {
      const search = q.toLowerCase();
      filteredProducts = filteredProducts.filter((p) => (
        p.name.toLowerCase().includes(search)
        || p.category.toLowerCase().includes(search)
        || p.description.toLowerCase().includes(search)
        || p.brand.toLowerCase().includes(search)
      ));
    }

    if (category) {
      filteredProducts = filteredProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand) {
      filteredProducts = filteredProducts.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (isActive !== undefined) {
      const activeValue = isActive === 'true';
      filteredProducts = filteredProducts.filter((p) => p.isActive === activeValue);
    }

    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => p.price <= Number(maxPrice));
    }

    res.json({
      success: true,
      message: `Retrieved ${filteredProducts.length} products`,
      filters: { q, category, brand, isActive, minPrice, maxPrice },
      data: filteredProducts
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
 *   "data": { id, name, price, category, description, brand, isActive }
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
 * PUT /products/:id
 * Fully update a product (name, price, category, description, brand, isActive)
 */
app.put('/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Product ID must be a number' });
    }

    const { name, price, category, description, brand, isActive } = req.body;
    const validation = validateProduct({ name, price, category, description, brand, isActive });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Product with ID ${productId} not found` });
    }

    products[index] = {
      id: productId,
      name: name.trim(),
      price,
      category: (category || 'General').trim(),
      description: (description || '').trim(),
      brand: (brand || 'Generic').trim(),
      isActive: isActive !== undefined ? isActive : true
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: products[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

/**
 * DELETE /products/:id
 * Delete a product by ID
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
   POST   /products              → Create a new product
  GET    /products              → Get all products (search/filter supported)
   GET    /products/:id          → Get a specific product
   PUT    /products/:id          → Fully update a product
   DELETE /products/:id          → Delete a product

Environment: ${process.env.NODE_ENV}
  `);
});

module.exports = app;
