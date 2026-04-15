const ApiError = require("../error/ApiError");
const errorHandler = require("../middleware/errorHandlingMiddleware");

describe("Error Handling Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test("should handle ApiError with status and message", () => {
    const error = ApiError.badRequest("Test error");
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Test error" });
  });

  test("should handle generic error with 500 status", () => {
    const error = new Error("Generic error");
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalled();
  });

  test("should handle Sequelize validation error", () => {
    const error = {
      name: "SequelizeValidationError",
      errors: [{ message: "Validation error" }],
    };
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test("should handle Sequelize unique constraint error", () => {
    const error = {
      name: "SequelizeUniqueConstraintError",
      errors: [{ message: "Constraint error" }],
    };
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
