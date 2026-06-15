const Measurement = require("../../model/projectengineer/measurementmodel");

const extractMeasurementReport = (body) => {
  if (Array.isArray(body.measurementReport) && body.measurementReport.length > 0) {
    return body.measurementReport;
  }

  const requiredFields = [
    "descriptionOfWork",
    "nos",
    "length",
    "breadth",
    "height",
    "unit",
    "qty",
  ];

  const hasFlatMeasurement = requiredFields.every(
    (field) => body[field] !== undefined && body[field] !== null && body[field] !== ""
  );

  if (!hasFlatMeasurement) {
    return null;
  }

  return [
    {
      descriptionOfWork: body.descriptionOfWork,
      nos: body.nos,
      length: body.length,
      breadth: body.breadth,
      height: body.height,
      unit: body.unit,
      qty: body.qty,
    },
  ];
};

const normalizeMeasurementPayload = (body) => {
  const measurementReport = extractMeasurementReport(body);
  const payload = { ...body };

  if (measurementReport) {
    payload.measurementReport = measurementReport;
    payload.descriptionOfWork =
      body.descriptionOfWork ?? measurementReport[0]?.descriptionOfWork;
    payload.nos = body.nos ?? measurementReport[0]?.nos;
    payload.length = body.length ?? measurementReport[0]?.length;
    payload.breadth = body.breadth ?? measurementReport[0]?.breadth;
    payload.height = body.height ?? measurementReport[0]?.height;
    payload.unit = body.unit ?? measurementReport[0]?.unit;
    payload.qty = body.qty ?? measurementReport[0]?.qty;
  }

  return payload;
};

const createMeasurement = async (req, res) => {
  try {
    const payload = normalizeMeasurementPayload(req.body);

    if (!payload.measurementReport) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either measurementReport[] or the flat measurement fields to save a measurement",
      });
    }

    const measurement = await Measurement.create(payload);

    res.status(201).json({
      success: true,
      message: "Measurement saved successfully",
      data: measurement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = normalizeMeasurementPayload(req.body);

    const measurement = await Measurement.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: "Measurement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Measurement updated successfully",
      data: measurement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMeasurements = async (req, res) => {
  try {
    const { projectId, siteEngineer, status } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (siteEngineer) query.siteEngineer = siteEngineer;
    if (status) query.status = status;

    const measurements = await Measurement.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: measurements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMeasurement,
  updateMeasurement,
  getMeasurements,
};
