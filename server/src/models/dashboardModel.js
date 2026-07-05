const db = require("../config/db");

const getAdminDashboard = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM employees) AS totalEmployees,
        (SELECT COUNT(*) FROM tasks) AS totalTasks,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Completed') AS completedTasks,
        (SELECT COUNT(*) FROM tasks WHERE status != 'Completed') AS pendingTasks
    `;

    db.query(query, (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

const getEmployeeDashboard = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        COUNT(*) AS myTasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completedTasks,
        SUM(CASE WHEN status != 'Completed' THEN 1 ELSE 0 END) AS pendingTasks,
        SUM(
          CASE
            WHEN due_date < CURDATE() AND status != 'Completed'
            THEN 1
            ELSE 0
          END
        ) AS overdueTasks
      FROM tasks t
      INNER JOIN employees e
        ON t.assigned_employee = e.id
      WHERE e.user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    });
  });
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};