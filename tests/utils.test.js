const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

describe("bcrypt", () => {
  test("should hash password with 10 rounds", async () => {
    const password = "TestPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  test("should verify correct password", async () => {
    const password = "TestPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    expect(isMatch).toBe(true);
  });

  test("should not verify incorrect password", async () => {
    const password = "TestPassword123";
    const wrongPassword = "WrongPassword456";
    const hashedPassword = await bcrypt.hash(password, 10);
    const isMatch = bcrypt.compareSync(wrongPassword, hashedPassword);

    expect(isMatch).toBe(false);
  });
});

describe("JWT", () => {
  test("should generate valid JWT token", () => {
    const payload = {
      id: 1,
      full_name: "Иван Иванов Иванович",
      email: "test@example.com",
      role: "USER",
      status: "ACTIVE",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "test_secret", {
      expiresIn: "24h",
    });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  test("should verify JWT token", () => {
    const payload = {
      id: 1,
      full_name: "Иван Иванов Иванович",
      email: "test@example.com",
      role: "USER",
      status: "ACTIVE",
    };

    const secret = process.env.JWT_SECRET_KEY || "test_secret";
    const token = jwt.sign(payload, secret, { expiresIn: "24h" });

    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
  });

  test("should throw error for invalid JWT token", () => {
    const invalidToken = "invalid.token.here";

    expect(() => {
      jwt.verify(invalidToken, process.env.JWT_SECRET_KEY || "test_secret");
    }).toThrow();
  });
});

describe("ApiError", () => {
  test("should create badRequest error", () => {
    const error = ApiError.badRequest("Bad request message");

    expect(error.status).toBe(400);
    expect(error.message).toBe("Bad request message");
  });

  test("should create forbidden error", () => {
    const error = ApiError.forbidden("Forbidden message");

    expect(error.status).toBe(403);
    expect(error.message).toBe("Forbidden message");
  });

  test("should create notFound error", () => {
    const error = ApiError.notFound("Not found message");

    expect(error.status).toBe(404);
    expect(error.message).toBe("Not found message");
  });

  test("should create internal error", () => {
    const error = ApiError.internal("Internal error message");

    expect(error.status).toBe(500);
    expect(error.message).toBe("Internal error message");
  });
});
