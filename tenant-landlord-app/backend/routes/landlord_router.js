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
} from "../controller/landlord_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";

const router = express.Router();

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
router.post("./createTenant", controllerCreateTenant);
router.get("/reset-password/:id/:jsontoken", controllerResetPasswordPageLandlord);
router.get("/getTickets", checkToken, controllerGetTickets);
router.get("/getTicketById/:id", checkToken, controllerGetTicketById);
router.get(
  "/getTicketsByStatus/:status",
  checkToken,
  controllerGetTicketsByStatus
);
router.patch("/updateQuotation/:id", checkToken, controllerUpdateQuotation);

export default router;
