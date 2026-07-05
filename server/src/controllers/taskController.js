const {
  findEmployeeById,
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../models/taskModel");

const addTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      start_date,
      due_date,
      assigned_employee,
    } = req.body;

    // Check whether employee exists
    const employee = await findEmployeeById(assigned_employee);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assigned employee not found",
      });
    }

    await createTask({
      title,
      description,
      priority,
      status,
      start_date,
      due_date,
      assigned_employee,
      created_by: req.user.id, // Logged-in Admin
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const getAllTasks = async (req, res) => {
  try {
    const search = req.query.search || "";

    const allowedSortFields = [
      "id",
      "title",
      "priority",
      "status",
      "start_date",
      "due_date",
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

    const tasks = await getTasks(
      req.user,
      search,
      sort,
      order,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      count: tasks.length,
      page,
      limit,
      data: tasks,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};


const getTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (task.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Employee can only view their own task
    if (
      req.user.role === "Employee" &&
      task[0].assigned_employee_email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: task[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const editTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (task.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Assignment Business Rule
    if (task[0].status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Completed tasks cannot be edited",
      });
    }

    const {
      title,
      description,
      priority,
      status,
      start_date,
      due_date,
      assigned_employee,
    } = req.body;

    // Check employee exists
    const employee = await findEmployeeById(assigned_employee);

    if (employee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assigned employee not found",
      });
    }

    await updateTask(req.params.id, {
      title,
      description,
      priority,
      status,
      start_date,
      due_date,
      assigned_employee,
    });

    res.json({
      success: true,
      message: "Task updated successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const removeTask = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);

    if (task.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await deleteTask(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
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
  addTask,
  getAllTasks,
  getTask,
  editTask,
  removeTask,
  
};