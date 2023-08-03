import {pool} from "../config/database.js";

const statuses = ["tenant_ticket_created", "landlord_ticket_rejected", "landlord_ticket_approved", "landlord_quotation_sent", "ticket_quotation_rejected", "ticket_quotation_approved", "landlord_started_work", "landlord_completed_work", "tenant_feedback_given", "landlord_ticket_closed"]

/**
 * Create landlord account
 * @param {*} data email, password(unhashed), ticket_type
 * @param {*} callBack 
 */
export const createLandlord = (email, password, ticket_type, public_building_id, role, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(email, password, ticket_type, public_building_id, role)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      email,
      password,
      ticket_type,
      public_building_id,
      role
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
 * recover landlord account by setting the deleted_date to NULL
 * @param {*} id 
 * @param {*} callBack 
 */
export const recoverLandlordAccount = (password_hashed, ticketType, id, callBack) => {
  pool.query(
    `
    UPDATE landlord_user 
    SET deleted_date = NULL, password = ?, ticket_type = ?
    WHERE landlord_user_id = ?
    `,
    [
      password_hashed,
      ticketType,
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
 * Get landlord with email
 * Note that we are not checking whether the deleted_date is NULL for this query
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

/**
 * 
 * @param {int} id landlord_user_id
 * @param {*} callBack 
 */
export const getLandlordById = (id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE landlord_user_id = ? AND landlord_user.deleted_date IS NULL
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
 * 
 * @param {*} param0 {password, id}
 * @param {*} callBack 
 */
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
    'UPDATE landlord_user SET email=?, password=?, ticket_type=?, public_building_id=?, role=? WHERE landlord_user_id=? ',
    [
      data.email,
      data.password,
      data.ticket_type,
      data.public_building_id,
      data.role,
      data.landlord_user_id,
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
export const deleteLandlord = (deletedDate, email, callBack) => {
  pool.query(
    'UPDATE landlord_user SET deleted_date = ? WHERE email = ?',
    [
      deletedDate,
      email
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
 * Delete all tenant accounts
 * @param {*} data 
 * @param {*} callBack 
 */
export const deleteAllTenants = (deletedDate, buildingID, callBack) => {
  pool.query(
    'UPDATE tenant_user SET deleted_date = ? WHERE public_building_id = ? AND deleted_date IS NULL',
    [
      deletedDate,
      buildingID
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
 * Delete all tenant accounts
 * @param {*} data 
 * @param {*} callBack 
 */
export const deleteAllLandlords = (deletedDate, buildingID, callBack) => {
  pool.query(
    'UPDATE landlord_user SET deleted_date = ? WHERE public_building_id = ? AND deleted_date IS NULL AND role = "staff" ',
    [
      deletedDate,
      buildingID
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
 * Delete a tenant account
 * @param {*} email 
 * @param {*} callBack 
 */
export const deleteTenantByEmail = (deletedDate, email, callBack) => {
  pool.query(
    'UPDATE tenant_user SET deleted_date = ? WHERE email = ?',
    [
      deletedDate,
      email
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
 * Delete a landlord account
 * @param {*} email 
 * @param {*} callBack 
 */
export const deleteLandlordByEmail = (deletedDate, email, callBack) => {
  pool.query(
    'UPDATE landlord_user SET deleted_date = ? WHERE email = ?',
    [
      deletedDate,
      email
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
 * Create new tenant account
 * @param {*} data tenant email, password(unhashed), public_building_id (eg. RC)
 * @param {*} callBack 
 */
export const createTenant = (email, password, public_building_id, callBack) => {
  pool.query(
    `
    INSERT INTO TENANT_USER(email, password, public_building_id)
    VALUES (?, ?, ?)
    `,
    [
      email,
      password,
      public_building_id
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
 * Get Tickets requested by tenants of the same building and ticket type as landlord. 
 * Mainly used by landlord staff
 * @param {*} public_building_id
 * @param {*} ticketType
 * @param {*} callBack 
 */
export const getTicketsByType = (public_building_id, ticketType, callBack) => {
  pool.query(
    `
    SELECT SERVICE_REQUEST.* 
    FROM SERVICE_REQUEST 
    LEFT JOIN TENANT_USER ON SERVICE_REQUEST.email = TENANT_USER.email
    WHERE TENANT_USER.public_building_id = ? AND SERVICE_REQUEST.ticket_type = ?`,
    [
      public_building_id, 
      ticketType
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
 * Gets tickets by public_service_request_id
 * @param {*} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} callBack 
 */
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
        callBack(null, results[0]);
      }
    }
  );
};

/**
 * Get Tickets requested by tenants of the same building and ticket type as landlord. 
 * Mainly used by landlord supervisor
 * @param {*} public_building_id 
 * @param {*} callBack 
 */
export const getTickets = (public_building_id, callBack) => {
  pool.query(
    `
    SELECT SERVICE_REQUEST.* 
    FROM SERVICE_REQUEST 
    LEFT JOIN TENANT_USER ON SERVICE_REQUEST.email = TENANT_USER.email
    WHERE TENANT_USER.public_building_id = ?
    `,
    [public_building_id],
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
 * @param {*} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} data  status(string)
 * @param {*} callBack 
 */
export const updateQuotation = (id, data, callBack) => {
  const status = "landlord_quotation_sent";
  if (statuses.includes(status)) {
    console.log("id", id)
    pool.query(
      `
      UPDATE SERVICE_REQUEST
      SET  status = ?
      WHERE public_service_request_id = ?
      `,
      [status, id],
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
 * upload quotation's path in the file system
 * @param {*} param0 filepath, public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} callBack 
 */
export const uploadQuotation = ({filepath, id}, callBack) => {
  pool.query(
    `
    UPDATE service_request
    SET quotation_path = ?,
    status = ?
    WHERE public_service_request_id = ?
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


/**
 * 
 * @param {*} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} quotationRequired a String with true/false value 
 * @param {*} data 
 * @param {*} status 
 * @param {*} callBack 
 */
export const ticketApproval = (id, quotationRequired, data, status, callBack) => {
  if (statuses.includes(status)) {
    pool.query(
      `
      UPDATE service_request
      SET status = ?, quotation_required = ?
      WHERE public_service_request_id = ?
      `,
      [
        status,
        quotationRequired,
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


/**
 * 
 * @param {*} id public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} data 
 * @param {*} status 
 * @param {*} callBack 
 */
export const ticketWork = (id, data, status, callBack) => {
  if (statuses.includes(status)) {
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
    )
  } else {
    callBack("invalid status")
  }
};


/**
 * get tenant accounts 
 * @param {*} public_building_id 
 * @param {*} callBack 
 */
export const getTenantAccounts = (public_building_id, callBack) => {
  pool.query(
    `
    SELECT TENANT_USER.*, LEASE.public_lease_id, LEASE.lease_id, LEASE.landlord_user_id, LEASE.floor, LEASE.unit_number, LEASE.pdf_path
    FROM TENANT_USER LEFT JOIN LEASE ON TENANT_USER.public_lease_id = LEASE.public_lease_id
    WHERE public_building_id=? AND TENANT_USER.deleted_date IS NULL`,
    [public_building_id],
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
 * {
 *    public_lease_id,
 *    floor,
 *    unit_number,
 *    pdf_path
    }
 * @param {*} callBack 
 */
export const createLease = (publicLeaseID, landlordID, tenantID, data, callBack) => {
  pool.query (
    `
    INSERT INTO lease
    (public_lease_id, tenant_user_id, landlord_user_id, floor, unit_number)
    VALUES (?,?,?,?,?)
    `,
    [
      publicLeaseID,
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


//upload quotation's path in the file system
/**
 * 
 * @param {*} param0 {filepath, id}
 * @param {*} callBack 
 */
export const uploadLease = ({filepath, publicLeaseID}, callBack) => {
  pool.query(
    `
    UPDATE lease
    SET pdf_path = ?
    WHERE public_lease_id = ?
    `,
    [
      filepath,
      publicLeaseID
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
 * Get landlord's id
 * @param {string} email email
 * @param {*} callBack 
 */
export const getLandlordUserId = (email, callBack) => {
  pool.query(
    `
    SELECT landlord_user_id
    FROM landlord_user
    WHERE email = ? AND deleted_date IS NULL
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
 * get all landlord staff accounts under a certain building
 * @param {*} public_building_id 
 * @param {*} callBack 
 */
export const getLandlordAccounts = (public_building_id, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
    WHERE public_building_id = ? AND deleted_date IS NULL AND role = "staff"
    `,
    [public_building_id],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  )
}

/**
 * 
 * @param {int} id landlord_user_id
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

export const getLeaseDetails = (tenant_user_id, callBack) => {
  pool.query(
    'SELECT * FROM lease WHERE tenant_user_id = ?',
    [tenant_user_id],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

/**
 * 
 * @param {string} lease_id public_lease_id
 * @param {*} callBack 
 */
export const deleteLease = (lease_id, callBack) => {
  pool.query(
    'DELETE lease where public_lease_id = ?',
    [
      deletedDate,
      lease_id
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
 * 
 * @param {int} landlordID tenant_user_id
 * @param {int} tenantID landlord_user_id
 * @param {object} data 
 * {
 *  new_public_lease_id,
 *  floor,
 *  unit_number,
 *  pdf_path,
 *  old_public_lease_id
 * }
 * @param {*} callBack 
 */
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



/**
 * 
 * @param {string} id public_lease_id
 * @param {*} callBack 
 */
export const getLeasePath = (tenantID, callBack) => {
  pool.query(
    `
    SELECT * 
    FROM TENANT_USER LEFT JOIN LEASE ON TENANT_USER.public_lease_id = LEASE.public_lease_id
    WHERE TENANT_USER.tenant_user_id=?`,
    [tenantID],
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
 * @param {*} filepath 
 * @param {*} callBack 
 */
export const getLease = (filepath, callBack) => {
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

/**
 * get building id of landlord
 * @param {*} email 
 * @param {*} callBack 
 */
export const getBuildingID = (email, callBack) => {
  pool.query(
    `
    SELECT public_building_id
    FROM landlord_user
    WHERE email=? AND deleted_date IS NULL
    `,
    [
      email
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