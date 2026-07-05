const bcrypt = require("bcrypt");
const db = require("../config/db");

const {
  findEmployeeByEmail,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../models/employeeModel");

const addEmployee = async (req, res) => {
  const { full_name, email, password, department, designation } = req.body;

  try {
    // Check if email already exists
    const existingUser = await findEmployeeByEmail(email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.beginTransaction(async (err) => {
      if (err) throw err;

      try {
        // Insert into users table
        db.query(
          `INSERT INTO users (full_name, email, password, role)
           VALUES (?, ?, ?, ?)`,
          [full_name, email, hashedPassword, "Employee"],
          (err, userResult) => {

            if (err) {
              return db.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: "Failed to create user",
                });
              });
            }

            const userId = userResult.insertId;

            // Insert into employees table
            db.query(
              `INSERT INTO employees (user_id, department, designation)
               VALUES (?, ?, ?)`,
              [userId, department, designation],
              (err) => {

                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({
                      success: false,
                      message: "Failed to create employee",
                    });
                  });
                }

                db.commit((err) => {

                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({
                        success: false,
                        message: "Transaction failed",
                      });
                    });
                  }

                  res.status(201).json({
                    success: true,
                    message: "Employee added successfully",
                  });

                });

              }
            );

          }
        );

      } catch (error) {

        db.rollback(() => {
          res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
        });

      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const getAllEmployees = async (req, res) => {
  try {
    const search = req.query.search || "";

    const allowedSortFields = [
      "full_name",
      "email",
      "department",
      "designation",
      "id",
    ];

    const sort = allowedSortFields.includes(req.query.sort)
      ? req.query.sort
      : "id";

    const order =
      req.query.order &&
      req.query.order.toUpperCase() === "DESC"
        ? "DESC"
        : "ASC";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const employees = await getEmployees(
      search,
      sort,
      order,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      count: employees.length,
      page,
      limit,
      data: employees,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const getEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee[0],
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const editEmployee = async (req, res) => {
  try {
    const { full_name, email, department, designation } = req.body;

    const employee = await getEmployeeById(req.params.id);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await updateEmployee(req.params.id, {
      full_name,
      email,
      department,
      designation,
    });

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const removeEmployee = async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await deleteEmployee(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployee,
  editEmployee,
  removeEmployee,
};