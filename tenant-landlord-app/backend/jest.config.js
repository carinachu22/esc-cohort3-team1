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
    // collectCoverage: true,
    coverageReporters: ["text"], // can add "html if want"
  };
  

//export default config;
export default config

