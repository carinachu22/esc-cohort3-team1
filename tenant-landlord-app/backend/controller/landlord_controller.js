import {
  createLandlord,
  getLandlordByUsername,
  getLandlordByEmail,
  createTenant,
} from "../models/landlord_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

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
      data: results,
    });
  });
};

export const controllerLoginLandlord = (req, res) => {
  const body = req.body;
  getLandlordByUsername(body.username, (err, results) => {
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
