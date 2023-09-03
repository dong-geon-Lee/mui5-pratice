const Trader = require("../models/trader");

const createTrader = async (req, res) => {
  try {
    const { name, age, joinDate, role } = req.body;
    const trader = new Trader({ name, age, joinDate, role });
    await trader.save();

    res.json(trader);
  } catch (error) {
    res.status(500).json({ error: "Failed to create trader" });
  }
};

const readTrader = async (req, res) => {
  try {
    const traders = await Trader.find();

    res.json(traders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch traders" });
  }
};

const updateTrader = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, joinDate, role } = req.body;
    const trader = await Trader.findByIdAndUpdate(
      id,
      { name, age, joinDate, role },
      { new: true }
    );

    res.json(trader);
  } catch (error) {
    res.status(500).json({ error: "Failed to update trader" });
  }
};

const deleteTrader = async (req, res) => {
  try {
    const { id } = req.params;
    await Trader.findByIdAndDelete(id);

    res.json({ message: "Trader deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete trader" });
  }
};

module.exports = { createTrader, readTrader, updateTrader, deleteTrader };
