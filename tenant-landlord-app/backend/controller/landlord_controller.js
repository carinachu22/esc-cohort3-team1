import {
  createLandlord,
  getLandlordByEmail,
  createTenant,
  getTickets,
  getTicketById,
  getTicketsByStatus,
  updateQuotation,
} from "../models/landlord_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Create landlord account
 * @param {*} req email, password(unhashed), ticket_type
 * @param {*} res 
 */
export const controllerCreateLandlord = (req, res) => {
  const body = req.body;
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
};

/**
 * Login for landlord
 * @param {*} req landlord email
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
        data: "Invalid email or password",
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
        data: "Invalid email or password",
      });
    }
  });
};

/**
 * Create Tenant
 * @param {*} req tenant email, password(unhashed)
 * @param {*} res 
 */
export const controllerCreateTenant = (req, res) => {
  const body = req.body;
  console.log(body);
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  createTenant(body, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error",
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
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
