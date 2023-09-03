const mongoose = require("mongoose");

const traderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    joinDate: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trader", traderSchema);
