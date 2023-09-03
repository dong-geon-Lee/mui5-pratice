const express = require("express");
const router = express.Router();

const {
  createTrader,
  readTrader,
  updateTrader,
  deleteTrader,
} = require("../controller/trader");

router.post("/", createTrader);
router.get("/", readTrader);
router.put("/:id", updateTrader);
router.delete("/:id", deleteTrader);

module.exports = router;
