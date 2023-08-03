import {
  getTenantByEmail,
  getTenantById,
  updateTenantPassword,
  getTicketsByTenant,
  getTicketsByStatus,
  createTicket,
  quotationApproval,
  addFeedbackRating,
  addFeedbackText,
  closeTicketStatus,
  getTicketById,
  getTenantUserId,
  getLeaseByTenant,
  getQuotation,
  getQuotationPath,
  getLeaseByTenantEmail,
  rejectTicketWork
} from "../models/tenant_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";


/**
 * Login Tenant
 * @param {*} req email, password(unhashed)
 * @param {*} res 
 */
export const controllerLoginTenant = (req, res) => {
  const body = req.body;
  getTenantByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    else if (results.length === 0 || results[0].deleted_date != null) {
      return res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
    console.log(body.password, results[0].password);
    const password_check = compareSync(body.password, results[0].password);
    if (password_check) {
      results[0].password = undefined;
      const jsontoken = jwt.sign({ result: results[0] }, "paolom8", {
        expiresIn: "1h",
      });
      return res.json({
        success: 1,
        message: "Login successfully",
        token: jsontoken,
      });
    } else {
      res.json({
        success: 0,
        data: "Invalid email or password",
      });
    }
  });
};

export const controllerForgotPasswordTenant = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getTenantByEmail(body.email, (err, results) => {
    console.log(results[0]);
    if (err) {
      console.log(err);
    }
    if (results.length === 0 || results[0].deleted_date != null) {
      return res.json({
        success: 0,
        message: "User does not exist!",
      });
    }
    const secret = process.env.JWT_SECRET + results[0].password;
    const jsontoken = jwt.sign({email: results[0].email, id: results[0].tenant_user_id}, secret, {expiresIn: 300});
    const link = `http://localhost:5000/api/tenant/reset-password/${results[0].tenant_user_id}/${jsontoken}`;

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
    
    let mailOptions = {
      from: process.env.AUTH_USER,
      to: results[0].email,
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

export const controllerResetPasswordPageTenant = async (req, res) => {
  const {id, jsontoken} = req.params;
  console.log("req.params", req.params);
  getTenantById(id, (err, results) => {
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
 * Reset password of tenant. The tenant is accessed in the database using their id
 * @param {*} req tenant_user_id
 * @param {*} res email, password
 */
export const controllerResetPasswordTenant = async (req, res) => {
  const {id, jsontoken} = req.params;
  console.log({id, jsontoken});
  var {password, confirmPassword} = req.body;
  console.log({password, confirmPassword});
  const salt = genSaltSync(10);
  password = hashSync(password, salt);

  getTenantById(id, (err, results) => {
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
      updateTenantPassword({password, id}, (err, results) => {
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
 * Create Ticket
 * @param {*} req public_service_request_id (eg. 2023-01-01 00:00:00), name, email, request_type, request_description, quptation_path, submitted_date_time(Date Type)
 * @param {*} res 
 */
export const controllerCreateTicket = (req, res) => {
  const body = req.body;
  const tenantEmail = req.body.email;
  console.log("tenantEmail", tenantEmail);
  console.log("req.body", body);
  getLeaseByTenantEmail(tenantEmail, (err,results) => {
    console.log("results", results);
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error"
      });
    } else {
      if (results[0] === undefined){
        return res.status(200).json({
          success: 0,
          message: "You do not have a lease attached. Please contact your landlord."
        })
      }
      const floor = results[0].floor;
      const unit_number = results[0].unit_number;
      console.log("floor", floor);
      createTicket(body, floor, unit_number, (err,results) => {
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
    };
  })

};

/**
 * Get Tickets
 * @param {*} req tenant email
 * @param {*} res 
 */
export const controllerGetTickets = (req, res) => {
  const email = req.query.email;
  getTicketsByTenant(email, (err,results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error"
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
 * Get Tickets By Status
 * @param {*} req tenant email, status
 * @param {*} res 
 */
export const controllerGetTicketsByStatus = (req, res) => {
  const email = req.body.email;
  const status = req.params.status;
  getTicketsByStatus(email, status, (err,results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error"
      });
    } else {
      return res.json({
        success: "1",
        data: results,
      });
    }
  });
};

export const controllerGetTicketById = (req, res) => {
  const id = req.query.id;
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
 * Get Quotation Approved
 * @param {*} req public_service_request_id (YYYY-MM-DD 00:00:00), quotation_accepted_by_tenant == 0/1
 * @param {*} res 
 */
export const controllerQuotationApproval = (req, res) => {
  const id = req.body.ticket_id;
  const body = req.body;
  let status;
  if (body.quotation_accepted_by_tenant === 1) {
    status = "ticket_quotation_approved"
  } else if (body.quotation_accepted_by_tenant === 0) {
    status = "ticket_quotation_rejected"
  }

  quotationApproval(id, status, (err, results) => {
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

/**
 * Add Feedback Rating, params: public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} req feedback_rating(int, between 1-5)
 * @param {*} res 
 */
export const controllerAddFeedbackRating = (req, res) => {
  const id = req.body.ticket_id;
  const feedback_rating = req.body.feedback_rating; 
  console.log("feedback_rating", feedback_rating)
  addFeedbackRating(id, feedback_rating, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json ({
        success : 0,
        message: "Failed to update user"
      })
    } return res.status(200).json({
      success: 1,
      data: "updated sucessfully"
    })
  })
}

/**
 * Add Feedback Text, params: public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} req  feedback_text
 * @param {*} res 
 */
 export const controllerAddFeedbackText = (req, res) => {
  const id = req.body.ticket_id;
  const feedback_text = req.body.feedback_text; 
  addFeedbackText (id, feedback_text, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json ({
        success : 0,
        message: "Failed to update user"
      })
    } return res.status(200).json({
      success: 1,
      data: "updated sucessfully"
    })
  })
}

/**
 * Update Close Ticket Status, params: public_service_request_id (YYYY-MM-DD 00:00:00)
 * @param {*} req status == "close"
 * @param {*} res 
 */
export const controllerCloseTicketStatus = (req, res) => {
  const id = req.body.ticket_id;
  const body = req.body;
  let status;
  if (body.status == "close") {
     status = "landlord_ticket_closed"
   } else {
    status = "close_attempt_failed"
   }
  
  closeTicketStatus (id, status, (err,results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json ({
        success : 0,
        message: "Failed to update user"
      })
    } return res.status(200).json({
      success: 1,
      data: "updated sucessfully"
    })
  })
}

export const controllerRejectTicketWork = (req, res) => {
  const id = req.body.ticket_id;
  const body = req.body;
  console.log(body.status)
  let status;
  if (body.status === "work_rejected") {
     status = "ticket_work_rejected"
   } else {
    status = "reject_attempt_failed"
   }
  
  rejectTicketWork (id, status, (err, results) => {
    if (err) {
      console.log(err);
      return;
    } if (!results) {
      return res.json ({
        success : 0,
        message: "Failed to update user"
      })
    } return res.status(200).json({
      success: 1,
      data: "updated sucessfully"
    })
  })
}

/**
 * 
 * @param {object} req 
 * {email}
 * @param {json} res 
 */
export const controllerGetLeaseByTenant = (req,res) => {
  let tenantID = "";
  getTenantUserId(req.body.email, (err, results) => {
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
      getLeaseByTenant(tenantID, (err, results) => {
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

export const controllerGetQuotation = (req, res) => {
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

