const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectname: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    projectType: {
      type: String,
      required: true,
      enum: [
        "Industrial",
        "Commercial",
        "Residential",
        "Others",
      ],
    },

    siteEngineer: {
      type: String,
      default: null,
    },

    isAssigned: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "inprogress", "hold", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
