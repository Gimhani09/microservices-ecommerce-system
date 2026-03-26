const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs from environment variables
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'API Gateway',
    timestamp: new Date().toISOString()
  });
});

// Route requests to Product Service
app.use('/api/products', createProxyMiddleware({
  target: PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/api/products'
  },
  onError: (err, req, res) => {
    console.error('Product Service Error:', err.message);
    res.status(503).json({ error: 'Product service unavailable' });
  }
}));

// Route requests to Order Service
app.use('/api/orders', createProxyMiddleware({
  target: ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/api/orders'
  },
  onError: (err, req, res) => {
    console.error('Order Service Error:', err.message);
    res.status(503).json({ error: 'Order service unavailable' });
  }
}));

// Route requests to Inventory Service
app.use('/api/inventory', createProxyMiddleware({
  target: INVENTORY_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/inventory': '/api/inventory'
  },
  onError: (err, req, res) => {
    console.error('Inventory Service Error:', err.message);
    res.status(503).json({ error: 'Inventory service unavailable' });
  }
}));

// Route requests to Payment Service
app.use('/api/payments', createProxyMiddleware({
  target: PAYMENT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/payments': '/api/payments'
  },
  onError: (err, req, res) => {
    console.error('Payment Service Error:', err.message);
    res.status(503).json({ error: 'Payment service unavailable' });
  }
}));

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Product Service: ${PRODUCT_SERVICE_URL}`);
  console.log(`Order Service: ${ORDER_SERVICE_URL}`);
  console.log(`Inventory Service: ${INVENTORY_SERVICE_URL}`);
  console.log(`Payment Service: ${PAYMENT_SERVICE_URL}`);
});
