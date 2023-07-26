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
 * @param {*} data tenant email, password(unhashed)
 * @param {*} callBack 
 */
export const createTenant = (data, callBack) => {
  pool.query(
    `
    INSERT INTO TENANT_USER(email, password, public_building_id)
    VALUES (?, ?, ?)
    `,
    [
      data.email,
      data.password,
      data.buildingID
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
};

/**
 * Update quotation
 * @param {*} id service_request_id
 * @param {*} data quotation amount(float to 2dp), status(string)
 * @param {*} callBack 
 */
export const updateQuotation = (id, data, callBack) => {
  const quotationAmount = parseFloat(data.quotation_amount).toFixed(2); //Note this is impt to format it to decimal
  const status = "quotation sent";
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

export const ticketWork = (id, data, status, callBack) => {
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


//upload quotation's path in the file system
export const uploadLease = ({filepath, id}, callBack) => {
  pool.query(
    `
    UPDATE lease
    SET pdf_path = ?
    WHERE public_lease_id = ?
    `,
    [
      filepath,
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
export const getLeasePath = (id, callBack) => {
  pool.query(
    `
    SELECT pdf_path
    FROM lease
    WHERE public_lease_id = ?
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