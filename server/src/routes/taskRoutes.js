const express = require("express");
const router = express.Router();

const { addTask, getAllTasks, getTask, editTask, removeTask,} = require("../controllers/taskController");

const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  taskValidation,
  validate,
} = require("../middlewares/validationMiddleware");

// Only Admin can create tasks
router.post(
  "/",
  authenticate,
  authorize("Admin"),
  taskValidation,
  validate,
  addTask
);

router.get(
  "/",
  authenticate,
  getAllTasks
);

router.get(
  "/:id",
  authenticate,
  getTask
);

router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  taskValidation,
  validate,
  editTask
);

router.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  removeTask
);

module.exports = router;