const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
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
    descriptionOfWork: {
      type: String,
      trim: true,
    },
    nos: {
      type: Number,
    },
    length: {
      type: Number,
    },
    breadth: {
      type: Number,
    },
    height: {
      type: Number,
    },
    unit: {
      type: String,
      trim: true,
    },
    qty: {
      type: Number,
    },
    measurementReport: {
      type: [
        {
          descriptionOfWork: {
            type: String,
            required: true,
            trim: true,
          },
          nos: {
            type: Number,
            required: true,
          },
          length: {
            type: Number,
            required: true,
          },
          breadth: {
            type: Number,
            required: true,
          },
          height: {
            type: Number,
            required: true,
          },
          unit: {
            type: String,
            required: true,
            trim: true,
          },
          qty: {
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

module.exports = mongoose.model("Measurement", measurementSchema);
