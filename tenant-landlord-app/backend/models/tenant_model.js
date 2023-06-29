import pool from "../config/database.js";

export const getTenantByUsername = (username, callBack) => {
  pool.query(
    `
    SELECT *
    FROM tenant_user
    WHERE username = ?
    `,
    [username],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};


