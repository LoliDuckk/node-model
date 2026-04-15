const request = require("supertest");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const router = require("../routes/index");
const errorHandler = require("../middleware/errorHandlingMiddleware");
const { generalLimiter } = require("../middleware/rateLimitMiddleware");
const swaggerSpecs = require("../utils/swaggerOptions");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(generalLimiter);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api", router);

app.use(errorHandler);

describe("User API Integration Tests", () => {
  describe("GET /api/health", () => {
    test("should return health status", async () => {
      const response = await request(app).get("/api/health");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("OK");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("uptime");
    });
  });

  describe("Rate Limiting", () => {
    test("should apply rate limiting to auth endpoints", async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app).post("/api/user/login").send({
            email: "test@example.com",
            password: "WrongPass123",
          }),
        );
      }

      const responses = await Promise.all(promises);
      const tooManyRequests = responses.some((r) => r.status === 429);

      expect(tooManyRequests).toBe(true);
    });
  });
});
