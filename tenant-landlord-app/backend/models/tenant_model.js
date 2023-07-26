import {pool} from "../config/database.js";


/**
 * Get tenant with email
 * @param {*} email 
 * @param {*} callBack 
 */
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

export const getTenantById = (id, callBack) => {
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
        // console.log(results);
        callBack(null, results[0]);
      }
    }
  );
};

export const updateTenantPassword = ({password, id}, callBack) => {
  pool.query(
    `
    UPDATE tenant_user 
    SET password = ? 
    WHERE tenant_user_id = ?
    `,
    [
      password,
      id
    ],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

/**
 * Get Tickets
 * @param {*} email 
 * @param {*} callBack 
 */
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

/**
 * Get Tickets by Status
 * @param {*} email 
 * @param {*} status 
 * @param {*} callBack 
 */
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

/**
 * Ticket Creation
 * @param {*} data public_service_request_id (eg. 2023-01-01 00:00:00), name, email, request_type, request_description, quptation_path, submitted_date_time(Date Type)
 * @param {*} callBack 
 */
export const createTicket = (data, callBack) => {
  const status = "tenant_ticket_created";
  const feedback_rating = null;
  const feedback_text = null;
  pool.query(
    `
    INSERT INTO service_request
    (public_service_request_id, name, email, request_type, request_description, quotation_path, submitted_date_time, status, feedback_rating, feedback_text)
    VALUES (?,?,?,?,?,?,?,?,?,?)
    `,
    [
      data.public_service_request_id,
      data.name,
      data.email,
      data.request_type,
      data.request_description,
      data.quotation_path,
      data.submitted_date_time,
      status,
      feedback_rating,
      feedback_text
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

/**
 * Tenant can approve quotation from landlord
 * @param {int} id service_ticket_id
 * @param {*} data 
 * @param {string} status updated status
 * @param {*} callBack 
 */
export const quotationApproval = (id, status, callBack) => {
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

/**
 * Adds feedback rating to feedback_rating
 * @param {int} id service_ticket_id
 * @param {int} data feedback_rating
 * @param {*} callBack 
 */
export const addFeedbackRating = (id, feedback_rating, callBack) => {
  pool.query (
    `
    UPDATE service_request
    SET feedback_rating = ?
    WHERE service_request_id = ?
    `,
    [
      feedback_rating, id
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

/**
 * Adds feedback text to feedback_text
 * @param {int} id service_ticket_id
 * @param {string} data feedback_text
 * @param {*} callBack 
 */
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

/**
 * Change ticket's status to close
 * @param {int} id service_request_id
 * @param {string} data status to close
 * @param {*} callBack 
 */
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

/**
 * 
 * @param {string} email 
 * @param {*} callBack 
 */
export const getTenantUserId = (email, callBack) => {
  pool.query(
    `
    SELECT tenant_user_id
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
  )
}

/**
 * 
 * @param {int} id 
 * @param {*} callBack 
 */
export const getLeaseByTenant = (id, callBack) => {
  pool.query(
    `
    SELECT 
      l.floor, 
      l.unit_number, 
      b.building_name, 
      b.address, 
      b.postal_code, 
      b.public_building_id, 
      l.public_lease_id,
      t.email AS tenant_email,
      land.email AS landlord_email
    FROM lease l
    JOIN tenant_user t USING (tenant_user_id)
    JOIN landlord_user land USING (landlord_user_id)
    JOIN building b
      ON b.public_building_id = t.public_building_id
    WHERE tenant_user_id = ?
    `,
    [id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null,results);
      }
    }
  )
}

export const updateTenantLease = (email, lease, callBack) => {
  pool.query(
    `
    UPDATE tenant_user
    SET public_lease_id = ?
    WHERE email = ?
    `,
    [
      lease,
      email
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results)
      }
    }
  )
}