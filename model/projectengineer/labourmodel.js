const mongoose = require("mongoose");

const labourSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    siteEngineer: {
      type: String,
      required: true,
      trim: true,
    },
    labourReport: [
      {
        labour: {
          type: String,
          required: true,
        },
        nos: {
          type: Number,
          required: true,
        },
        wages: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Pending","draft", "submitted"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Labour", labourSchema);
