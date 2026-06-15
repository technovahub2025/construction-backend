const Measurement = require("../../model/projectengineer/measurementmodel");
const Labour = require("../../model/projectengineer/labourmodel");
const Material = require("../../model/projectengineer/materialmodel");

const getWorkflowPreview = async (req, res) => {
  try {
    const { projectId, siteEngineer } = req.query;

    if (!projectId || !siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Project ID and site engineer are required",
      });
    }

    const [measurements, labours, materials] = await Promise.all([
      Measurement.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Labour.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Material.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
    ]);

    const preview = {
      projectId,
      siteEngineer,
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
    const { projectId, siteEngineer } = req.body;

    if (!projectId || !siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "Project ID and site engineer are required",
      });
    }

    const [measurements, labours, materials] = await Promise.all([
      Measurement.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Labour.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
      Material.find({ projectId, siteEngineer }).sort({ createdAt: -1 }),
    ]);

    if (measurements.length === 0 || labours.length === 0 || materials.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please complete measurement, labour, and material before submit",
      });
    }

    const [measurementResult, labourResult, materialResult] = await Promise.all([
      Measurement.updateMany(
        { projectId, siteEngineer },
        { $set: { status: "submitted" } }
      ),
      Labour.updateMany(
        { projectId, siteEngineer },
        { $set: { status: "submitted" } }
      ),
      Material.updateMany(
        { projectId, siteEngineer },
        { $set: { status: "submitted" } }
      ),
    ]);

    res.status(200).json({
      success: true,
      message: "Workflow submitted successfully",
      data: {
        projectId,
        siteEngineer,
        measurementUpdated: measurementResult.modifiedCount,
        labourUpdated: labourResult.modifiedCount,
        materialUpdated: materialResult.modifiedCount,
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
