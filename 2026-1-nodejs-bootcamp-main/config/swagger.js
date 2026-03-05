const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Bootcamp API',
      version: '1.0.0',
      description: 'Bu proje icin temel Swagger dokumantasyonu.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.resolve(__dirname, '../routes/**/*.js').replace(/\\/g, '/')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;