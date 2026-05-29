const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kilit - Ebeveyn Çocuk Takip Uygulaması API',
      version: '1.0.0',
      description: 'React Native tabanlı ebeveyn kontrol uygulaması için backend API dokümantasyonu.',
      contact: {
        name: 'Kilit App',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Geliştirme Sunucusu',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token ile kimlik doğrulama. Login endpoint\'inden alınan token\'ı girin.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['parent', 'child'] },
            name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Child: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            parent_id: { type: 'string', format: 'uuid' },
            child_user_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            age: { type: 'integer' },
            child_email: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        BlockRule: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            parent_id: { type: 'string', format: 'uuid' },
            child_id: { type: 'string', format: 'uuid' },
            app_id: { type: 'string', format: 'uuid', description: 'app_catalog referansı' },
            app_name: { type: 'string', example: 'TikTok' },
            package_name: { type: 'string', example: 'com.tiktok.android' },
            is_blocked: { type: 'integer', enum: [0, 1] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        TimeRestriction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            parent_id: { type: 'string', format: 'uuid' },
            child_id: { type: 'string', format: 'uuid' },
            app_id: { type: 'string', format: 'uuid', description: 'app_catalog referansı' },
            app_name: { type: 'string', example: 'Instagram' },
            package_name: { type: 'string', example: 'com.instagram.android' },
            day_of_week: { type: 'string', example: 'Pazartesi-Cuma' },
            start_time: { type: 'string', example: '09:00' },
            end_time: { type: 'string', example: '17:00' },
            is_active: { type: 'integer', enum: [0, 1] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UsageStat: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            child_id: { type: 'string', format: 'uuid' },
            app_id: { type: 'string', format: 'uuid', description: 'app_catalog referansı' },
            app_name: { type: 'string', example: 'Instagram' },
            package_name: { type: 'string', example: 'com.instagram.android' },
            usage_minutes: { type: 'integer', example: 120 },
            usage_date: { type: 'string', format: 'date', example: '2024-01-15' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            message: { type: 'string' },
            is_read: { type: 'integer', enum: [0, 1] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AppCatalog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            app_name: { type: 'string', example: 'Instagram' },
            package_name: { type: 'string', example: 'com.instagram.android' },
            category: { type: 'string', example: 'social' },
            icon_url: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        PermissionLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            device_id: { type: 'string', format: 'uuid' },
            permission_type: { type: 'string', enum: ['usage_access', 'notification', 'accessibility', 'overlay', 'device_admin', 'battery_optimization'] },
            is_granted: { type: 'integer', enum: [0, 1] },
            checked_at: { type: 'string', format: 'date-time' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
