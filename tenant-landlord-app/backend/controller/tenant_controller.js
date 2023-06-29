import {
  getTenantByUsername,
  getTenantByID,
  createTicket
} from "../models/tenant_model.js";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";


export const controllerLoginTenant = (req, res) => {
  const body = req.body;
  getTenantByUsername(body.username, (err, results) => {
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

  getTenantByID(body.tenant_user_id, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error"
      });
    } else if (!results) {
      return res.json({
        success: 0,
        message: "Tenant user not found"
      });
    } else if (results) {
      const lease_id = results.lease_id

      createTicket(lease_id, body, (err,results) => {
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
};
