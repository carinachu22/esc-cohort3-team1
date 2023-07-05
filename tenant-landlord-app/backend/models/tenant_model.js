import pool from "../config/database.js";

export const getTenantByEmail = (email, callBack) => {
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
        callBack(null, results);
      }
    }
  );
};

export const getTicketsByStatus = (email, status, callBack) => {
  pool.query(
    `
    SELECT *
    FROM service_request
    WHERE email = ? AND status = ?
    `,
    [email, status],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results);
      }
    }
  );
};

export const createTicket = (data, callBack) => {
  const status = "submitted";
  const feedback_rating = null;
  const feedback_text = null;
  pool.query(
    `
    INSERT INTO service_request
    (name, email, request_type, request_description, submitted_date_time, status, feedback_rating, feedback_text)
    VALUES (?,?,?,?,?,?,?,?)
    `,
    [
      data.name,
      data.email,
      data.request_type,
      data.request_description,
      data.submitted_date_time,
      status,
      data.feedback_rating,
      data.feedback_text
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

export const addFeedbackRating = (id, data, callBack) => {
  pool.query (
    `
    UPDATE service_request
    SET feedback_rating = ?
    WHERE service_request_id = ?
    `,
    [
      data.feedback_rating, id
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

export const addFeedbackText = (id, data, callBack) => {
  pool.query (
    `
    UPDATE service_request
    SET feedback_text = ?
    WHERE service_request_id = ?
    `,
    [
      data.feedback_text, id
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

export const closeTicketStatus = (id, data, callBack) => {
  pool.query (
    `
    UPDATE service_request
    SET status = ?
    WHERE service_request_id = ?
    `,
    [
      data, id
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null,results);
      }
    }
    
  )
}
