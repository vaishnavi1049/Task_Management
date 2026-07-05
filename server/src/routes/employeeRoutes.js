const express = require("express");
const router = express.Router();

const { addEmployee, getAllEmployees, getEmployee, editEmployee, removeEmployee, } = require("../controllers/employeeController");

const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  employeeValidation,
  validate,
} = require("../middlewares/validationMiddleware");

// Only Admin can add employees
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  employeeValidation,
  validate,
  addEmployee
);

// Get all employees (Admin only)
router.get(
  "/",
  authenticate,
  authorize("Admin"),
  getAllEmployees
);

router.get(
  "/:id",
  authenticate,
  authorize("Admin"),
  getEmployee
);

router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  employeeValidation,
  validate,
  editEmployee
);

router.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  removeEmployee
);

module.exports = router;