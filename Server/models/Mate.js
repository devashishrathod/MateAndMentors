const mongoose = require("mongoose");

const mateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String },
    email: { type: String, lowercase: true, trim: true },
    mobile: { type: Number },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    pricePerHour: { type: Number, required: true, index: true },
    experience: { type: Number, required: true, index: true },
    specifications: { type: [String], default: [], index: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Mate", mateSchema);
