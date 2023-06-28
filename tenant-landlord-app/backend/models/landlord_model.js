import pool from "../config/database.js";

export const createLandlord = (data, callBack) => {
  pool.query(
    `
    INSERT INTO LANDLORD_USER(landlord_user_id, building_id, username, email, password, ticket_type)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.landlord_user_id,
      data.building_id,
      data.username,
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

export const getLandlordByUsername = (username, callBack) => {
  pool.query(
    `
    SELECT *
    FROM landlord_user
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

//update details of landlord
export const updateLandlord = (data, callBack) => {
  pool.query(
    'UPDATE landlord_user SET username=?, email=?, password=?, ticket_type=? where landlord_user_id=?',
    [
      data.username,
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
    'DELETE FROM landlord_user where username=?',
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
    INSERT INTO TENANT_USER(tenant_user_id, unit_id, username, password, lease_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      data.tenant_user_id,
      data.unit_id,
      data.username,
      data.password,
      data.lease_id,
    ],
    (error, results, fields) => {
      if (error) {
        callBack(error);
      }
      callBack(null, results);
    }
  );
};
