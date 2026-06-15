const mongoose = require("mongoose");

const clientIssueSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    siteEngineer: {
      type: String,
      default: null,
      trim: true,
    },
    issueText: {
      type: String,
      required: true,
    },

    images: {
      type: [String], // Store image URLs
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "Maximum 3 images are allowed",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ClientIssue", clientIssueSchema);
