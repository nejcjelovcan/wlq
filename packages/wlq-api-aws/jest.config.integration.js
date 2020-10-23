module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testMatch: ["**/?(*.)+(integration).+(ts|tsx|js)"],
  coveragePathIgnorePatterns: ["__fixtures__", "index.ts"],
  coverageDirectory: "./coverage/",
  collectCoverageFrom: ["src/**/*.{ts,tsx}"]
};
