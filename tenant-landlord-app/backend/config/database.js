import dotenv from "dotenv";


import { createPool } from "mysql2"; //this is just to import a method
dotenv.config();

const env = process.env.NODE_ENV || 'development';
console.log(env)
const dbConfig = env === 'test' ? {
  port:process.env.DB_TESTPORT,
  host: process.env.DB_TESTHOST,
  user: process.env.DB_TESTUSER,
  password: process.env.DB_TESTPASSWORD,
  database: process.env.DB_TESTMYSQL,
  connectionLimit: 10,
} :{
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MYSQL,
  connectionLimit: 10,
};

console.log(dbConfig)

export const pool = createPool(dbConfig)

/**
 * Test the database connection
 */
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");

    // Perform a test query
    connection.query("SELECT 1", (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error executing test query:", err);
      } else {
        console.log("Test query executed successfully:", results);
      }
    });
  }
});

export function cleanup() {
  pool.end();
}
/**
 * Allows us to reuse the connect by keeping the connection in the pool \
 * -------- \
 * Functions of pool: \
 * pool.query
 */
//export default pool; //this allow us to reuse the connect by keeping the connection in the pool
export default {pool, cleanup}
/**
 * Functions of pool:
 * pool.query
 */
