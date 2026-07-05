const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const {
  getCompletedTasks,
  getPendingTasks,
  getEmployeeWiseReport,
} = require("../models/reportModel");

// Get Completed Tasks
const completedTasks = async (req, res) => {
  try {
    const data = await getCompletedTasks();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Pending Tasks
const pendingTasks = async (req, res) => {
  try {
    const data = await getPendingTasks();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Export CSV
const exportCSV = async (req, res) => {
  try {
    const data = await getCompletedTasks();

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("completed_tasks.csv");

    return res.send(csv);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

// Export Excel
const exportExcel = async (req, res) => {
  try {

    const data = await getCompletedTasks();

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Completed Tasks");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Employee", key: "employee", width: 25 },
      { header: "Start Date", key: "start_date", width: 15 },
      { header: "Due Date", key: "due_date", width: 15 },
    ];

    worksheet.addRows(data);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=completed_tasks.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
};

const employeeWiseReport = async (req, res) => {
  try {

    const data = await getEmployeeWiseReport();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
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
  completedTasks,
  pendingTasks,
  exportCSV,
  exportExcel,
  employeeWiseReport,
};