const db = require("../config/db");

const getCompletedTasks = () => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT
        t.id,
        t.title,
        t.priority,
        t.status,
        t.start_date,
        t.due_date,
        u.full_name AS employee
      FROM tasks t
      JOIN employees e
        ON t.assigned_employee = e.id
      JOIN users u
        ON e.user_id = u.id
      WHERE t.status='Completed'
    `;

    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

  });
};

const getPendingTasks = () => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT
        t.id,
        t.title,
        t.priority,
        t.status,
        t.start_date,
        t.due_date,
        u.full_name AS employee
      FROM tasks t
      JOIN employees e
        ON t.assigned_employee = e.id
      JOIN users u
        ON e.user_id = u.id
      WHERE t.status!='Completed'
    `;

    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

  });
};

const getEmployeeWiseReport = () => {
  return new Promise((resolve, reject) => {

    const query = `
      SELECT
        u.full_name AS employee,
        COUNT(t.id) AS totalTasks,
        SUM(CASE WHEN t.status='Completed' THEN 1 ELSE 0 END) AS completedTasks,
        SUM(CASE WHEN t.status!='Completed' THEN 1 ELSE 0 END) AS pendingTasks
      FROM users u
      INNER JOIN employees e
        ON u.id = e.user_id
      LEFT JOIN tasks t
        ON e.id = t.assigned_employee
      GROUP BY u.id, u.full_name
      ORDER BY u.full_name ASC
    `;

    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

  });
};

module.exports = {
  getCompletedTasks,
  getPendingTasks,
  getEmployeeWiseReport,
};