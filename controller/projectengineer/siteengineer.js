const Project = require("../../model/projectengineer/projectassignmodel");

const sitelogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    const STATIC_MANAGER = {
      password: "site@2026",
    };

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    if (password !== STATIC_MANAGER.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid site engineer credentials",
      });
    }

    const engineerName = name.trim();

    const assignedProjects = await Project.find({
      siteEngineer: engineerName,
      isAssigned: true,
    }).sort({ createdAt: -1 });

    if (assignedProjects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Not assigned",
        projectAssigned: false,
        siteEngineer: engineerName,
        assignedDetails: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assigned project details found",
      projectAssigned: true,
      siteEngineer: engineerName,
      assignedDetails: assignedProjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { sitelogin };
