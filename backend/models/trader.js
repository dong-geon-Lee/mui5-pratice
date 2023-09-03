const mongoose = require("mongoose");

const traderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: String,
    },
    joinDate: {
      type: Date,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trader", traderSchema);
