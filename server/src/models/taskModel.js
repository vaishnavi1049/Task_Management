const db = require("../config/db");

// Check if assigned employee exists
const findEmployeeById = (employeeId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT e.id, u.full_name
      FROM employees e
      INNER JOIN users u
      ON e.user_id = u.id
      WHERE e.id = ?
    `;

    db.query(query, [employeeId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Create Task
const createTask = (task) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO tasks
      (
        title,
        description,
        priority,
        status,
        start_date,
        due_date,
        assigned_employee,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        task.title,
        task.description,
        task.priority,
        task.status,
        task.start_date,
        task.due_date,
        task.assigned_employee,
        task.created_by,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getTasks = (user, search, sort, order, limit, offset) => {
  return new Promise((resolve, reject) => {

    let query = `
      SELECT
        t.id,
        t.title,
        t.description,
        t.priority,
        t.status,
        t.start_date,
        t.due_date,
        u.full_name AS assigned_employee_name,
        u.email AS assigned_employee_email
      FROM tasks t
      INNER JOIN employees e
        ON t.assigned_employee = e.id
      INNER JOIN users u
        ON e.user_id = u.id
    `;

    let params = [];

    // Employee should see only their tasks
    if (user.role === "Employee") {
      query += ` WHERE e.user_id = ?`;
      params.push(user.id);
    } else {
      query += ` WHERE 1=1`;
    }

    query += `
      AND (
        t.title LIKE ?
        OR t.priority LIKE ?
        OR t.status LIKE ?
      )
    `;

    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    );

    query += `
      ORDER BY ${sort} ${order}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    db.query(query, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

  });
};

const getTaskById = (taskId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        t.*,
        u.full_name AS assigned_employee_name,
        u.email AS assigned_employee_email
      FROM tasks t
      INNER JOIN employees e
        ON t.assigned_employee = e.id
      INNER JOIN users u
        ON e.user_id = u.id
      WHERE t.id = ?
    `;

    db.query(query, [taskId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateTask = (id, task) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE tasks
      SET
        title = ?,
        description = ?,
        priority = ?,
        status = ?,
        start_date = ?,
        due_date = ?,
        assigned_employee = ?
      WHERE id = ?
    `;

    db.query(
      query,
      [
        task.title,
        task.description,
        task.priority,
        task.status,
        task.start_date,
        task.due_date,
        task.assigned_employee,
        id,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM tasks WHERE id = ?`;

    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  findEmployeeById,
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};