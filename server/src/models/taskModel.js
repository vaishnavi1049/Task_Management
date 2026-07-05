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

module.exports = {
  findEmployeeById,
  createTask,
};