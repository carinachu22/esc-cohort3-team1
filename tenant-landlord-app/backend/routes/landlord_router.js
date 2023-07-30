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
  controllerGetLease,
  controllerCreateLease,
  controllerGetLeaseByLandlord,
  controllerDeleteLease,
  controllerUpdateLease,
  controllerGetLeaseDetails
} from "../controller/landlord_controller.js";
import express from "express";
import { checkLandlordToken } from "../auth/landlord_validation.js";
import multer from "multer";
import { deleteLease } from "../models/landlord_model.js";





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
router.post("/create", checkLandlordToken, controllerCreateLandlord);

router.post("/login", controllerLoginLandlord);
router.post("/forgot-password", controllerForgotPasswordLandlord);
router.post("/reset-password/:id/:jsontoken", controllerResetPasswordLandlord);
router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageLandlord);

router.post("/createTenant", controllerCreateTenant);
router.post("/uploadLease/:id", upload.single('files'), controllerUploadLease);
router.get("/getLease/", controllerGetLease);

router.post("/createLease", controllerCreateLease);
router.get("/getLeaseByLandlord", controllerGetLeaseByLandlord);
router.get("/getLeaseDetails", controllerGetLeaseDetails);
router.patch("/deleteLease", controllerDeleteLease)
router.patch("/updateLease", controllerUpdateLease)

router.get("/getTickets", controllerGetTickets);
router.get("/getTicketById/:id", controllerGetTicketById);
router.get("/getTicketsByStatus/:status", controllerGetTicketsByStatus);

router.get("/getQuotation/", controllerGetQuotation);
router.post("/uploadQuotation/:id", upload.single('files'), controllerUploadQuotation);
router.patch("/updateQuotation/:id", controllerUpdateQuotation);

router.patch("/ticketApproval/:id", controllerTicketApproval);
router.patch("/ticketWork/:id", controllerTicketWork);

router.get("/getTenantAccounts/", controllerGetTenantAccounts);
router.patch("/deleteAllTenants", controllerDeleteAllTenants);
router.patch("/deleteTenantByEmail", controllerDeleteTenantByEmail);


export default router;
