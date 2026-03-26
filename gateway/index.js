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
 * /api/payment/*   → Payment Service alias (backward compatibility)
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
          summary: 'Get all products via gateway',
          responses: { '200': { description: 'Products returned from Product Service' } }
        },
        post: {
          tags: ['Products'],
          summary: 'Create product via gateway',
          responses: { '201': { description: 'Product created in Product Service' } }
        }
      },
      '/api/products/{id}': {
        get: {
          tags: ['Products'],
          summary: 'Get product by id via gateway',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: { '200': { description: 'Product returned' }, '404': { description: 'Product not found' } }
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete product by id via gateway',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
          ],
          responses: { '200': { description: 'Product deleted' }, '404': { description: 'Product not found' } }
        }
      },
      '/api/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Get orders via gateway',
          responses: { '200': { description: 'Forwarded to Order Service' } }
        },
        post: {
          tags: ['Orders'],
          summary: 'Create order via gateway',
          responses: { '200': { description: 'Forwarded to Order Service' } }
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
        post: {
          tags: ['Payment'],
          summary: 'Process payment via gateway',
          responses: { '200': { description: 'Forwarded to Payment Service' } }
        }
      },
      '/api/payment': {
        post: {
          tags: ['Payment'],
          summary: 'Process payment via gateway (alias)',
          responses: { '200': { description: 'Forwarded to Payment Service' } }
        }
      }
    }
  },
  apis: []
});

// =============== MIDDLEWARE ===============
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============== REQUEST LOGGING MIDDLEWARE ===============
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// =============== MICROSERVICES CONFIGURATION ===============
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
    path: '/api/payments',
    aliasPath: '/api/payment'
  }
};

// =============== REQUEST STATISTICS ===============
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
function createServiceProxy(serviceName, targetUrl, rewritePath) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: rewritePath || ((path) => path.replace(/^\/api/, '')),
    onProxyReq: () => {
      console.log(`  -> Forwarding to ${serviceName} service`);
    },
    onProxyRes: (proxyRes) => {
      proxyRes.headers['X-Gateway'] = 'API Gateway v1.0';
      proxyRes.headers['X-Service'] = serviceName;
    },
    onError: (err, req, res) => {
      console.error(`  x Error routing to ${serviceName}: ${err.message}`);
      res.status(503).json({
        success: false,
        error: `Service '${serviceName}' is unavailable`,
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });
}

function incrementStats(serviceKey) {
  return (req, res, next) => {
    requestStats.total += 1;
    requestStats.byService[serviceKey] += 1;
    next();
  };
}

// =============== ROOT ENDPOINT ===============
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

// =============== HEALTH CHECK ENDPOINT ===============
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: PORT,
    timestamp: new Date().toISOString(),
    routes: {
      products: `${services.product.path}/*`,
      orders: `${services.order.path}/*`,
      inventory: `${services.inventory.path}/*`,
      payments: `${services.payment.path}/*`,
      paymentAlias: `${services.payment.aliasPath}/*`
    }
  });
});

// =============== DOCUMENTATION ENDPOINT ===============
app.get('/docs', (req, res) => {
  res.json({
    title: 'E-Commerce Microservices API Gateway',
    version: '1.0.0',
    description: 'Central entry point for all microservices',
    baseUrl: `http://localhost:${PORT}`,
    routes: {
      [services.product.path]: {
        service: services.product.name,
        methods: ['GET', 'POST', 'DELETE']
      },
      [services.order.path]: {
        service: services.order.name,
        methods: ['GET', 'POST']
      },
      [services.inventory.path]: {
        service: services.inventory.name,
        methods: ['GET', 'PUT', 'POST']
      },
      [services.payment.path]: {
        service: services.payment.name,
        methods: ['GET', 'POST']
      },
      [services.payment.aliasPath]: {
        service: `${services.payment.name} (alias)`,
        methods: ['GET', 'POST']
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

app.get('/services', (req, res) => {
  const servicesList = Object.entries(services).map(([key, service]) => ({
    name: service.name,
    path: service.path,
    aliasPath: service.aliasPath || null,
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

app.get('/stats', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    totalRequests: requestStats.total,
    requestsByService: requestStats.byService
  });
});

// =============== SERVICE PROXY ROUTES ===============
app.use(services.product.path, incrementStats('product'));
app.use(services.product.path, createServiceProxy('products', services.product.url));

app.use(services.order.path, incrementStats('order'));
app.use(services.order.path, createServiceProxy('orders', services.order.url));

app.use(services.inventory.path, incrementStats('inventory'));
app.use(services.inventory.path, createServiceProxy('inventory', services.inventory.url));

app.use(services.payment.path, incrementStats('payment'));
app.use(services.payment.path, createServiceProxy('payment', services.payment.url));

// Backward-compatible alias: /api/payment/* -> /payments/*
app.use(services.payment.aliasPath, incrementStats('payment'));
app.use(
  services.payment.aliasPath,
  createServiceProxy(
    'payment',
    services.payment.url,
    (path) => path.replace(/^\/api\/payment/, '/payments')
  )
);

// =============== 404 HANDLER ===============
app.use((req, res) => {
  const availablePaths = [
    '/',
    '/docs',
    '/api-docs',
    '/health',
    '/services',
    '/stats',
    services.product.path,
    services.order.path,
    services.inventory.path,
    services.payment.path,
    services.payment.aliasPath
  ];

  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method,
    availablePaths,
    hint: `Try: GET http://localhost:${PORT}/docs for documentation`
  });
});

// =============== START SERVER ===============
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
  /api/payment     → Payment alias (5004)

🚀 QUICK TEST:
  Direct:   curl http://localhost:${PORT}/api/products
  Docs:     curl http://localhost:${PORT}/docs
  Health:   curl http://localhost:${PORT}/health

Environment: ${process.env.NODE_ENV}
`);
});

module.exports = app;
