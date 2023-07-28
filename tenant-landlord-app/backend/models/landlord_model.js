import {pool} from "../config/database.js";

const statuses = ["tenant_ticket_created", "landlord_ticket_rejected", "landlord_ticket_approved", "landlord_quotation_sent", "ticket_quotation_rejected", "ticket_quotation_approved", "landlord_started_work", "landlord_completed_work", "tenant_feedback_given", "landlord_ticket_closed"]

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
        callBack(null, results);
      }
    }
  );
};

export const getLandlordById = (id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE landlord_user_id = ?
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

export const updateLandlordPassword = ({password, id}, callBack) => {
  pool.query(
    `
    UPDATE landlord_user 
    SET password = ? 
    WHERE landlord_user_id = ?
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
 * update details of landlord
 * @param {*} data email, password(unhashed), ticket_type, landlord_user_id
 * @param {*} callBack 
 */
export const updateLandlord = (data, callBack) => {
  pool.query(
    'UPDATE landlord_user SET email=?, password=?, ticket_type=? WHERE landlord_user_id=?',
    [
      data.email,
      data.password,
      data.ticket_type,
      data.landlord_user_id
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
 * Delete landlord account
 * @param {*} data landlord email
 * @param {*} callBack 
 */
export const deleteLandlord = (data, callBack) => {
  pool.query(
    'DELETE FROM landlord_user where email=?',
    [data.email],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

/**
 * Delete all tenant accounts
 * @param {*} data 
 * @param {*} callBack 
 */
export const deleteAllTenants = (callBack) => {
  pool.query(
    'DELETE FROM tenant_user ',
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

/**
 * Delete all tenant accounts
 * @param {*} email 
 * @param {*} callBack 
 */
export const deleteTenantByEmail = (email, callBack) => {
  pool.query(
    'DELETE FROM tenant_user WHERE email = ?',
    [email],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

/**
 * Create new tenant account
 * @param {*} data tenant email, password(unhashed), public_building_id (eg. RC), public_lease_id (eg. YYYY-MM-DD 00:00:00)
 * @param {*} callBack 
 */
export const createTenant = (email, password, public_building_id, public_lease_id, callBack) => {
  pool.query(
    `
    INSERT INTO TENANT_USER(email, password, public_building_id, public_lease_id)
    VALUES (?, ?, ?, ?)
    `,
    [
      email,
      password,
      public_building_id,
      public_lease_id
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
 * Get Tickets
 * @param {*} callBack 
 */
export const getTickets = (callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST`,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * Gets tickets by service_request_id
 * @param {*} id service_request_id
 * @param {*} callBack 
 */
export const getTicketById = (id, callBack) => {
  pool.query(
    `
    SELECT * FROM SERVICE_REQUEST
    WHERE service_request_id = ?
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

/**
 * Get tickets by status
 * @param {*} status 
 * @param {*} callBack 
 */
export const getTicketsByStatus = (status, callBack) => {
  if (statuses.includes(status)) {
    pool.query(
      `
      SELECT * FROM SERVICE_REQUEST
      WHERE status = ?
      `,
      [status],
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
 * Update quotation
 * @param {*} id service_request_id
 * @param {*} data quotation amount(float to 2dp), status(string)
 * @param {*} callBack 
 */
export const updateQuotation = (id, data, callBack) => {
  const quotationAmount = parseFloat(data.quotation_amount).toFixed(2); //Note this is impt to format it to decimal
  const status = "landlord_quotation_sent";
  if (statuses.includes(status)) {
    pool.query(
      `
      UPDATE SERVICE_REQUEST
      SET quotation_amount=?, status = ?
      WHERE service_request_id = ?
      `,
      [quotationAmount, status, id],
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

//upload quotation's path in the file system
export const uploadQuotation = ({filepath, id}, callBack) => {
  pool.query(
    `
    UPDATE service_request
    SET quotation_path = ?,
    status = ?
    WHERE service_request_id = ?
    `,
    [
      filepath,
      "landlord_quotation_sent",
      id
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results);
      }
    }
  );
}


//get the quotation path of a specific service request 
export const getQuotationPath = (id, callBack) => {
  pool.query(
    `
    SELECT quotation_path
    FROM service_request
    WHERE service_request_id = ?
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

export const ticketApproval = (id, data, status, callBack) => {
  if (statuses.includes(status)) {
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
  } else {
    callBack("invalid status")
  }
};

export const ticketWork = (id, data, status, callBack) => {
  if (statuses.includes(status)) {
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
  } else {
    callBack("invalid status")
  }
};

export const getTenantAccounts = (callBack) => {
  pool.query(
    `
    SELECT * FROM TENANT_USER`,
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};

/**
 * 
 * @param {object} data 
 * @param {*} callBack 
 */
export const createLease = (landlordID, tenantID, data, callBack) => {
  pool.query (
    `
    INSERT INTO lease
    (public_lease_id, tenant_user_id, landlord_user_id, floor, unit_number, pdf_path)
    VALUES (?,?,?,?,?,?)
    `,
    [
      data.public_lease_id,
      tenantID,
      landlordID,
      data.floor,
      data.unit_number,
      data.pdf_path
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
export const getLandlordUserId = (email, callBack) => {
  pool.query(
    `
    SELECT landlord_user_id
    FROM landlord_user
    WHERE email = ?
    `,
    [email],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      } else {
        callBack(null, results[0])
      };
    }
  )
}

/**
 * 
 * @param {int} id 
 * @param {*} callBack 
 */
export const getLeaseByLandlord = (id, callBack) => {
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
      land.email AS landlord_email,
      t.email AS tenant_email
    FROM lease l
    JOIN landlord_user land USING (landlord_user_id)
    JOIN tenant_user t USING (tenant_user_id)
    JOIN building b
      ON b.public_building_id = land.public_building_id
    WHERE landlord_user_id = ?
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

export const deleteLease = (lease_id, callBack) => {
  pool.query(
    'DELETE FROM lease where public_lease_id = ?',
    [lease_id],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

export const updateLease = (landlordID, tenantID, data, callBack) => {
  pool.query (
    `
    UPDATE lease
    SET 
      public_lease_id = ?,
      tenant_user_id = ?,
      landlord_user_id = ?,
      floor = ?, 
      unit_number = ?, 
      pdf_path =?
    WHERE public_lease_id = ?
    `,
    [
      data.new_public_lease_id,
      tenantID,
      landlordID,
      data.floor,
      data.unit_number,
      data.pdf_path,
      data.old_public_lease_id
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