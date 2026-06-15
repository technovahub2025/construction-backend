const Material = require("../../model/projectengineer/materialmodel");

const serializeMaterial = (material) => {
  if (!material) {
    return material;
  }

  const plainMaterial =
    typeof material.toObject === "function" ? material.toObject() : material;

  return {
    ...plainMaterial,
    materialId: plainMaterial.materialId ?? plainMaterial._id?.toString(),
  };
};

const extractMaterialReport = (body) => {
  if (Array.isArray(body.materialReport) && body.materialReport.length > 0) {
    return body.materialReport;
  }

  const requiredFields = ["item", "qty", "rate", "total"];
  const hasFlatMaterial = requiredFields.every(
    (field) => body[field] !== undefined && body[field] !== null && body[field] !== ""
  );

  if (!hasFlatMaterial) {
    return null;
  }

  return [
    {
      item: body.item,
      qty: body.qty,
      rate: body.rate,
      total: body.total,
    },
  ];
};

const normalizeMaterialPayload = (body) => {
  const materialReport = extractMaterialReport(body);
  const payload = { ...body };

  if (materialReport) {
    payload.materialReport = materialReport;
    payload.item = body.item ?? materialReport[0]?.item;
    payload.qty = body.qty ?? materialReport[0]?.qty;
    payload.rate = body.rate ?? materialReport[0]?.rate;
    payload.total = body.total ?? materialReport[0]?.total;
  }

  return payload;
};

const createMaterial = async (req, res) => {
  try {
    const payload = normalizeMaterialPayload(req.body);

    if (!payload.materialReport) {
      return res.status(400).json({
        success: false,
        message:
          "Provide either materialReport[] or the flat material fields to save a material entry",
      });
    }

    const material = await Material.create(payload);

    res.status(201).json({
      success: true,
      message: "Material saved successfully",
      data: serializeMaterial(material),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { id, materialId } = req.params;
    const payload = normalizeMaterialPayload(req.body);
    const materialDocId = id || materialId || req.body.materialId || req.body.id;

    if (!materialDocId) {
      return res.status(400).json({
        success: false,
        message: "Material id is required",
      });
    }

    const material = await Material.findByIdAndUpdate(materialDocId, payload, {
      new: true,
      runValidators: true,
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Material updated successfully",
      data: serializeMaterial(material),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMaterials = async (req, res) => {
  try {
    const { projectId, siteEngineer, status } = req.query;
    const query = {};

    if (projectId) query.projectId = projectId;
    if (siteEngineer) query.siteEngineer = siteEngineer;
    if (status) query.status = status;

    const materials = await Material.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: materials.map(serializeMaterial),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createMaterial,
  updateMaterial,
  getMaterials,
};
