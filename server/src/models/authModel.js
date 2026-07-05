const db = require("../config/db");

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email=?",
      [email],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const updateRememberToken = (userId, token) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET remember_token=? WHERE id=?",
      [token, userId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO users(full_name,email,password,role)
       VALUES(?,?,?,?)`,
      [user.full_name, user.email, user.password, user.role],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  updateRememberToken,
};