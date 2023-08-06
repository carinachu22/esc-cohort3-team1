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
  // controllerGetLeaseByLandlord,
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

router.post("/createTenant", checkLandlordToken, controllerCreateTenant);
router.post("/uploadLease/", checkLandlordToken, upload.single('files'), controllerUploadLease);
router.get("/getLease/", checkLandlordToken, controllerGetLease);

router.post("/createLease", checkLandlordToken, upload.single('files'), controllerCreateLease);
// router.get("/getLeaseByLandlord", checkLandlordToken, controllerGetLeaseByLandlord);
router.get("/getLeaseDetails", checkLandlordToken, controllerGetLeaseDetails);
router.patch("/deleteLease", checkLandlordToken, controllerDeleteLease)
// router.patch("/updateLease", checkLandlordToken, controllerUpdateLease)

router.get("/getTickets", checkLandlordToken, controllerGetTickets);
router.get("/getTicketById/", checkLandlordToken, controllerGetTicketById);
router.get("/getTicketsByStatus/:status", checkLandlordToken, controllerGetTicketsByStatus);

router.get("/getQuotation/", checkLandlordToken, controllerGetQuotation);
router.post("/uploadQuotation/", checkLandlordToken, upload.single('files'), controllerUploadQuotation);
// router.patch("/updateQuotation/:id", checkLandlordToken, controllerUpdateQuotation);

router.patch("/ticketApproval/", checkLandlordToken, controllerTicketApproval);
router.patch("/ticketWork/", checkLandlordToken, controllerTicketWork);

router.get("/getTenantAccounts/", controllerGetTenantAccounts);
router.patch("/deleteAllTenants", controllerDeleteAllTenants);
router.patch("/deleteTenantByEmail", controllerDeleteTenantByEmail);


export default router;
