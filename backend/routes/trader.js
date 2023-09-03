const express = require("express");
const router = express.Router();

const {
  createTrader,
  readTrader,
  updateTrader,
  deleteTrader,
} = require("../controller/trader");

router.post("/traders", createTrader);
router.get("/traders", readTrader);
router.put("/traders/:id", updateTrader);
router.delete("/traders/:id", deleteTrader);
