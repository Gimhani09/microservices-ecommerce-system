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
 * /api/payment/*   → Payment Service (5004)
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
require('dotenv').config();

// =============== EXPRESS SETUP ===============
const app = express();
const PORT = process.env.PORT || 5000;

// =============== MIDDLEWARE ===============
app.use(cors());
app.use(express.json());

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
    path: '/api/payment'
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
    pathRewrite: (path) => {
      // Preserve resource path by only removing the /api prefix.
      // e.g., /api/products/1 -> /products/1
      return path.replace(/^\/api/, '');
    },
    onProxyReq: (proxyReq, req, res) => {
      // Log proxy request
      console.log(`  ↳ Forwarding to ${serviceName} service`);
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
 * All requests to /api/payment/* are proxied to Payment Service on 5004
 */
app.use('/api/payment', (req, res, next) => {
  requestStats.total++;
  requestStats.byService.payment++;
  next();
});
app.use('/api/payment', createServiceProxy('payment', services.payment.url));

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
    '/api/payment'
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
   /api/payment     → Payment Service (5004)

🚀 QUICK TEST:
   Direct:   curl http://localhost:${PORT}/api/products
   Docs:     curl http://localhost:${PORT}/docs
   Health:   curl http://localhost:${PORT}/health

Environment: ${process.env.NODE_ENV}
`);
});

module.exports = app;
