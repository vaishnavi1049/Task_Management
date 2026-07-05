const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const {
  findUserByEmail,
  createUser,
  updateRememberToken,
} = require("../models/authModel");


const register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    const existingUser = await findUserByEmail(email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
      full_name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await findUserByEmail(email);

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    if (rememberMe) {
      await updateRememberToken(user[0].id, token);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user[0].id,
        full_name: user[0].full_name,
        email: user[0].email,
        role: user[0].role,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const profile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  profile,
};