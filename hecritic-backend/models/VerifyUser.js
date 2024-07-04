const mongoose = require("mongoose");

const VerifyUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    collection: "VerifyUser",
  }
);

module.exports = mongoose.model("VerifyUser", VerifyUserSchema);
