const Project = require("../../model/projectengineer/projectassignmodel");
const Measurement = require("../../model/projectengineer/measurementmodel");
const Labour = require("../../model/projectengineer/labourmodel");
const Material = require("../../model/projectengineer/materialmodel");
const ClientIssue = require("../../model/projectengineer/issuemodel");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createProject = async (req, res) => {
  try {
    const { projectname, title, description, projectType, siteEngineer } = req.body;

    if (!projectname || !title || !description || !projectType) {
      return res.status(400).json({
        success: false,
        message: "Project name, title, description, and project type are required",
      });
    }

    const project = await Project.create({
      projectname,
      title,
      description,
      projectType,
      siteEngineer: siteEngineer || null,
      isAssigned: !!siteEngineer,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const approveProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        approved: true,
      },
      {
        new: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project approved successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectname, title, description, projectType, siteEngineer } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        projectname,
        title,
        description,
        projectType,
        siteEngineer: siteEngineer || null,
        isAssigned: !!siteEngineer,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const assignProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { siteEngineer } = req.body;

    if (!siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Site engineer name is required",
      });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        siteEngineer,
        isAssigned: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project assigned successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectCounts = async (req, res) => {
  try {
    const [totalProjects, assignedProjects, unassignedProjects] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isAssigned: true }),
      Project.countDocuments({ isAssigned: false }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        assignedProjects,
        unassignedProjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignedProjects = async (req, res) => {
  try {
    const { siteEngineer } = req.query;
    const query = {
      isAssigned: true,
    };

    if (siteEngineer) {
      query.siteEngineer = siteEngineer;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No project available",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Assigned projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSiteEngineers = async (req, res) => {
  try {
    const engineers = await Project.distinct("siteEngineer", {
      siteEngineer: { $nin: [null, ""] },
    });

    res.status(200).json({
      success: true,
      data: engineers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProjectOverview = async (req, res) => {
  try {
    const { projectType, siteEngineer } = req.query;

    if (!projectType || !siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "projectType and siteEngineer are required",
      });
    }

    const query = {};

    if (projectType) {
      query.projectType = new RegExp(`^${escapeRegExp(projectType)}$`, "i");
    }

    if (siteEngineer) {
      query.siteEngineer = new RegExp(`^${escapeRegExp(siteEngineer)}$`, "i");
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No project found for the given filter criteria",
        data: [],
      });
    }

    const projectDetails = await Promise.all(
      projects.map(async (project) => {
        const [measurements, labours, materials] = await Promise.all([
          Measurement.find({ projectId: project._id }).sort({ createdAt: -1 }),
          Labour.find({ projectId: project._id }).sort({ createdAt: -1 }),
          Material.find({ projectId: project._id }).sort({ createdAt: -1 }),
        ]);

        let issues = await ClientIssue.find({ projectId: project._id }).sort({
          createdAt: -1,
        });

        return {
          projectId: project._id,
          projectname: project.projectname,
          title: project.title,
          description: project.description,
          projectType: project.projectType,
          siteEngineer: project.siteEngineer,
          isAssigned: project.isAssigned,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          measurement: measurements,
          labour: labours,
          material: materials,
          clientIssues: issues,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Project overview fetched successfully",
      data: projectDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  editProject,
  deleteProject,
  assignProject,
  approveProject,
  getProjects,
  getProjectCounts,
  getAssignedProjects,
  getSiteEngineers,
  getProjectOverview,
};
