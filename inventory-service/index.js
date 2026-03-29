/**
 * ==============================================================
 * INVENTORY SERVICE - Node.js + Express
 * ==============================================================
 *
 * PURPOSE:
 * Manage all inventory operations for the e-commerce system.
 * Tracks stock levels for each product, supports validation
 * of stock availability, and allows stock adjustments after orders.
 *
 * ENDPOINTS:
 * POST   /inventory                    → Add a new inventory record
 * GET    /inventory                    → Get all inventory records
 * GET    /inventory/:id                → Get a specific inventory record
 * PUT    /inventory/:id                → Update full inventory record
 * PATCH  /inventory/:id/stock          → Adjust stock quantity
 * DELETE /inventory/:id                → Delete an inventory record
 * GET    /inventory/check/:productId   → Check stock availability for a product
 *
 * PORT: 5003
 * ==============================================================
 */

// =============== IMPORTS ===============
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// =============== EXPRESS SETUP ===============
const app = express();
const PORT = process.env.PORT || 5003;

// =============== MIDDLEWARE ===============
app.use(cors());
app.use(express.json());

// =============== IN-MEMORY DATABASE ===============
// In real production, this would be a database (MongoDB, PostgreSQL, etc.)
let inventory = [
  { id: 1, productId: 1, productName: 'Laptop',   quantity: 10, warehouseLocation: 'A1', lastUpdated: new Date().toISOString() },
  { id: 2, productId: 2, productName: 'Mouse',    quantity: 100, warehouseLocation: 'B3', lastUpdated: new Date().toISOString() },
  { id: 3, productId: 3, productName: 'Keyboard', quantity: 50, warehouseLocation: 'B4', lastUpdated: new Date().toISOString() }
];

let inventoryIdCounter = 4;

// =============== SWAGGER DOCUMENTATION ===============
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Service API',
    version: '1.0.0',
    description: 'Microservice for managing inventory and stock levels in the e-commerce system'
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Inventory Service (Direct)'
    },
    {
      url: 'http://localhost:5000',
      description: 'API Gateway'
    }
  ],
  tags: [
    { name: 'Inventory', description: 'Inventory management operations' }
  ],
  paths: {
    '/inventory': {
      post: {
        summary: 'Add a new inventory record',
        tags: ['Inventory'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'productName', 'quantity', 'warehouseLocation'],
                properties: {
                  productId:         { type: 'number',  example: 4 },
                  productName:       { type: 'string',  example: 'Wireless Headphones' },
                  quantity:          { type: 'number',  example: 35 },
                  warehouseLocation: { type: 'string',  example: 'C2' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Inventory record created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/InventoryResponse' }
              }
            }
          },
          400: { description: 'Invalid input' },
          409: { description: 'Inventory record for this productId already exists' }
        }
      },
      get: {
        summary: 'Get all inventory records',
        tags: ['Inventory'],
        responses: {
          200: {
            description: 'List of all inventory records',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count:   { type: 'number' },
                    data:    { type: 'array', items: { $ref: '#/components/schemas/Inventory' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/inventory/check/{productId}': {
      get: {
        summary: 'Check stock availability for a product',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            description: 'Product ID to check stock for',
            schema: { type: 'number' }
          },
          {
            name: 'requiredQty',
            in: 'query',
            required: false,
            description: 'Required quantity to validate availability (default: 1)',
            schema: { type: 'number', example: 5 }
          }
        ],
        responses: {
          200: {
            description: 'Stock availability result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success:     { type: 'boolean' },
                    available:   { type: 'boolean' },
                    productId:   { type: 'number' },
                    productName: { type: 'string' },
                    quantity:    { type: 'number' },
                    message:     { type: 'string' }
                  }
                }
              }
            }
          },
          404: { description: 'No inventory found for this product' }
        }
      }
    },
    '/inventory/{id}': {
      get: {
        summary: 'Get a specific inventory record by ID',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Inventory record found' },
          404: { description: 'Inventory record not found' }
        }
      },
      put: {
        summary: 'Update a full inventory record',
        tags: ['Inventory'],
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
                required: ['productId', 'productName', 'quantity', 'warehouseLocation'],
                properties: {
                  productId:         { type: 'number',  example: 1 },
                  productName:       { type: 'string',  example: 'Laptop Pro' },
                  quantity:          { type: 'number',  example: 20 },
                  warehouseLocation: { type: 'string',  example: 'A2' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Inventory record updated successfully' },
          400: { description: 'Invalid input' },
          404: { description: 'Inventory record not found' }
        }
      },
      delete: {
        summary: 'Delete an inventory record',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'number' }
          }
        ],
        responses: {
          200: { description: 'Inventory record deleted successfully' },
          404: { description: 'Inventory record not found' }
        }
      }
    },
    '/inventory/product/{productId}/stock': {
      patch: {
        summary: 'Adjust stock by product ID (used by Order Service)',
        description: 'Adjust stock for an inventory record identified by productId. Use this when you know the productId rather than the internal inventory ID. Positive adjustment adds stock, negative reduces stock.',
        tags: ['Inventory'],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            description: 'Product ID whose stock to adjust',
            schema: { type: 'number' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['adjustment'],
                properties: {
                  adjustment: {
                    type: 'number',
                    example: -2,
                    description: 'Positive to add stock, negative to reduce stock'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Stock adjusted successfully' },
          400: { description: 'Invalid adjustment or insufficient stock' },
          404: { description: 'No inventory record found for this productId' }
        }
      }
    },
    '/inventory/{id}/stock': {
      patch: {
        summary: 'Adjust stock quantity for an inventory record',
        description: 'Use a positive number to increase stock, negative to decrease (e.g. after an order).',
        tags: ['Inventory'],
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
                required: ['adjustment'],
                properties: {
                  adjustment: {
                    type: 'number',
                    example: -5,
                    description: 'Positive to add stock, negative to reduce stock'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Stock adjusted successfully' },
          400: { description: 'Invalid adjustment or insufficient stock' },
          404: { description: 'Inventory record not found' }
        }
      }
    }
  },
  components: {
    schemas: {
      Inventory: {
        type: 'object',
        properties: {
          id:                { type: 'number',  example: 1 },
          productId:         { type: 'number',  example: 1 },
          productName:       { type: 'string',  example: 'Laptop' },
          quantity:          { type: 'number',  example: 10 },
          warehouseLocation: { type: 'string',  example: 'A1' },
          lastUpdated:       { type: 'string',  format: 'date-time' }
        }
      },
      InventoryResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data:    { $ref: '#/components/schemas/Inventory' }
        }
      }
    }
  }
};

// =============== VALIDATION FUNCTION ===============
/**
 * Validates inventory data before creation / update
 * @param {Object} item - Inventory object to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
function validateInventory(item) {
  if (item.productId === undefined || item.productId === null) {
    return { isValid: false, error: 'productId is required' };
  }
  if (typeof item.productId !== 'number' || !Number.isInteger(item.productId) || item.productId <= 0) {
    return { isValid: false, error: 'productId must be a positive integer' };
  }

  if (!item.productName || typeof item.productName !== 'string' || item.productName.trim().length === 0) {
    return { isValid: false, error: 'productName is required and must be a non-empty string' };
  }

  if (item.quantity === undefined || item.quantity === null) {
    return { isValid: false, error: 'quantity is required' };
  }
  if (!Number.isInteger(item.quantity) || item.quantity < 0) {
    return { isValid: false, error: 'quantity must be a non-negative integer' };
  }

  if (!item.warehouseLocation || typeof item.warehouseLocation !== 'string' || item.warehouseLocation.trim().length === 0) {
    return { isValid: false, error: 'warehouseLocation is required and must be a non-empty string' };
  }

  return { isValid: true };
}

// =============== ROUTES ===============

/**
 * SWAGGER ENDPOINT
 * Access Swagger UI at: http://localhost:5003/api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ---------------------------------------------------------------
// POST /inventory
// Add a new inventory record
// ---------------------------------------------------------------
app.post('/inventory', (req, res) => {
  try {
    const { productId, productName, quantity, warehouseLocation } = req.body;

    // Validate input
    const validation = validateInventory({ productId, productName, quantity, warehouseLocation });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    // Prevent duplicate productId entries
    const existing = inventory.find(i => i.productId === productId);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Inventory record for productId ${productId} already exists. Use PATCH /${existing.id}/stock to adjust stock.`
      });
    }

    const newRecord = {
      id: inventoryIdCounter++,
      productId,
      productName: productName.trim(),
      quantity,
      warehouseLocation: warehouseLocation.trim(),
      lastUpdated: new Date().toISOString()
    };

    inventory.push(newRecord);

    res.status(201).json({
      success: true,
      message: 'Inventory record created successfully',
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// GET /inventory
// Get all inventory records
// ---------------------------------------------------------------
app.get('/inventory', (req, res) => {
  try {
    res.json({
      success: true,
      message: `Retrieved ${inventory.length} inventory records`,
      count: inventory.length,
      data: inventory
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// GET /inventory/check/:productId
// Check stock availability for a specific product
// ---------------------------------------------------------------
app.get('/inventory/check/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'productId must be a number' });
    }

    const requiredQty = parseInt(req.query.requiredQty) || 1;
    const record = inventory.find(i => i.productId === productId);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: `No inventory record found for productId ${productId}`
      });
    }

    const available = record.quantity >= requiredQty;

    res.json({
      success: true,
      available,
      productId: record.productId,
      productName: record.productName,
      quantity: record.quantity,
      requiredQty,
      message: available
        ? `Sufficient stock available (${record.quantity} units in stock)`
        : `Insufficient stock. Requested: ${requiredQty}, Available: ${record.quantity}`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// PATCH /inventory/product/:productId/stock
// Adjust stock by productId (used internally by Order Service)
// ---------------------------------------------------------------
app.patch('/inventory/product/:productId/stock', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'productId must be a number' });
    }

    const { adjustment } = req.body;

    if (adjustment === undefined || adjustment === null) {
      return res.status(400).json({ success: false, error: 'adjustment field is required' });
    }
    if (typeof adjustment !== 'number' || !Number.isInteger(adjustment) || adjustment === 0) {
      return res.status(400).json({ success: false, error: 'adjustment must be a non-zero integer' });
    }

    const index = inventory.findIndex(i => i.productId === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `No inventory record found for productId ${productId}` });
    }

    const newQuantity = inventory[index].quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Current: ${inventory[index].quantity}, Attempted reduction: ${Math.abs(adjustment)}`
      });
    }

    inventory[index].quantity = newQuantity;
    inventory[index].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      message: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)} units`,
      data: inventory[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// GET /inventory/:id
// Get a specific inventory record by ID
// ---------------------------------------------------------------
app.get('/inventory/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Inventory ID must be a number' });
    }

    const record = inventory.find(i => i.id === id);
    if (!record) {
      return res.status(404).json({ success: false, error: `Inventory record with ID ${id} not found` });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// PUT /inventory/:id
// Fully update an inventory record
// ---------------------------------------------------------------
app.put('/inventory/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Inventory ID must be a number' });
    }

    const { productId, productName, quantity, warehouseLocation } = req.body;

    const validation = validateInventory({ productId, productName, quantity, warehouseLocation });
    if (!validation.isValid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Inventory record with ID ${id} not found` });
    }

    // Check if productId is being changed to one that already exists on another record
    const conflict = inventory.find(i => i.productId === productId && i.id !== id);
    if (conflict) {
      return res.status(409).json({
        success: false,
        error: `Another inventory record (ID ${conflict.id}) already uses productId ${productId}`
      });
    }

    inventory[index] = {
      ...inventory[index],
      productId,
      productName: productName.trim(),
      quantity,
      warehouseLocation: warehouseLocation.trim(),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Inventory record updated successfully',
      data: inventory[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// PATCH /inventory/:id/stock
// Adjust the stock quantity (positive = add, negative = reduce)
// ---------------------------------------------------------------
app.patch('/inventory/:id/stock', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Inventory ID must be a number' });
    }

    const { adjustment } = req.body;

    if (adjustment === undefined || adjustment === null) {
      return res.status(400).json({ success: false, error: 'adjustment field is required' });
    }
    if (typeof adjustment !== 'number' || !Number.isInteger(adjustment) || adjustment === 0) {
      return res.status(400).json({ success: false, error: 'adjustment must be a non-zero integer' });
    }

    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Inventory record with ID ${id} not found` });
    }

    const newQuantity = inventory[index].quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Current: ${inventory[index].quantity}, Attempted reduction: ${Math.abs(adjustment)}`
      });
    }

    inventory[index].quantity = newQuantity;
    inventory[index].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      message: `Stock ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)} units`,
      data: inventory[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// ---------------------------------------------------------------
// DELETE /inventory/:id
// Delete an inventory record
// ---------------------------------------------------------------
app.delete('/inventory/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Inventory ID must be a number' });
    }

    const index = inventory.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Inventory record with ID ${id} not found` });
    }

    const deleted = inventory.splice(index, 1);

    res.json({
      success: true,
      message: 'Inventory record deleted successfully',
      data: deleted[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error: ' + error.message });
  }
});

// =============== HEALTH CHECK ENDPOINT ===============
app.get('/health', (req, res) => {
  res.json({
    status: 'Inventory Service is running',
    port: PORT,
    totalRecords: inventory.length,
    timestamp: new Date().toISOString()
  });
});

// =============== 404 HANDLER ===============
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
║          INVENTORY SERVICE STARTED ✓                  ║
╚═══════════════════════════════════════════════════════╝

🔗 Service URL:      http://localhost:${PORT}
📚 Swagger Docs:     http://localhost:${PORT}/api-docs
❤️  Health Check:    http://localhost:${PORT}/health

📋 Available Endpoints:
   POST   /inventory                  → Add a new inventory record
   GET    /inventory                  → Get all inventory records
   GET    /inventory/:id              → Get a specific record
   PUT    /inventory/:id              → Update a full record
   PATCH  /inventory/:id/stock                  → Adjust stock quantity
   PATCH  /inventory/product/:productId/stock  → Adjust stock by product ID
   DELETE /inventory/:id                        → Delete a record
   GET    /inventory/check/:productId           → Check stock availability

Environment: ${process.env.NODE_ENV}
  `);
});

module.exports = app;
