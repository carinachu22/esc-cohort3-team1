import {
  getTenantByEmail,
  getTicketsByTenant,
  getTicketsByStatus,
  createTicket,
  quotationApproval,
  addFeedbackRating,
  addFeedbackText,
  closeTicketStatus
} from "../models/tenant_model.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";


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
    console.log(results);
    if (!results) {
      return res.json({
        success: 0,
        data: "Invalid username or password",
      });
    }
    
    console.log(body.password, results.password);
    const password_check = compareSync(body.password, results.password);
    if (password_check) {
      results.password = undefined;
      const jsontoken = jwt.sign({ result: results }, "qwe1234", {
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

/**
 * Create Ticket
 * @param {*} req name, email, request_type, request_description, submitted_date_time(Date Type)
 * @param {*} res 
 */
export const controllerCreateTicket = (req, res) => {
  const body = req.body;
  createTicket(body, (err,results) => {
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

/**
 * Get Tickets
 * @param {*} req tenant email
 * @param {*} res 
 */
export const controllerGetTickets = (req, res) => {
  const email = req.body.email;
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

/**
 * Get Quotation Approved
 * @param {*} req service_ticket_id, quotation_accepted_by_tenant == 0/1
 * @param {*} res 
 */
export const controllerQuotationApproval = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  let status;
  if (body.quotation_accepted_by_tenant === 1) {
    status = "ticket_quotation_approved"
  } else if (body.quotation_accepted_by_tenant === 0) {
    status = "ticket_quotation_rejected"
  }

  quotationApproval(id,body,status, (err, results) => {
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
 * Add Feedback Rating
 * @param {int} req feedback_rating(int, between 1-5)
 * @param {*} res 
 */
export const controllerAddFeedbackRating = (req, res) => {
  const id = req.params.id;
  const feedback_rating = req.feedback_rating; 
  console.log(body)
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
 * Add Feedback Text
 * @param {*} req feedback_text
 * @param {*} res 
 */
 export const controllerAddFeedbackText = (req, res) => {
  const id = req.params.id;
  const  feedback_text = req.feedback_text; 
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
 * Update Close Ticket Status
 * @param {*} req  status == "close"
 * @param {*} res 
 */
export const controllerCloseTicketStatus = (req, res) => {
  const id = req.params.id;
  const status = req.status;
  let status_input;
  if (status == "close") {
     status_input = "ticket_close"
   } else {
    status_input = "close_attempt_failed"
   }
  
  closeTicketStatus (id, status_input, (err,results) => {
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

