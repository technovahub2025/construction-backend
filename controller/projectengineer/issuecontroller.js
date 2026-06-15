const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ClientIssue = require("../../model/projectengineer/issuemodel");

const uploadDir = path.join(process.cwd(), "uploads", "issue-images");

const ensureUploadDir = async () => {
  await fs.promises.mkdir(uploadDir, { recursive: true });
};

const normalizeImages = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) {
    return req.files.map((file) => {
      const filename = file.filename || file.originalname || "";
      return `uploads/${filename}`;
    });
  }

  const { images } = req.body;

  if (Array.isArray(images)) return images;

  if (typeof images === "string" && images.trim()) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      return [images];
    }
  }

  return [];
};

const decodeBase64Image = async (value) => {
  const rawValue = value.trim();
  const dataUrlMatch = rawValue.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/
  );

  let mimeType = "image/png";
  let base64Data = rawValue;

  if (dataUrlMatch) {
    mimeType = dataUrlMatch[1];
    base64Data = dataUrlMatch[2];
  }

  const extensionMap = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensionMap[mimeType] || "png";
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(base64Data, "base64");

  await fs.promises.writeFile(filePath, buffer);

  return `uploads/issue-images/${fileName}`;
};

const resolveImages = async (req) => {
  const images = normalizeImages(req);

  if (images.length > 3) {
    throw new Error("Maximum 3 images are allowed");
  }

  const resolved = [];

  for (const image of images) {
    if (typeof image !== "string") continue;

    const trimmed = image.trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      resolved.push(trimmed);
      continue;
    }

    if (
      trimmed.startsWith("data:image/") ||
      /^[A-Za-z0-9+/=\s]+$/.test(trimmed)
    ) {
      resolved.push(await decodeBase64Image(trimmed));
      continue;
    }

    resolved.push(trimmed.replace(/\\/g, "/"));
  }

  return resolved;
};

const createClientIssue = async (req, res) => {
  try {
    const issueText =
      req.body.issueText || req.body.issue_text || req.body.issue;
    const siteEngineer =
      typeof req.body.siteEngineer === "string" ? req.body.siteEngineer.trim() : "";

    if (!issueText || typeof issueText !== "string" || !issueText.trim()) {
      return res.status(400).json({
        success: false,
        message: "issueText is required",
      });
    }

    if (!siteEngineer) {
      return res.status(400).json({
        success: false,
        message: "siteEngineer is required",
      });
    }

    await ensureUploadDir();
    const images = await resolveImages(req);

    const issue = await ClientIssue.create({
      projectId: req.body.projectId || null,
      siteEngineer,
      issueText: issueText.trim(),
      images,
    });

    res.status(201).json({
      success: true,
      message: "Issue submitted successfully",
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getClientIssues = async (req, res) => {
  try {
    const issues = await ClientIssue.find();

    res.status(200).json({
      success: true,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAllClientIssues = async (req, res) => {
  try {
    await ClientIssue.deleteMany({});
    res.status(200).json({
      success: true,
      message: "All client issues deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createClientIssue,
  getClientIssues,
  deleteAllClientIssues,
};
