import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your shop name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
    },
    requestDistributor: {
      type: String,
      enum: ["pending", "process", "allocated"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["shop", "admin", "distributor"],
      default: "shop",
      required: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    bio: {
      type: String,
      required: false,
    },
    isBanned: {
      type: Boolean,
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["khalti", "cash"],
      default: "cash",
    },
  },
  { timestamps: true }
);

// Pre hooks->Check the password if modified then hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password for the login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Returns true or false
};

const User = mongoose.model("User", userSchema);

export default User;
