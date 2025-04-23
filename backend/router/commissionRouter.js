import express from "express";
import { proofOfCommission,  getAllProofs } from "../controllers/commissionController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post(
  "/proof",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  proofOfCommission
);


// Example: Get all proofs submitted by the logged-in user
router.get(
  "/proof",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getAllProofs
);

export default router;
