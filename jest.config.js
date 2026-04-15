module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["**/*.js", "!node_modules/**", "!tests/**", "!coverage/**", "!dist/**"],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },
  testMatch: ["**/tests/**/*.test.js"],
  testTimeout: 10000,
  verbose: true,
};
