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
    // globalSetup: process.env.SETUP_FILE,
    // globalTeardown: process.env.TEARDOWN_FILE
  };
  

//export default config;
export default config

