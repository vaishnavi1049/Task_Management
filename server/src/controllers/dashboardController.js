const {
  getAdminDashboard,
  getEmployeeDashboard,
} = require("../models/dashboardModel");

const dashboard = async (req, res) => {
  try {

    let data;

    if (req.user.role === "Admin") {
      data = await getAdminDashboard();
    } else {
      data = await getEmployeeDashboard(req.user.id);
    }

    res.status(200).json({
      success: true,
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
  dashboard,
};