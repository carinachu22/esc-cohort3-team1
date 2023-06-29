import {
  controllerLoginTenant,
  controllerCreateTicket,
  controllerQuotationApproval
} from "../controller/tenant_controller.js";
import express from "express";
import { checkToken } from "../auth/token_validation.js";

const router = express.Router();

/**
 * API CALLS
 * 1. Login into tenant account
 * 2. Create service ticket
 * 3. Approve/Disapprove quotation
 */

router.post("/login", controllerLoginTenant);
router.post("/createTicket", checkToken, controllerCreateTicket);
router.patch("/quotationApproval/:id", checkToken, controllerQuotationApproval);
export default router;
