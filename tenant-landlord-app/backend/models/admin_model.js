import { pool } from "../config/database.js";

/**
 * Create admin account
 * @param {*} data email, password(unhashed)
 * @param {*} callBack
 */
export const createAdmin = (data, callBack) => {
  pool.query(
    `
    INSERT INTO ADMIN_USER(email, password)
    VALUES (?, ?)
    `,
    [data.email, data.password],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

export const getAdminById = (id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM admin_user
    WHERE admin_user_id = ?
    `,
    [id],
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

export const updateAdminPassword = ({ password, id }, callBack) => {
  pool.query(
    `
    UPDATE admin_user 
    SET password = ? 
    WHERE admin_user_id = ?
    `,
    [password, id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};

/**
 * Create landlord account
 * @param {*} data email, password(unhashed), ticket_type
 * @param {*} callBack
 */
export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(email, password, ticket_type, public_building_id, role)
    VALUES (?, ?, ?, ?, ?)
    `,
    [data.email, data.password, data.ticket_type, data.public_building_id, data.role],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * Get landlord with email
 * @param {*} email
 * @param {*} callBack
 */
export const getLandlordByEmail = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE email = ?
    `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};

/**
 * Delete landlord accounts by email
 * @param {*} email
 * @param {*} callBack
 */
export const deleteLandlordByEmail = (email, callBack) => {
  pool.query(
    "DELETE FROM landlord_user WHERE email = ?",
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
};

/**
 * Building Creation
 * @param {*} data public_building_id(RC, FC), building_name, address,postal_code
 * @param {*} callBack
 */
export const createBuilding = (data, callBack) => {
  pool.query(
    `
    INSERT INTO building
    (public_building_id, building_name, address, postal_code)
    VALUES (?,?,?,?)
    `,
    [
      data.public_building_id,
      data.building_name,
      data.address,
      data.postal_code,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error);
        callBack(error);
      } else {
        callBack(null, results);
      }
    }
  );
};

export const getAllTickets = (callBack) => {
    pool.query(
      `
      SELECT *
      FROM service_request
      `,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  };

export const getAllTenantAccounts = (callBack) => {
    let sqlQuery = `
        SELECT *
        FROM tenant_user
        WHERE deleted_date IS NULL 
        `
    console.log(sqlQuery)
    pool.query(
        sqlQuery,
        (error, results, fields) => {
        if (error) {
            callBack(error);
        }
        callBack(null, results);
        }
    )
}

export const getAllLandlordAccounts = (callBack) => {
    let sqlQuery = `
    SELECT *
    FROM landlord_user
    WHERE deleted_date IS NULL
    `
    console.log(sqlQuery)
    pool.query(
      sqlQuery,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        callBack(null, results);
      }
    )
  }

export const modifyTicket = (data, callBack) => {
    pool.query(
        `
        UPDATE service_request
        SET ticket_type = ?, request_description = ?, status = ?
        WHERE public_service_request_id = ?
        `,
        [
        data.ticket_type,
        data.request_description,
        data.status,
        data.public_service_request_id
        ],
        (error, results, fields) => {
          if (error) {
            callBack(error);
          }
          return callBack(null, results);
        }
    );
}

export const getBuildings = (callBack) => {
    let sqlQuery = `
    SELECT *
    FROM building
    `
    console.log(sqlQuery)
    pool.query(
      sqlQuery,
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        callBack(null, results);
      }
    )
  }