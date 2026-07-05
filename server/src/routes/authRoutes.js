const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

const { register, login, profile } = require("../controllers/authController");
const {
    registerValidation,
    loginValidation,
    validate,
} = require("../middlewares/validationMiddleware");

router.post(
    "/register",
    registerValidation,
    validate,
    register
);

router.post(
    "/login",
    loginValidation,
    validate,
    login
);

router.get("/profile", authenticate, profile);

module.exports = router;