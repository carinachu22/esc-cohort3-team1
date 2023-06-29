import pool from "../config/database.js";

export const getTenantByUsername = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM tenant_user
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

export const getTicketsByTenant = (email, callBack) => {
  pool.query(
    `
    SELECT *
    FROM service_request
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

export const createTicket = (data, callBack) => {
  const status = "submitted"
  pool.query(
    `
    INSERT INTO service_request
    (name, email, request_type, request_description, submitted_date_time, status)
    VALUES (?,?,?,?,?,?)
    `,
    [
      data.name,
      data.email,
      data.request_type,
      data.request_description,
      data.submitted_date_time,
      status
    ],
    (error, results, fields) => {
      if (error) {
        console.log(error)
        callBack(error);
      } else {
        callBack(null,results);
      }
    }
  )
};

export const quotationApproval = (id, data, status, callBack) => {
  pool.query(
    `
    UPDATE service_request
    SET status = ?
    WHERE service_request_id = ?
    `,
    [
      status,
      id
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null,results);
      }
    }
  )
};
