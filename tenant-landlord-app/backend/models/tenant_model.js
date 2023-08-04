import {pool} from "../config/database.js";

const statuses = ["tenant_ticket_created", "landlord_ticket_rejected", "landlord_ticket_approved", "landlord_quotation_sent", "ticket_quotation_rejected", "ticket_quotation_approved", "landlord_started_work", "landlord_completed_work", "tenant_feedback_given", "landlord_ticket_closed", "close_attempt_failed"]

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
        callBack(null, results);
      }
    }
  );
};

export const getTenantById = (id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM tenant_user
    WHERE tenant_user_id = ? AND TENANT_USER.deleted_date IS NULL
    `,
    [id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results);
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
      return callBack(null, results);
    }
  );
}

/**
 * recover tenant account by setting the deleted_date to NULL
 * @param {*} id 
 * @param {*} callBack 
 */
export const recoverTenantAccount = (id, callBack) => {
  pool.query(
    `
    UPDATE tenant_user 
    SET deleted_date = NULL 
    WHERE tenant_user_id = ?
    `,
    [
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

// Temp Fix
export const getTicketById = (id, callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST
    WHERE public_service_request_id = ?
    `,
    [id],
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
  if (statuses.includes(status)) {
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
    } else {
        callBack("invalid status")
  }
};

/**
 * Ticket Creation
 * @param {*} data email, request_type, request_description, quptation_path, submitted_date_time(Date Type)
 * @param {*} floor
 * @param {*} unit_number
 * @param {*} callBack 
 */
export const createTicket = (data, floor, unit_number,  callBack) => {
  const status = "tenant_ticket_created";
  const public_service_request_id = data.submitted_date_time;
  const feedback_rating = null;
  const feedback_text = null;
  if (statuses.includes(status)){
    pool.query(
      `
      INSERT INTO service_request
      (email, request_type, request_description, quotation_path, submitted_date_time, status, feedback_rating, feedback_text, floor, unit_number)
      VALUES (?,?,?,?,?,?,?,?,?,?)
      `,
      [
        data.email,
        data.request_type,
        data.request_description,
        data.quotation_path,
        data.submitted_date_time,
        status,
        feedback_rating,
        feedback_text,
        floor,
        unit_number
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error)
          callBack(error);
        } else {
          callBack(null,results);
        }
      }
  )} else {
    callBack("invalid status")
  }
};

/**
 * Tenant can approve quotation from landlord
 * @param {string} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} data 
 * @param {string} status updated status
 * @param {*} callBack 
 */
export const quotationApproval = (id, status, callBack) => {
  if (statuses.includes(status)){
    pool.query(
    `
    UPDATE service_request
    SET status = ?
    WHERE public_service_request_id = ?
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
  )} else {
    callBack("invalid status")
  }
};

/**
 * Adds feedback rating to feedback_rating
 * @param {string} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {int} data feedback_rating
 * @param {*} callBack 
 */
export const addFeedbackRating = (id, feedback_rating, callBack) => {
  if (feedback_rating=="1" || feedback_rating=="2" || feedback_rating=="3" || feedback_rating=="4" || feedback_rating=="5") {
    pool.query (
      `
      UPDATE service_request
      SET feedback_rating = ?, status = ?
      WHERE public_service_request_id = ?
      `,
      [
        feedback_rating, "tenant_feedback_given", id
      ],
      
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null,results);
        }
      }
    )
  } else{
    callBack("data validation error")
  }
};

/**
 * Adds feedback text to feedback_text
 * @param {string} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {string} data feedback_text
 * @param {*} callBack 
 */
export const addFeedbackText = (id, feedback_text, callBack) => {
  pool.query (
    `
    UPDATE service_request
    SET feedback_text = ?, status = ?
    WHERE public_service_request_id = ?
    `,
    [
      feedback_text, "tenant_feedback_given", id
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
 * @param {string} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {string} data status to close
 * @param {*} callBack 
 */
export const closeTicketStatus = (id, data, callBack) => {
  if (statuses.includes(data)) {
    pool.query (
      `
      UPDATE service_request
      SET status = ?
      WHERE public_service_request_id = ?
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
  )} else {
    callBack("invalid status")
  }
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
        callBack(null, results);
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
      l.pdf_path,
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

/**
 * get lease details using tenant's email
 * @param {*} email 
 * @param {*} callBack 
 */
export const getLeaseByTenantEmail = (tenantEmail, callBack) => {
  pool.query(
    `
    SELECT *
    FROM LEASE LEFT JOIN TENANT_USER ON LEASE.tenant_user_id = TENANT_USER.tenant_user_id
    WHERE email = ?
    `,
    [
      tenantEmail
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

export const updateTenantLease = (publicLeaseID, tenantID, callBack) => {
  pool.query(
    `
    UPDATE tenant_user
    SET public_lease_id = ?
    WHERE tenant_user_id = ?
    `,
    [
      publicLeaseID,
      tenantID
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


/**
 * get the quotation path of a specific service request 
 * @param {*} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} callBack 
 */
 export const getQuotationPath = (id, callBack) => {
  pool.query(
    `
    SELECT quotation_path
    FROM service_request
    WHERE public_service_request_id = ?
    `,
    [
      id
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
}

/**
 * 
 * @param {*} filepath 
 * @param {*} callBack 
 */
export const getQuotation = (filepath, callBack) => {
  pool.query(
    `
    SELECT 
    LOAD_FILE(?)
    `,
    [
      filepath
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0]);
      }
    }
  );
}