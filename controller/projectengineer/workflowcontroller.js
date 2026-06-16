const Measurement = require("../../model/projectengineer/measurementmodel");
const Labour = require("../../model/projectengineer/labourmodel");
const Material = require("../../model/projectengineer/materialmodel");
const Project = require("../../model/projectengineer/projectassignmodel");
const ALLOWED_STATUS = ["pending", "inprogress", "hold", "completed"];

const getWorkflowPreview = async (req, res) => {
  try {
    const { projectId, siteEngineer } = req.query;

    if (!projectId || !siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Project ID and site engineer are required",
      });
    }

    const [project, measurements, labours, materials] = await Promise.all([
      Project.findOne({ _id: projectId, siteEngineer }),
      Measurement.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Labour.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Material.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
    ]);

    const preview = {
      projectId,
      siteEngineer,
      status: project?.status ?? "pending",
      measurement: measurements,
      labour: labours,
      material: materials,
      readyToSubmit:
        measurements.length > 0 &&
        labours.length > 0 &&
        materials.length > 0,
    };

    res.status(200).json({
      success: true,
      message: preview.readyToSubmit
        ? "Preview loaded successfully"
        : "Preview loaded, some sections are still missing",
      data: preview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const submitWorkflow = async (req, res) => {
  try {
    const { projectId, siteEngineer, status = "completed" } = req.body;

    if (!projectId || !siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Project ID and site engineer are required",
      });
    }

    const normalizedStatus = String(status).toLowerCase();

    if (!ALLOWED_STATUS.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUS.join(", ")}`,
      });
    }

    const [project, measurements, labours, materials] = await Promise.all([
      Project.findOne({ _id: projectId, siteEngineer }),
      Measurement.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Labour.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Material.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
    ]);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (
      normalizedStatus === "completed" &&
      (measurements.length === 0 || labours.length === 0 || materials.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete measurement, labour, and material before submit",
      });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, siteEngineer },
      { $set: { status: normalizedStatus } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Workflow status updated successfully",
      data: {
        projectId,
        siteEngineer,
        status: normalizedStatus,
        projectUpdated: updatedProject?._id ? 1 : 0,
        preview: {
          measurement: measurements,
          labour: labours,
          material: materials,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWorkflowPreview,
  submitWorkflow,
};
