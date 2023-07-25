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
  controllerDeleteAllTenants
} from "../controller/landlord_controller.js";
import express from "express";
import { checkLandlordToken } from "../auth/landlord_validation.js";
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
router.post("/uploadQuotation/:id", upload.single('files'), controllerUploadQuotation)

router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageLandlord);
router.get("/getTickets", checkLandlordToken, controllerGetTickets);
router.get("/getTicketById/:id", checkLandlordToken, controllerGetTicketById);
router.get(
  "/getTicketsByStatus/:status",
  checkLandlordToken,
  controllerGetTicketsByStatus
);
router.get("/getQuotation/", controllerGetQuotation);
router.patch("/deleteAllTenants", controllerDeleteAllTenants);
router.patch("/updateQuotation/:id", checkLandlordToken, controllerUpdateQuotation);
router.patch("/ticketApproval/:id", checkLandlordToken, controllerTicketApproval);
router.patch("/ticketWork/:id", checkLandlordToken, controllerTicketWork);
router.get("/getTenantAccounts/", controllerGetTenantAccounts)

export default router;
