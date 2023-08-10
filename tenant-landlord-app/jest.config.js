const config = {
    verbose: true,
    testTimeout: 1000,
    displayName: "react-b",
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-auth-kit|axios|bootstrap|react-icons|react-router-dom)",
    ],
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy",
    },
    maxWorkers: 1,
    testEnvironment: 'jsdom',
    setupFiles: ['dotenv/config'],
    collectCoverage: true,
    coverageReporters: ["text", "html"], // can add "html if want"
    coveragePathIgnorePatterns: [
      'backend/models/admin_model.js',
      'backend/controller/admin_controller.js',
      'backend/routes/admin_router.js',
      'backend/auth/*.js'
    ],
    collectCoverageFrom: [
      'backend/models/*.js',
      'backend/controller/*.js',
      'backend/routes/*.js',
    ],
};

export default config;
