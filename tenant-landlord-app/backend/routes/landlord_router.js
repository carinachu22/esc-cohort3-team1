import {
  controllerCreateLandlord,
  controllerLoginLandlord,
  controllerCreateTenant,
  controllerGetTickets,
  controllerGetTicketById,
  controllerGetTicketsByStatus,
  controllerUpdateQuotation,
  controllerResetPasswordLandlord,
  controllerResetPasswordPageLandlord,
  controllerForgotPasswordLandlord,
  controllerUploadQuotation,
  controllerGetQuotation,
  controllerTicketApproval,
  controllerTicketWork,
  controllerGetTenantAccounts,
  controllerDeleteAllTenants,
  controllerDeleteTenantByEmail,
  controllerUploadLease,
  controllerGetLease
} from "../controller/landlord_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";
import multer from "multer";





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
router.post("/create", controllerCreateLandlord);
router.post("/login", controllerLoginLandlord);
router.post("/forgot-password", controllerForgotPasswordLandlord);
router.post("/reset-password/:id/:jsontoken", controllerResetPasswordLandlord);
router.post("/createTenant", controllerCreateTenant);
router.post("/uploadQuotation/:id", upload.single('files'), controllerUploadQuotation);
router.post("/uploadLease/:id", upload.single('files'), controllerUploadLease);

router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageLandlord);
router.get("/getTickets", checkToken, controllerGetTickets);
router.get("/getTicketById/:id", checkToken, controllerGetTicketById);
router.get(
  "/getTicketsByStatus/:status",
  checkToken,
  controllerGetTicketsByStatus
);
router.get("/getQuotation/", controllerGetQuotation);
router.get("/getLease/", controllerGetLease);
router.get("/getTenantAccounts/", controllerGetTenantAccounts);
router.patch("/deleteAllTenants", controllerDeleteAllTenants);
router.patch("/deleteTenantByEmail", controllerDeleteTenantByEmail);
router.patch("/updateQuotation/:id", checkToken, controllerUpdateQuotation);
router.patch("/ticketApproval/:id", checkToken, controllerTicketApproval);
router.patch("/ticketWork/:id", checkToken, controllerTicketWork);


export default router;
