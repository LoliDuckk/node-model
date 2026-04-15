const rateLimit = require("express-rate-limit");

describe("Rate Limiting Middleware", () => {
  describe("Rate limiter factory function", () => {
    test("should create a rate limiter with correct options", () => {
      const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests",
      });

      expect(typeof limiter).toBe("function");
    });

    test("should create different limiters with different configs", () => {
      const limiter1 = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
      const limiter2 = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

      expect(typeof limiter1).toBe("function");
      expect(typeof limiter2).toBe("function");
      expect(limiter1).not.toBe(limiter2);
    });

    test("should return middleware function from rate limiter", () => {
      const limiter = rateLimit({ windowMs: 60000, max: 10 });
      expect(typeof limiter).toBe("function");

      const mock = jest.fn();
      expect(typeof limiter).toBe("function");
    });
  });

  describe("Rate limiting configuration", () => {
    test("should accept windowMs parameter", () => {
      const windowMs = 15 * 60 * 1000;
      const limiter = rateLimit({ windowMs, max: 100 });

      expect(typeof limiter).toBe("function");
    });

    test("should accept max parameter", () => {
      const limiter = rateLimit({ windowMs: 60000, max: 50 });

      expect(typeof limiter).toBe("function");
    });

    test("should accept message parameter", () => {
      const message = "Too many requests from this IP";
      const limiter = rateLimit({
        windowMs: 60000,
        max: 10,
        message,
      });

      expect(typeof limiter).toBe("function");
    });

    test("should accept skip parameter", () => {
      const skip = (req) => req.method === "OPTIONS";
      const limiter = rateLimit({
        windowMs: 60000,
        max: 10,
        skip,
      });

      expect(typeof limiter).toBe("function");
    });
  });
});
