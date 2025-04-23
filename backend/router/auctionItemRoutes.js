import {
  addNewAuctionItem,
  getAllItems,
  getAuctionDetails,
  getMyAuctionItems,
  removeFromAuction,
  republishItem,
} from "../controllers/auctionItemController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import express from "express";
import { trackCommissionStatus } from "../middlewares/trackCommissionStatus.js";

const router = express.Router();

// Add a new auction item
router.post(
  "/create",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  trackCommissionStatus,
  addNewAuctionItem
);

// Get all auction items
router.get("/allitems", getAllItems);

router.get("/auction/:id", isAuthenticated, getAuctionDetails);

// Get all auction items of the logged-in auctioneer
router.get(
  "/myitems",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  getMyAuctionItems
);

// Delete an auction item
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  removeFromAuction
);

// Republish an auction item
router.put(
  "/item/republish/:id",
  isAuthenticated,
  isAuthorized("Auctioneer"),
  republishItem
);

export default router;
