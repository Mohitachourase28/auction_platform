import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Commission } from "../models/commissionSchema.js";
import { User } from "../models/userSchema.js";
import { Auction } from "../models/auctionSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";


// DELETE /auction-items/:id
export const deleteAuctionItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction not found.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Auction item deleted successfully.",
  });
});

// GET /payment-proofs
export const getAllPaymentProofs = catchAsyncErrors(async (req, res, next) => {
  const paymentProofs = await PaymentProof.find();
  res.status(200).json({
    success: true,
    data: paymentProofs,
  });
});

// GET /payment-proofs/:id
export const getPaymentProofDetail = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const paymentProofDetail = await PaymentProof.findById(id);
  if (!paymentProofDetail) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  res.status(200).json({
    success: true,
    data: paymentProofDetail,
  });
});

// PUT /payment-proofs/:id/status
export const updatePaymentProofStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { amount, status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid ID format.", 400));
  }

  const updateFields = {};
  if (status !== undefined) updateFields.status = status;
  if (amount !== undefined) updateFields.amount = amount;

  const updatedProof = await PaymentProof.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedProof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Payment proof updated.",
    data: updatedProof,
  });
});

// DELETE /payment-proofs/:id
export const deletePaymentProof = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid Id format.", 400));
  }
  const proof = await PaymentProof.findById(id);
  if (!proof) {
    return next(new ErrorHandler("Payment proof not found.", 404));
  }
  await proof.deleteOne();
  res.status(200).json({
    success: true,
    message: "Payment proof deleted.",
  });
});

// GET /users
export const getAllUsersStats = catchAsyncErrors(async (req, res, next) => {
  const users = await User.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          role: "$role",
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id.month",
        year: "$_id.year",
        role: "$_id.role",
        count: 1,
        _id: 0,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  const bidders = users.filter((user) => user.role === "Bidder");
  const auctioneers = users.filter((user) => user.role === "Auctioneer");

  const transformDataToMonthlyArray = (data, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);
    data.forEach((item) => {
      result[item.month - 1] = item.count;
    });
    return result;
  };

  res.status(200).json({
    success: true,
    data: {
      bidders: transformDataToMonthlyArray(bidders),
      auctioneers: transformDataToMonthlyArray(auctioneers),
    },
  });
});

// GET /revenue/monthly
export const getMonthlyRevenue = catchAsyncErrors(async (req, res, next) => {
  const payments = await Commission.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  const transformDataToMonthlyArray = (payments, totalMonths = 12) => {
    const result = Array(totalMonths).fill(0);
    payments.forEach((payment) => {
      result[payment._id.month - 1] = payment.totalAmount;
    });
    return result;
  };

  res.status(200).json({
    success: true,
    data: transformDataToMonthlyArray(payments),
  });
});
