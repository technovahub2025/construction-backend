const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
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
    item: {
      type: String,
    },
    qty: {
      type: Number,
    },
    rate: {
      type: Number,
    },
    total: {
      type: Number,
    },
    materialReport: {
      type: [
        {
          item: {
            type: String,
            required: true,
            trim: true,
          },
          qty: {
            type: Number,
            required: true,
          },
          rate: {
            type: Number,
            required: true,
          },
          total: {
            type: Number,
            required: true,
          },
        },
      ],
      default: undefined,
    },
    status: {
      type: String,
      enum: ["Pending", "draft", "submitted"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Material", materialSchema);
