import pool from "../config/database.js";

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
        // console.log(results);
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

//update details of landlord
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

export const deleteLandlord = (data, callBack) => {
  pool.query(
    'DELETE FROM landlord_user where email=?',
    [data.id],
    (error, results, fields) => {
      if(error){
        callBack(error);
      }
      return callBack(null, results[0]);
    }
  );
}

export const createTenant = (data, callBack) => {
  pool.query(
    `
    INSERT INTO TENANT_USER(email, password)
    VALUES (?, ?)
    `,
    [
      data.email,
      data.password,
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};


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
    SET quotation_path = ?
    WHERE service_request_id = ?
    `,
    [
      filepath,
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

