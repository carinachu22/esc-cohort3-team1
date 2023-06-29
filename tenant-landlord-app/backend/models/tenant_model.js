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

export const getTenantByID = (id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM tenant_user
    WHERE tenant_user_id = ?
    `,
    [id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
};

export const createTicket = (lease_id, data, callBack) => {
  const status = "submitted"
  pool.query(
    `
    INSERT INTO service_request
    (lease_id, name, contact, email, request_type, request_description, submitted_date_time, status)
    VALUES (?,?,?,?,?,?,?,?)
    `,
    [
      lease_id,
      data.name,
      data.contact,
      data.email,
      data.request_type,
      data.request_description,
      data.submitted_date_time,
      status
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

export const quotationApproval = (id, data, status, callBack) => {
  pool.query(
    `
    UPDATE service_request
    SET quotation_accepted_by_tenant = ?, quotation_acceptance_date = ?, status = ?
    WHERE service_request_id = ?
    `,
    [
      data.quotation_accepted_by_tenant,
      data.quotation_acceptance_date,
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
