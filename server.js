require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");

const connectDB = require("./config/db");
const apiMiddleware = require("./middleware/apiMiddleware");

const { login } = require("./controller/projectengineer/projectengineer");
const { sitelogin } = require("./controller/projectengineer/siteengineer");

const {
  createProject,
  editProject,
  assignProject,
  approveProject,
  getProjectOverview,
  getProjectCounts,
  getProjects,
} = require("./controller/projectengineer/projectdata");

const {
  createLabour,
  updateLabour,
} = require("./controller/projectengineer/labourcontroller");

const {
  createMaterial,
  updateMaterial,
} = require("./controller/projectengineer/materialcontroller");

const {
  createMeasurement,
  updateMeasurement,
} = require("./controller/projectengineer/measurementcontroller");

const {
  createClientIssue,
  getClientIssues,
  deleteAllClientIssues,
} = require("./controller/projectengineer/issuecontroller");

const {
  getWorkflowPreview,
  submitWorkflow,
} = require("./controller/projectengineer/workflowcontroller");

const { createSwaggerSpec, swaggerHtml } = require("./swagger");

const app = express();

const upload = multer({
  storage: multer.memoryStorage(),
});

app.get("/api-docs.json", (req, res) => {
  const baseUrl =
    process.env.SWAGGER_SERVER_URL || `${req.protocol}://${req.get("host")}`;
  res.json(createSwaggerSpec(baseUrl));
});

app.get("/api-docs", (req, res) => {
  res.type("html").send(swaggerHtml());
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use("/api", apiMiddleware);

app.post("/api/projectengineerlogin", login);
app.post("/api/siteadminlogin", sitelogin);


app.get("/api/getprojectcounts",getProjectCounts);

app.get("/api/getprojects",getProjects);

app.post("/api/createproject", createProject);
app.put("/api/updateproject/:id", editProject);
app.put("/api/assignproject/:id", assignProject);
app.put("/api/approveproject/:id", approveProject);
app.get("/api/viewproject", getProjectOverview);

app.post("/api/cretaelabour", createLabour);
app.put("/api/updatelabour/:id", updateLabour);

app.post("/api/creatematerial", createMaterial);
app.put("/api/updatematerial/:id", updateMaterial);

app.post("/api/createmaeasurment", createMeasurement);
app.put("/api/updatemeasurement/:id", updateMeasurement);

app.post("/api/submitissue", upload.array("images", 3), createClientIssue);
app.get("/api/getissue", getClientIssues);
app.delete("/api/deleteissue", deleteAllClientIssues);

app.get("/api/workflowpreview", getWorkflowPreview);
app.put("/api/submitworkflow", submitWorkflow);


app.post("/api/estimatorlogin",estimatorlogin);


const PORT = process.env.PORT || 5000;
app.get("/",(req,res)=>{

  res.send(200).json({ message: "Server is running" });
});
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
