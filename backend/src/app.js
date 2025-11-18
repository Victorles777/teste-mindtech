const express = require("express");
const cors = require("cors");
const path = require("path");

const subscribeRoutes = require("./routes/subscribe");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mindtechiot", subscribeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API MindTech IoT Online" });
});

module.exports = app;
