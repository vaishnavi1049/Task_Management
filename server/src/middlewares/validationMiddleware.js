const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain a number"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("role")
    .isIn(["Admin", "Employee"])
    .withMessage("Invalid role"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

//login validation

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

//employee validation
const employeeValidation = [
  body("full_name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),

  body("designation")
    .trim()
    .notEmpty()
    .withMessage("Designation is required"),
];


const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .optional(),

  body("priority")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Invalid priority"),

  body("status")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status"),

  body("start_date")
    .notEmpty()
    .withMessage("Start date is required"),

  body("due_date")
    .notEmpty()
    .withMessage("Due date is required")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error("Due date cannot be earlier than start date");
      }
      return true;
    }),

  body("assigned_employee")
    .isInt()
    .withMessage("Assigned employee is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
  employeeValidation,
  taskValidation,
  validate,
};