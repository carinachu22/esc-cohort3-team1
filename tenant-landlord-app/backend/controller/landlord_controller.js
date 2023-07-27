import {
  createLandlord,
  getLandlordByEmail,
  createTenant,
  getTickets,
  getTicketById,
  getTicketsByStatus,
  updateQuotation,
  getLandlordById,
  updateLandlordPassword,
  uploadQuotation,
  getQuotation,
  getQuotationPath,
  ticketApproval,
  ticketWork,
  getTenantAccounts,
  deleteAllTenants,
  deleteTenantByEmail,
  getLandlordUserId,
  createLease,
  getLeaseByLandlord,
  deleteLease,
  updateLease
} from "../models/landlord_model.js";
import { 
  getTenantByEmail,
  getTenantUserId,
  updateTenantLease
} from "../models/tenant_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import formidable from 'formidable';
import { send } from "process";


/**
 * Create landlord account and store it in mysql database
 * @param {*} req email, password(unhashed), ticket_type
 * @param {*} res 
 */
export const controllerCreateLandlord = (req, res) => {
  const body = req.body;
  const email = body.email;
  getLandlordByEmail(body.email, (err, result) => {
    if (!result) {
      console.log(body);
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      createLandlord(body, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        return res.status(200).json({
          success: 1,
          message: "created successfully",
          data: results,
        });
      });
    }
    else {
      return res.status(500).json({
      success: 0,
      message: "duplicate email",

    });}
  })

};

/**
 * Login for landlord
 * @param {*} req email
 * @param {*} res 
 */
export const controllerLoginLandlord = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getLandlordByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
    console.log(body.password, results[0].password);
    const password_check = compareSync(body.password, results[0].password);
    console.log(password_check);
    if (password_check) {
      results[0].password = undefined;
      const jsontoken = jwt.sign({ result: results[0] }, "qwe1234", {
        expiresIn: "1h",
      });
      return res.json({
        success: 1,
        message: "Login successfully",
        token: jsontoken,
      });
    } else {
      console.log(results[0]);
      res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
  });
};



export const controllerForgotPasswordLandlord = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getLandlordByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    const secret = process.env.JWT_SECRET + results.password;
    const jsontoken = jwt.sign({email: results.email, id: results.landlord_user_id}, secret, {expiresIn: 300});
    const link = `http://localhost:5000/api/landlord/reset-password/${results.landlord_user_id}/${jsontoken}`;

    ////// NODEMAILER FEATURE ///////
    ///// nodemailer feature starts from here //////
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      //sender email and password
      // you can obtain the password in the following steps:
      // 1. Sign in to gmail
      // 2. go to "manage google account"
      // 3. go to "Security"
      // 4. click on "2-step verification"
      // 5. go to "App passwords" and add a password to a "custom name" app
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD
      }
    });
    
    var mailOptions = {
      from: process.env.AUTH_USER,
      to: results.email,
      subject: 'Password Reset',
      text: link
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
      ///// nodemailer feature ends here /////
  });
};

export const controllerResetPasswordPageLandlord = async (req, res) => {
  const {id, jsontoken} = req.params;
  console.log(req.params);
  getLandlordById(id, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    const secret = process.env.JWT_SECRET + results.password;
    try {
      const verify = jwt.verify(jsontoken, secret);
      return res.render("ResetPasswordPage", {email: verify.email, status: "not verified"});
      
    } catch (error){
      console.log(error);
      res.send("Not Verified!");
    }
  })

};

/**
 * Reset password of landlord. The landlord is accessed in the database using their id
 * @param {*} req landlord_user_id
 * @param {*} res email, password
 */
export const controllerResetPasswordLandlord = async (req, res) => {
  const {id, jsontoken} = req.params;
  console.log({id, jsontoken});
  var {password, confirmPassword} = req.body;
  console.log({password, confirmPassword});
  const salt = genSaltSync(10);
  password = hashSync(password, salt);

  getLandlordById(id, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    const secret = process.env.JWT_SECRET + results.password;
    try {
      const verify = jwt.verify(jsontoken, secret);
      updateLandlordPassword({password, id}, (err, results) => {
        console.log({password, id})
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      })
      res.render("ResetPasswordPage", {email: verify.email, status: "verified"});
    } catch (error){
      console.log(error);
    }
  })
};

/**
 * Create Tenant
 * @param {*} req tenant email, password(unhashed),  public_building_id (eg. RC), public_lease_id (eg. YYYY-MM-DD 00:00:00)
 * @param {*} res 
 */
export const controllerCreateTenant = (req, res) => {
  const tenant_email = req.body.email;
  const password = req.body.password;
  const public_building_id = req.body.public_building_id;
  const public_lease_id = req.body.public_lease_id
  console.log(req.body);
  const salt = genSaltSync(10);
  const password_hashed = hashSync(password, salt);
  getTenantByEmail(tenant_email, (err, results) => {
    if (!results){
      createTenant(tenant_email, password_hashed, public_building_id, public_lease_id, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
        return res.status(200).json({
          success: 1,
          message: "created successfully",
          data: results,
        });
      });
    } else{
      return res.status(500).json({
        success: 0,
        message: "Duplicate email entry"
      })
    }
  })


};

export const controllerDeleteAllTenants = (req, res) => {
  deleteAllTenants((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  });
};


export const controllerDeleteTenantByEmail = (req, res) => {
  const body = req.body;
  console.log(body);
  const {email} = body;
  console.log(email);
  deleteTenantByEmail(email, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  });
};

/**
 * Gets tickets
 * @param {*} req 
 * @param {*} res 
 * @returns Tickets
 */
export const controllerGetTickets = (req, res) => {
  getTickets((err, results) => {
    if (err) {
      console.log(err);
      return;
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

/**
 * Gets ticket by service_request_id
 * @param {*} req service_request_id
 * @param {*} res 
 */
export const controllerGetTicketById = (req, res) => {
  const id = req.params.id;
  getTicketById(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

/**
 * Get Tickets by status
 * @param {*} req status
 * @param {*} res 
 */
export const controllerGetTicketsByStatus = (req, res) => {
  const status = req.params.status;
  getTicketsByStatus(status, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Record not found",
      });
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

/**
 * Landlord updates quotation
 * @param {*} req service_request_id, quotation_amount(float, 2dp), status
 * @param {*} res 
 */
export const controllerUpdateQuotation = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  updateQuotation(id, body, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to update user",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });
  });
};

/**
 * store quotation in file system and its path in mysql database
 * @param {formData} req 
 */
export const controllerUploadQuotation = (req, res) => {
  console.log('???????')
  const id = req.params.id;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  const files = req.file;

  console.log(files);

  const filepath = files.path;
  console.log(filepath);

  // get quotation's path in file system and store it in mysql database
  uploadQuotation({filepath, id}, (err, results) => {
    console.log('uploadQuotation results', results)
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to upload file",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });

  })


}

export const controllerGetQuotation = (req, res) => {
  // hard-coded id, remove this in final version
  const id = req.query.id;
  console.log('id in controller', id)
  getQuotationPath(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "service ticket not found",
      });
    } else {
      var filepath = results.quotation_path;
      console.log(filepath);
      if (filepath == null){
        res.send("No quotation uploaded yet!")
        return

      }
      fs.readFile(filepath, (err, data) => {
        if (err) {
          console.log('error')
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        // Set headers for the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
        // Send the PDF file data as the response
        res.send(data);
      });


      if (err){
        return console.log(err);
      }
    }
  });
};

export const controllerTicketApproval = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  let status;
  if (body.ticket_approved_by_landlord === 1) {
    status = "landlord_ticket_approved"
  } else if (body.ticket_approved_by_landlord === 0) {
    status = "landlord_ticket_rejected"
  }

  ticketApproval(id,body,status, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to update user"
      })
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully"
    })
  })
}

export const controllerTicketWork = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  let status;
  if (body.ticket_work_status === 1) {
    status = "landlord_started_work"
  } else if (body.ticket_work_status === 0) {
    status = "landlord_completed_work"
  }

  ticketWork(id,body,status, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to update user"
      })
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully"
    })
  })
}

export const controllerGetTenantAccounts = (req, res) => {
    getTenantAccounts((err, results) => {
      if (err) {
        console.log(err);
        return;
      } else {
        return res.json({
          success: "1",
          data: results,
        });
      }
    });
};


/**
 * store quotation in file system and its path in mysql database
 * @param {formData} req 
 */
export const controllerUploadLease = (req, res) => {
  console.log('???????')
  const id = req.params.id;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  const files = req.file;

  console.log(files);

  const filepath = files.path;
  console.log(filepath);

  // get quotation's path in file system and store it in mysql database
  uploadLease({filepath, id}, (err, results) => {
    console.log('uploadLease results', results)
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Failed to upload file",
      });
    }
    return res.status(200).json({
      success: 1,
      data: "updated successfully!",
    });

  })


}

export const controllerGetLease = (req, res) => {
  // hard-coded id, remove this in final version
  const id = req.query.id;
  console.log('id in controller', id)
  getLeasePath(id, (err, results) => {
    if (err) {
      console.log(err);
      return;
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "service ticket not found",
      });
    } else {
      var filepath = results.pdf_path;
      console.log(filepath);
      if (filepath == null){
        res.send("No quotation uploaded yet!")
        return

      }
      fs.readFile(filepath, (err, data) => {
        if (err) {
          console.log('error')
          console.error(err);
          res.status(500).send("Internal Server Error");
          return;
        }
        // Set headers for the response
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=file.pdf");
        // Send the PDF file data as the response
        res.send(data);
      });


      if (err){
        return console.log(err);
      }
    }
  });
};

/**
 * 
 * @param {object} req 
 * {
 * landlord_email,
 * tenant_email,
 * public_lease_id,
 * floor,
 * unit_number,
 * pdf_path
 * }
 * @param {json} res 
 */
export const controllerCreateLease = (req,res) => {
  let landlordID = "";
  let tenantID = "";
  getLandlordUserId(req.body.landlord_email, (err,results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json({
        success : 0,
        message: "landlord not registered."
      })
    } else {
      landlordID = results.landlord_user_id;
      // console.log(landlordID)
      getTenantUserId(req.body.tenant_email, (err, results) => {
        if (err) {
          console.log(err)
          return
        } if (!results) {
          return res.json({
            success:0,
            message: "tenant not registered."
          })
        } else {
          tenantID = results.tenant_user_id;
          // console.log(tenantID)
          createLease(landlordID, tenantID, req.body, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error"
              });
            } else {
              updateTenantLease(req.body.tenant_email,req.body.public_lease_id, (err,results) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                  })
                } 
              });
              return res.status(200).json({
                success:1,
                data: results
              });
            };
          })
        }
      })
    }
  })
}

/**
 * 
 * @param {object} req 
 * {email}
 * @param {json} res 
 */
export const controllerGetLeaseByLandlord = (req,res) => {
  let landlordID = "";
  getLandlordUserId(req.body.email, (err, results) => {
    if (err) {
      console.log(err)
      return
    } if (!results) {
      return res.json({
        success:0,
        message: "landlord not registered."
      })
    } else {
      landlordID = results.landlord_user_id;
      // console.log(landlordID)
      getLeaseByLandlord(landlordID, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error"
          });
        } else {
          return res.status(200).json({
            success:1,
            data: results
          });
        };
      })
    }
  })
}

export const controllerDeleteLease = (req,res) => {
  deleteLease(req.body.public_lease_id, (err,results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      message: "deleted successfully",
    });
  })
}

export const controllerUpdateLease = (req, res) => {
  let landlordID = "";
  let tenantID = "";
  getLandlordUserId(req.body.landlord_email, (err,results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json({
        success : 0,
        message: "landlord not registered."
      })
    } else {
      landlordID = results.landlord_user_id;
      // console.log(landlordID)
      getTenantUserId(req.body.tenant_email, (err, results) => {
        if (err) {
          console.log(err)
          return
        } if (!results) {
          return res.json({
            success:0,
            message: "tenant not registered."
          })
        } else {
          tenantID = results.tenant_user_id;
          // console.log(tenantID)
          updateLease(landlordID, tenantID, req.body, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                success: 0,
                message: "Database connection error"
              });
            } else {
              updateTenantLease(req.body.tenant_email,req.body.new_public_lease_id, (err,results) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                  })
                } 
              });
              return res.status(200).json({
                success:1,
                data: results
              });
            };
          })
        }
      })
    }
  })
}