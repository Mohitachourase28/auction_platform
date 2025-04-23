import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  deleteAuctionItem,
  deletePaymentProof,
  getAllUsersStats,
  getAllPaymentProofs,
  getPaymentProofDetail,
  getMonthlyRevenue,
  updatePaymentProofStatus,
} from "../controllers/superAdminController.js";

const router = express.Router();

// Auction Management
router.delete(
  "/auctionitem/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deleteAuctionItem
);

// Payment Proofs
router.get(
  "/paymentproofs/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllPaymentProofs
);

router.get(
  "/paymentproof/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getPaymentProofDetail
);

router.put(
  "/paymentproof/status/update/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  updatePaymentProofStatus
);

router.delete(
  "/paymentproof/delete/:id",
  isAuthenticated,
  isAuthorized("Super Admin"),
  deletePaymentProof
);

// Users
router.get(
  "/users/getall",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getAllUsersStats
);

// Revenue
router.get(
  "/monthlyincome",
  isAuthenticated,
  isAuthorized("Super Admin"),
  getMonthlyRevenue
);

export default router;
