import {pool} from "../config/database.js";

/**
 * Create landlord account
 * @param {*} data email, password(unhashed), ticket_type
 * @param {*} callBack 
 */
export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(email, password, ticket_type)
    VALUES (?, ?, ?)
    `,
    [
      data.email,
      data.password,
      data.ticket_type,
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * Get admin with email
 * @param {*} email 
 * @param {*} callBack 
 */
export const getAdminByEmail = (email, callBack) => {
    pool.query(
      `
      SELECT *
      FROM admin_user
      WHERE email = ?
      `,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          // console.log(results);
          callBack(null, results[0]);
        }
      }
    );
  };
