const Labour = require("../../model/projectengineer/labourmodel");

const createLabour = async (req, res) => {
  try {
    const labour = await Labour.create(req.body);

    res.status(201).json({
      success: true,
      message: "Labour report saved successfully",
      data: labour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateLabour = async (req, res) => {
  try {
    const { id } = req.params;
    const labour = await Labour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: "Labour report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Labour report updated successfully",
      data: labour,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLabours = async (req, res) => {
  try {
    const { projectId, siteEngineer, status } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (siteEngineer) query.siteEngineer = siteEngineer;
    if (status) query.status = status;

    const labours = await Labour.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: labours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLabour,
  updateLabour,
  getLabours,
};
