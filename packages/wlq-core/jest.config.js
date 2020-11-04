module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  coveragePathIgnorePatterns: ["__fixtures__", "index.ts"],
  coverageDirectory: "./coverage/",
  collectCoverageFrom: ["src/**/*.{ts,tsx}"]
};
