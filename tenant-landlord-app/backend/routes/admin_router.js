import {
  controllerCreateLandlord,
  controllerLoginAdmin,
  controllerCreateAdmin,
  controllerDeleteLandlordByEmail,
  controllerCreateBuilding,
  controllerForgotPasswordAdmin,
  controllerResetPasswordAdmin,
  controllerResetPasswordPageAdmin,
} from "../controller/admin_controller.js";
import express from "express";
import { checkAdminToken } from "../auth/admin_validation.js";
import multer from "multer";
import {
  controllerGetTickets,
  controllerGetTicketById,
  controllerCreateTenant,
  controllerDeleteAllTenants,
  controllerDeleteTenantByEmail,
} from "../controller/landlord_controller.js";
import { controllerCreateTicket } from "../controller/tenant_controller.js";

const router = express.Router();

// set storage in disk
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/uploads")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname  )
  }
})
var upload = multer({ storage: storage })

/**
 * API CALLS
 * 1. Create landlord account
 * 2. Login into landlord account
 * 3. View and update service ticket
 */

// Be wary about the singular/plural of "Ticket"

//ADMIN EXCLUSIVE PRIVILEGES
router.post("/create", controllerCreateAdmin);
router.post("/login", controllerLoginAdmin);
router.post("/forgot-password", controllerForgotPasswordAdmin);

router.post("/reset-password/:id/:jsontoken", controllerResetPasswordAdmin);
router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageAdmin);

router.post("/createLandlord", checkAdminToken, controllerCreateLandlord);
router.patch("/deleteLandlordByEmail", checkAdminToken, controllerDeleteLandlordByEmail);
router.post("/createBuilding", checkAdminToken, controllerCreateBuilding);

//LANDLORD PRIVILEGES

router.post("/createTenant", checkAdminToken, controllerCreateTenant);
router.get("/getTicket/:id", checkAdminToken, controllerGetTicketById);
router.get("/getTickets", checkAdminToken, controllerGetTickets);
router.post("/createTicket", checkAdminToken, controllerCreateTicket);
router.patch("/deleteAllTenants", checkAdminToken, controllerDeleteAllTenants);
router.patch("/deleteTenantByEmail", checkAdminToken, controllerDeleteTenantByEmail);

// TODO: Do we want a generic API to patch any fields of a service ticket?
//router.patch("/updateTicket/:id", controllerUpdateTicket);

export default router;
