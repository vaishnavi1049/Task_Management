const express = require("express");
const router = express.Router();

const {
  completedTasks,
  pendingTasks,
  exportCSV,
  exportExcel,
  employeeWiseReport,
} = require("../controllers/reportController");

const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.get(
  "/completed",
  authenticate,
  authorize("Admin"),
  completedTasks
);

router.get(
  "/pending",
  authenticate,
  authorize("Admin"),
  pendingTasks
);

router.get(
  "/export/csv",
  authenticate,
  authorize("Admin"),
  exportCSV
);

router.get(
  "/export/excel",
  authenticate,
  authorize("Admin"),
  exportExcel
);

router.get(
  "/employee-wise",
  authenticate,
  authorize("Admin"),
  employeeWiseReport
);

module.exports = router;