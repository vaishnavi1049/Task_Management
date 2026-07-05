const express = require("express");
const router = express.Router();

const { dashboard } = require("../controllers/dashboardController");

const authenticate = require("../middlewares/authMiddleware");

router.get(
  "/",
  authenticate,
  dashboard
);

module.exports = router;