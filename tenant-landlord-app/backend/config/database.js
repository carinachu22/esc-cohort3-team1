import { createPool } from "mysql2"; //this is just to import a method
const pool = createPool({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "", //INSERT HERE
  database: "landlord_tenant_portal",
  connectionLimit: 10,
});

// Test the database connection
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

export default pool; //this allow us to reuse the connect by keeping the connection in the pool
/**
 * Functions of pool:
 * pool.query
 */
