import {
  getTenantByUsername,
  createTicket,
  quotationApproval
} from "../models/tenant_model.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";


export const controllerLoginTenant = (req, res) => {
  const body = req.body;
  getTenantByUsername(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        data: "Invalid username or password",
      });
    }

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
