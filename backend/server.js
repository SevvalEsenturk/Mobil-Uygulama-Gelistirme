require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// ===================== Middleware =====================

// CORS — React Native ve localhost erişimi
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON body parser
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ===================== Routes =====================

// Veritabanını başlat (import sırasında tablolar oluşturulur)
require('./config/database');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users', require('./routes/childApps'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/usage', require('./routes/usage'));
app.use('/api/pairing', require('./routes/pairing'));
app.use('/api/pair', require('./routes/pairing'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/app-catalog', require('./routes/appCatalog'));
app.use('/api/permission-logs', require('./routes/permissionLogs'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Kilit API Docs',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Kilit Backend çalışıyor.',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Endpoint bulunamadı: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global hata:', err);
  res.status(500).json({ message: 'Sunucu hatası.' });
});

// ===================== Start Server =====================

app.listen(PORT, () => {
  console.log(`\n🚀 Kilit Backend çalışıyor: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/api/health\n`);
});
