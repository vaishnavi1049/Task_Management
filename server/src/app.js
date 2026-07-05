const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Employee Task Management API");
});

module.exports = app;