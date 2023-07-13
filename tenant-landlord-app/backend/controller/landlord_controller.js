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
} from "../models/landlord_model.js";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


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
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASSWORD
      }
    });
    
    var mailOptions = {
      from: 'wangxingrui2134@gmail.com',
      to: 'wangxingrui2134@gmail.com',
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
