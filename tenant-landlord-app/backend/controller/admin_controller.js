import {
  createAdmin,
  createLandlord,
  getAdminByEmail,
  getAdminById,
  getLandlordByEmail,
  deleteLandlordByEmail,
  createBuilding,
  updateAdminPassword,
  getAllTickets,
  getAllLandlordAccounts,
  getAllTenantAccounts,
  modifyTicket,
  getBuildings,
  recoverLandlordAccount,
} from "../models/admin_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
//import formidable from "formidable";
import { send } from "process";

/**
 * Create Admin account
 * @param {*} req email, password(unhashed)
 * @param {*} res
 */
export const controllerCreateAdmin = (req, res) => {
  const body = req.body;
  const email = body.email;
  getAdminByEmail(body.email, (err, result) => {
    if (!result) {
      console.log(body);
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      createAdmin(body, (err, results) => {
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
    } else {
      return res.status(500).json({
        success: 0,
        message: "duplicate email",
      });
    }
  });
};

/**
 * Create landlord account
 * @param {*} req email, password(unhashed), ticket_type
 * @param {*} res
 */
export const controllerCreateLandlord = (req, res) => {
  const body = req.body;
  const email = body.email;
  getLandlordByEmail(email, (err, results) => {
    console.log("results", results);
    if (results.length == 0) {
      console.log(body);
      if (body.role !== "staff") {
        body.ticket_type = null;
      }
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
    } else if (results.deleted_date != null) {
      if (body.role !== "staff") {
        body.ticket_type = null;
      }
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const id = results.landlord_user_id;
      //recover landlord account
      recoverLandlordAccount(body, id, (err, results) => {
        console.log("recovered", results);
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
    } else {
      return res.status(500).json({
        success: 0,
        message: "duplicate email",
      });
    }
  });
};

/**
 * Login for Admin
 * @param {*} req Admin email
 * @param {*} res
 */
export const controllerLoginAdmin = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getAdminByEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
    console.log(body.password, results.password);
    const password_check = compareSync(body.password, results.password);
    console.log(password_check);
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
      console.log(results);
      res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
  });
};

export const controllerForgotPasswordAdmin = (req, res) => {
  const body = req.body;
  console.log(body.email);
  getAdminByEmail(body.email, (err, results) => {
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
    const jsontoken = jwt.sign(
      { email: results.email, id: results.admin_user_id },
      secret,
      { expiresIn: 300 }
    );
    const link = `http://localhost:5000/api/admin/reset-password/${results.admin_user_id}/${jsontoken}`;

    ////// NODEMAILER FEATURE ///////
    ///// nodemailer feature starts from here //////
    var transporter = nodemailer.createTransport({
      service: "gmail",
      //sender email and password
      // you can obtain the password in the following steps:
      // 1. Sign in to gmail
      // 2. go to "manage google account"
      // 3. go to "Security"
      // 4. click on "2-step verification"
      // 5. go to "App passwords" and add a password to a "custom name" app
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.AUTH_USER,
      to: results.email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.json({
          success: 0,
          message: "Error sending email.",
        });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({
          success: 1,
          message: "Reset password link sent to your email.",
        });
      }
    });
    ///// nodemailer feature ends here /////
  });
};

/**
 * Reset password of admin. The admin is accessed in the database using their id
 * @param {*} req admin_user_id
 * @param {*} res email, password
 */
export const controllerResetPasswordAdmin = async (req, res) => {
  const { id, jsontoken } = req.params;
  console.log({ id, jsontoken });
  var { password, confirmPassword } = req.body;
  console.log({ password, confirmPassword });
  const salt = genSaltSync(10);
  password = hashSync(password, salt);

  getAdminById(id, (err, results) => {
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
      updateAdminPassword({ password, id }, (err, results) => {
        console.log({ password, id });
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection error",
          });
        }
      });
      res.render("ResetPasswordPage", {
        email: verify.email,
        status: "verified",
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export const controllerResetPasswordPageAdmin = async (req, res) => {
  const { id, jsontoken } = req.params;
  console.log(req.params);
  getAdminById(id, (err, results) => {
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
      return res.render("ResetPasswordPage", {
        email: verify.email,
        status: "not verified",
      });
    } catch (error) {
      console.log(error);
      res.send("Not Verified!");
    }
  });
};

export const controllerDeleteLandlordByEmail = (req, res) => {
  const body = req.body;
  console.log(body);
  const { email } = body;
  console.log(email);
  deleteLandlordByEmail(email, (err) => {
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
 * Create Building
 * @param {*} req public_building_id(RC, FC), building_name, address,postal_code
 * @param {*} res
 */
export const controllerCreateBuilding = (req, res) => {
  const body = req.body;
  createBuilding(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    } else {
      return res.status(200).json({
        success: 1,
        data: results,
      });
    }
  });
};

export const controllerGetTickets = (req, res) => {
  getAllTickets((err, results) => {
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

export const controllerGetAllLandlordAccounts = (req, res) => {
  const query = req.query;
  const { landlordEmail, ticket_type } = query;
  console.log("email", landlordEmail);
  console.log(ticket_type);
  getLandlordByEmail(landlordEmail, (err, results) => {
    console.log(results);
    if (err) {
      console.log(err);
      return;
    } else {
      getAllLandlordAccounts((err, results) => {
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
    }
  });
};

export const controllerGetAllTenantAccounts = (req, res) => {
  getAllTenantAccounts((err, results) => {
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

export const controllerModifyTicket = (req, res) => {
  const body = req.body;
  console.log("req.body", body);
  modifyTicket(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    } else {
      return res.status(200).json({
        success: 1,
        data: results,
      });
    }
  });
};

export const controllerGetBuildings = (req, res) => {
  getBuildings((err, results) => {
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
