/**
 * ==============================================================
 * API GATEWAY - Node.js + Express + HTTP Proxy Middleware
 * ==============================================================
 * 
 * PURPOSE:
 * Single entry point for all microservices
 * Routes requests to appropriate services
 * Centralizes cross-cutting concerns
 * 
 * ROUTES:
 * /api/products/*  → Product Service (5001)
 * /api/orders/*    → Order Service (5002)
 * /api/inventory/* → Inventory Service (5003)
 * /api/payments/*  → Payment Service (5004)
 * /docs            → API Documentation
 * /health          → Gateway health check
 * 
 * PORT: 5000
 * ==============================================================
 */

// =============== IMPORTS ===============
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

// =============== EXPRESS SETUP ===============
const app = express();
const PORT = process.env.PORT || 5000;

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Gateway',
      version: '1.0.0',
      description: 'Gateway routes client requests to all microservices'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local Gateway'
      }
    ],
    tags: [
      { name: 'Gateway', description: 'Gateway utility endpoints' },
      { name: 'Products', description: 'Product routes through gateway' },
      { name: 'Orders', description: 'Order routes through gateway' },
      { name: 'Inventory', description: 'Inventory routes through gateway' },
      { name: 'Payment', description: 'Payment routes through gateway' }
    ],
    paths: {
      '/': {
        get: {
          tags: ['Gateway'],
          summary: 'Gateway welcome endpoint',
          responses: { '200': { description: 'Gateway info returned' } }
        }
      },
      '/health': {
        get: {
          tags: ['Gateway'],
          summary: 'Gateway health status',
          responses: { '200': { description: 'Gateway health returned' } }
        }
      },
      '/services': {
        get: {
          tags: ['Gateway'],
          summary: 'List configured services',
          responses: { '200': { description: 'Service list returned' } }
        }
      },
      '/stats': {
        get: {
          tags: ['Gateway'],
          summary: 'Gateway request statistics',
          responses: { '200': { description: 'Statistics returned' } }
        }
      },
      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Get all products',
          description: 'Retrieve list of all products via gateway',
          responses: { '200': { description: 'List of products' } }
        },
        post: {
          tags: ['Products'],
          summary: 'Create new product',
          description: 'Create a new product (requires: name, price, stock)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'price', 'stock'],
                  properties: {
                    name: { type: 'string', example: 'Laptop' },
                    price: { type: 'number', example: 899.99 },
                    stock: { type: 'integer', example: 10 }
                  }
                }
              }
            }
          },
          responses: { '201': { description: 'Product created' }, '400': { description: 'Invalid input' } }
        }
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Product details' }, '404': { description: 'Product not found' } }
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete product',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Product deleted' }, '404': { description: 'Product not found' } }
        }
      },
      '/api/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get all orders',
          description: 'Retrieve list of all orders',
          responses: { '200': { description: 'List of orders' } }
        },
        post: {
          tags: ['Orders'],
          summary: 'Create new order',
          description: 'Place a new order (requires: customerName, email, phone, address, city, postalCode, items)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['customerName', 'email', 'phone', 'address', 'city', 'postalCode', 'items'],
                  properties: {
                    customerName: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    phone: { type: 'string', example: '0771234567' },
                    address: { type: 'string', example: '123 Main St' },
                    city: { type: 'string', example: 'Colombo' },
                    postalCode: { type: 'string', example: '10000' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['productId', 'quantity'],
                        properties: {
                          productId: { type: 'string', example: 'p001' },
                          quantity: { type: 'integer', example: 2, minimum: 1 }
                        }
                      },
                      example: [{ productId: 'p001', quantity: 2 }]
                    }
                  }
                }
              }
            }
          },
          responses: { '201': { description: 'Order created' }, '400': { description: 'Invalid input' } }
        }
      },
      '/api/orders/{id}': {
        get: {
          tags: ['Orders'],
          summary: 'Get order by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Order details' }, '404': { description: 'Order not found' } }
        },
        put: {
          tags: ['Orders'],
          summary: 'Update order',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    customerName: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    phone: { type: 'string', example: '0771234567' },
                    address: { type: 'string', example: '123 Main St' },
                    city: { type: 'string', example: 'Colombo' },
                    postalCode: { type: 'string', example: '10000' },
                    items: { type: 'array', items: { type: 'object' }, example: [{ productId: 'p001', quantity: 2 }] },
                    status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'] }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Order updated' }, '404': { description: 'Order not found' } }
        },
        delete: {
          tags: ['Orders'],
          summary: 'Delete order',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { '200': { description: 'Order deleted' }, '404': { description: 'Order not found' } }
        }
      },
      '/api/orders/{id}/status': {
        patch: {
          tags: ['Orders'],
          summary: 'Update order status',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          description: 'Update order status (e.g., pending, confirmed, shipped)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', example: 'confirmed', enum: ['pending', 'confirmed', 'shipped', 'delivered'] }
                  }
                }
              }
            }
          },
          responses: { '200': { description: 'Status updated' }, '404': { description: 'Order not found' } }
        }
      },
      '/api/inventory': {
        get: {
          tags: ['Inventory'],
          summary: 'Get inventory via gateway',
          responses: { '200': { description: 'Forwarded to Inventory Service' } }
        }
      },
      '/api/payments': {
        get: {
          tags: ['Payment'],
          summary: 'Get all payments',
          responses: { '200': { description: 'List of payments' } }
        },
        post: {
          tags: ['Payment'],
          summary: 'Process payment',
          description: 'Process a new payment transaction',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'orderId', 'method'],
                  properties: {
                    amount: { type: 'number', example: 99.99 },
                    orderId: { type: 'integer', example: 1 },
                    method: { type: 'string', example: 'credit_card', enum: ['credit_card', 'debit_card', 'paypal'] },
                    status: { type: 'string', example: 'completed', enum: ['pending', 'completed', 'failed'] }
                  }
                }
              }
            }
          },
          responses: { '201': { description: 'Payment processed' }, '400': { description: 'Invalid payment data' } }
        }
      },
      '/api/payments/{id}': {
        get: {
          tags: ['Payment'],
          summary: 'Get payment by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Payment details' }, '404': { description: 'Payment not found' } }
        }
      }
    }
  },
  apis: []
});

// =============== MIDDLEWARE ===============
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============== REQUEST LOGGING MIDDLEWARE ===============
/**
 * Logs all incoming requests for monitoring and debugging
 */
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =============== MICROSERVICES CONFIGURATION ===============
/**
 * Configuration for all microservices
 * Each service is defined with its URL and routing path
 */
const services = {
  product: {
    name: 'Product Service',
    url: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5001',
    path: '/api/products'
  },
  order: {
    name: 'Order Service',
    url: process.env.ORDER_SERVICE_URL || 'http://localhost:5002',
    path: '/api/orders'
  },
  inventory: {
    name: 'Inventory Service',
    url: process.env.INVENTORY_SERVICE_URL || 'http://localhost:5003',
    path: '/api/inventory'
  },
  payment: {
    name: 'Payment Service',
    url: process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004',
    path: '/api/payments'
  }
};

// =============== REQUEST STATISTICS ===============
/**
 * Track request counts per service
 */
const requestStats = {
  total: 0,
  byService: {
    product: 0,
    order: 0,
    inventory: 0,
    payment: 0
  }
};

// =============== PROXY CONFIGURATION FUNCTION ===============
/**
 * Creates a proxy middleware with error handling
 * @param {string} serviceName - Name of the service
 * @param {string} targetUrl - Target service URL
 */
function createServiceProxy(serviceName, targetUrl) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    timeout: 30000, // 30 second timeout
    proxyTimeout: 30000,
    pathRewrite: (path) => {
      // Preserve resource path by only removing the /api prefix.
      // e.g., /api/products/1 -> /products/1
      return path.replace(/^\/api/, '');
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log proxy request
      console.log(`  ↳ Forwarding to ${serviceName} service`);

      // Re-send JSON body because express.json() consumes the stream before proxying
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add gateway headers
      proxyRes.headers['X-Gateway'] = 'API Gateway v1.0';
      proxyRes.headers['X-Service'] = serviceName;
    },
    onError: (err, req, res) => {
      console.error(`  ✗ Error routing to ${serviceName}: ${err.message}`);
      res.status(503).json({
        success: false,
        error: `Service '${serviceName}' is unavailable`,
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

// =============== ROOT ENDPOINT ===============

/**
 * Gateway Welcome Endpoint
 */
app.get('/', (req, res) => {
  res.json({
    title: 'E-Commerce Microservices API Gateway',
    version: '1.0.0',
    status: 'running',
    port: PORT,
    message: 'Welcome to the API Gateway',
    baseUrl: `http://localhost:${PORT}`,
    
    quickStart: {
      'Get Products': `GET http://localhost:${PORT}/api/products`,
      'Create Product': `POST http://localhost:${PORT}/api/products`,
      'Gateway Swagger UI': `GET http://localhost:${PORT}/api-docs`,
      'Gateway Docs': `GET http://localhost:${PORT}/docs`,
      'Check Health': `GET http://localhost:${PORT}/health`,
      'View Services': `GET http://localhost:${PORT}/services`
    }
  });
});

// =============== HEALTH CHECK ENDPOINTS ===============

/**
 * Gateway Health Check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: PORT,
    timestamp: new Date().toISOString(),
    routes: {
      products: `${services.product.path}/*`,
      orders: `${services.order.path}/*`,
      inventory: `${services.inventory.path}/*`,
      payment: `${services.payment.path}/*`
    }
  });
});

// =============== DOCUMENTATION ENDPOINT ===============

/**
 * Gateway API Documentation
 */
app.get('/docs', (req, res) => {
  res.json({
    title: 'E-Commerce Microservices API Gateway',
    version: '1.0.0',
    description: 'Central entry point for all microservices',
    baseUrl: `http://localhost:${PORT}`,

    routes: {
      '/api/products': {
        service: 'Product Service',
        port: 5001,
        methods: ['GET', 'POST', 'DELETE'],
        endpoints: [
          {
            method: 'GET',
            path: '/api/products',
            description: 'Get all products'
          },
          {
            method: 'GET',
            path: '/api/products/:id',
            description: 'Get a specific product'
          },
          {
            method: 'POST',
            path: '/api/products',
            description: 'Create a new product',
            body: { name: 'string', price: 'number', stock: 'number' }
          },
          {
            method: 'DELETE',
            path: '/api/products/:id',
            description: 'Delete a product'
          }
        ]
      }
    },

    utilities: {
      '/': 'Gateway welcome page',
      '/api-docs': 'Swagger UI documentation',
      '/health': 'Check gateway health status',
      '/docs': 'API documentation (this page)',
      '/services': 'List all services',
      '/stats': 'Request statistics'
    }
  });
});

/**
 * Alias docs endpoint for assignment compatibility
 */
app.get('/api-docs', (req, res) => {
  res.redirect('/docs');
});

/**
 * Services List Endpoint
 */
app.get('/services', (req, res) => {
  const servicesList = Object.entries(services).map(([key, service]) => ({
    name: service.name,
    path: service.path,
    url: service.url
  }));

  res.json({
    gateway: {
      url: `http://localhost:${PORT}`,
      status: 'running'
    },
    services: servicesList
  });
});

/**
 * Statistics Endpoint
 */
app.get('/stats', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    totalRequests: requestStats.total,
    requestsByService: requestStats.byService
  });
});

// =============== SERVICE PROXY ROUTES ===============

/**
 * Product Service Routes
 * All requests to /api/products/* are proxied to Product Service on 5001
 */
app.use('/api/products', (req, res, next) => {
  requestStats.total++;
  requestStats.byService.product++;
  next();
});
app.use('/api/products', createServiceProxy('products', services.product.url));

/**
 * Order Service Routes
 * All requests to /api/orders/* are proxied to Order Service on 5002
 */
app.use('/api/orders', (req, res, next) => {
  requestStats.total++;
  requestStats.byService.order++;
  next();
});
app.use('/api/orders', createServiceProxy('orders', services.order.url));

/**
 * Inventory Service Routes
 * All requests to /api/inventory/* are proxied to Inventory Service on 5003
 */
app.use('/api/inventory', (req, res, next) => {
  requestStats.total++;
  requestStats.byService.inventory++;
  next();
});
app.use('/api/inventory', createServiceProxy('inventory', services.inventory.url));

/**
 * Payment Service Routes
 * All requests to /api/payments/* are proxied to Payment Service on 5004
 */
app.use('/api/payments', (req, res, next) => {
  requestStats.total++;
  requestStats.byService.payment++;
  next();
});
app.use('/api/payments', createServiceProxy('payment', services.payment.url));

// =============== 404 HANDLER ===============

/**
 * 404 - Route not found
 */
app.use((req, res) => {
  const availablePaths = [
    '/',
    '/docs',
    '/api-docs',
    '/health',
    '/services',
    '/stats',
    '/api/products',
    '/api/orders',
    '/api/inventory',
    '/api/payments'
  ];

  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availablePaths,
    hint: 'Try: GET http://localhost:' + PORT + '/docs for documentation'
  });
});

// =============== START GATEWAY ===============

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║          API GATEWAY STARTED ✓                        ║
╚═══════════════════════════════════════════════════════╝

🌐 Gateway URL:      http://localhost:${PORT}
📚 Documentation:    http://localhost:${PORT}/docs
❤️  Health Check:    http://localhost:${PORT}/health
📊 Statistics:       http://localhost:${PORT}/stats

🔗 ROUTED SERVICES:
   /api/products    → Product Service (5001)
   /api/orders      → Order Service (5002)
   /api/inventory   → Inventory Service (5003)
   /api/payments    → Payment Service (5004)

🚀 QUICK TEST:
   Direct:   curl http://localhost:${PORT}/api/products
   Docs:     curl http://localhost:${PORT}/docs
   Health:   curl http://localhost:${PORT}/health

Environment: ${process.env.NODE_ENV}
`);
});

module.exports = app;
