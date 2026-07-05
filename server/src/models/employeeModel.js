const db = require("../config/db");

// Check if email already exists
const findEmployeeByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// Insert into users table
const createUser = (user) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [user.full_name, user.email, user.password, "Employee"],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// Insert into employees table
const createEmployee = (employee) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO employees (user_id, department, designation)
       VALUES (?, ?, ?)`,
      [employee.user_id, employee.department, employee.designation],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getEmployees = (search, sort, order, limit, offset) => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT
        e.id,
        u.full_name,
        u.email,
        e.department,
        e.designation,
        u.role
      FROM employees e
      INNER JOIN users u
      ON e.user_id = u.id
      WHERE
        u.full_name LIKE ?
        OR u.email LIKE ?
        OR e.department LIKE ?
        OR e.designation LIKE ?
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    db.query(
      query,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        Number(limit),
        Number(offset),
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};


const getEmployeeById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        e.id,
        u.full_name,
        u.email,
        e.department,
        e.designation,
        u.role
      FROM employees e
      INNER JOIN users u
      ON e.user_id = u.id
      WHERE e.id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateEmployee = (id, employee) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users u
      JOIN employees e
      ON u.id = e.user_id
      SET
        u.full_name = ?,
        u.email = ?,
        e.department = ?,
        e.designation = ?
      WHERE e.id = ?
    `;

    db.query(
      query,
      [
        employee.full_name,
        employee.email,
        employee.department,
        employee.designation,
        id,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const deleteEmployee = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
      DELETE u, e
      FROM users u
      INNER JOIN employees e
      ON u.id = e.user_id
      WHERE e.id = ?
    `;

    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  findEmployeeByEmail,
  createUser,
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};