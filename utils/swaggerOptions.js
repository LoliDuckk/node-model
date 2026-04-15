const swaggerJsdoc = require("swagger-jsdoc");

const apiUrl = (process.env.API_URL || "http://localhost:5000").replace(/\/$/, "");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description: "REST API для управления пользователями и аутентификацией",
    },
    servers: [
      {
        url: `${apiUrl}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            full_name: {
              type: "string",
              description: "Full name (3 words)",
            },
            birthday: {
              type: "string",
              format: "date",
              description: "Birthday",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "User role",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "BLOCKED"],
              description: "User status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation date",
            },
          },
        },
        UserRequest: {
          type: "object",
          required: ["full_name", "birthday", "email", "password"],
          properties: {
            full_name: {
              type: "string",
              description: "Full name (3 words)",
              example: "John Doe Smith",
            },
            birthday: {
              type: "string",
              format: "date",
              description: "Birthday",
              example: "1990-01-01",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 5,
              description: "Password",
              example: "SecurePassword123",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email address",
              example: "user@example.com",
            },
            password: {
              type: "string",
              description: "Password",
              example: "SecurePassword123",
            },
          },
        },
        TokenResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "JWT token",
            },
          },
        },
        BlockRequest: {
          type: "object",
          properties: {
            blocked: {
              type: "boolean",
              description: "Block or unblock status",
              example: true,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
