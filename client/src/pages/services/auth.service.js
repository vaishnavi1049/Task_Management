import api from "./api";

// Register API
export const registerUser = (data) => {
  return api.post("/register", data);
};

// Login API
export const loginUser = (data) => {
  return api.post("/login", data);
};