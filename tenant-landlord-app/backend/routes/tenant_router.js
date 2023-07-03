import {
  controllerLoginTenant,
  controllerGetTickets,
  controllerGetTicketsByStatus,
  controllerCreateTicket,
  controllerQuotationApproval,
  controllerAddFeedbackRating,
  controllerAddFeedbackText
} from "../controller/tenant_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";

const router = express.Router();

/**
 * API CALLS
 * 1. Login into tenant account
 * 2. Create service ticket
 * 3. Approve/Disapprove quotation
 * 4. View tenant's service tickets
 * 5. View tenant's service tickets by status
 */

router.post("/login", controllerLoginTenant);
router.post("/createTicket", checkToken, controllerCreateTicket);
router.patch("/quotationApproval/:id", checkToken, controllerQuotationApproval);
router.get("/getTickets",checkToken, controllerGetTickets);
router.get("/getTicketsByStatus/:status",checkToken, controllerGetTicketsByStatus);
router.patch("/addFeedbackRating/:id", checkToken, controllerAddFeedbackRating);
router.patch("/addFeedbackText/:id", checkToken, controllerAddFeedbackText);
export default router;