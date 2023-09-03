const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectedDB = require("./config/database");

const app = express();
const port = process.env.port || 5000;

dotenv.config();
connectedDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "안녕하신가?" });
});

app.listen(port, () => console.log(`Server Running ${port}`));
