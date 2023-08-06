// /** @type {import('jest').Config} */
// import dotenv from "dotenv";
// dotenv.config();
import defaults from "jest-config";
const config = {
    verbose: true,
    testTimeout: 5000,
    transform: {},
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    maxWorkers: 1,
    collectCoverage: true,
    coverageReporters: ["text"], // can add "html if want"
    coveragePathIgnorePatterns: [
      'models/admin_model.js',
      'controller/admin_controller.js',
      'routes/admin_router.js',
      'auth/*.js'
    ],
    collectCoverageFrom: [
      'models/*.js',
      'controller/*.js',
      'routes/*.js',
    ],
  };
  

//export default config;
export default config

