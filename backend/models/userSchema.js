import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minLength: [3, "Username must contain at least 3 characters."],
    maxLength: [40, "Username cannot exceed 40 characters."],
  },
  password: {
    type: String,
    required: true,
    select: false, // fixed from 'selected'
    minLength: [8, "Password must contain at least 8 characters."],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: String,
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v);
      },
      message: "Phone Number must contain exactly 11 digits.",
    },
  },
  profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    easypaisa: {
      easypaisaAccountNumber: String,
    },
    paypal: {
      paypalEmail: String,
    },
  },
  role: {
    type: String,
    enum: ["Auctioneer", "Bidder", "Super Admin"],
    default: "Bidder",
  },
  unpaidCommission: {
    type: Number,
    default: 0,
  },
  auctionsWon: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
