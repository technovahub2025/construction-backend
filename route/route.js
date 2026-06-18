const express = require("express");
const { login } = require("../controller/projectengineer/projectengineer");
const { createProject, editProject, assignProject, getProjectOverview, getProjects, approveProject } = require("../controller/projectengineer/projectdata");
const { createLabour, updateLabour } = require("../controller/projectengineer/labourcontroller");
const { createMaterial, updateMaterial } = require("../controller/projectengineer/materialcontroller");
const { createMeasurement, updateMeasurement } = require("../controller/projectengineer/measurementcontroller");
const { createClientIssue, getClientIssues } = require("../controller/projectengineer/issuecontroller");
const { sitelogin } = require("../controller/projectengineer/siteengineer");
const { getWorkflowPreview, submitWorkflow } = require("../controller/projectengineer/workflowcontroller");
const router = express.Router();


router.post("/projectengineerlogin", login);

router.post("/siteadminlogin",sitelogin);


router.post("/createproject", createProject);
router.put("/updateproject/:id", editProject);
router.put("/assignproject/:id", assignProject);
router.get("/viewproject", getProjectOverview);


router.get("/getprojects",getProjects)

router.post("/cretaelabour",createLabour);
router.put("/updatelabour/:id", updateLabour);
router.post("/creatematerial",createMaterial);
router.put("/updatematerial/:id", updateMaterial);
router.post("/createmaeasurment",createMeasurement);
router.put("/updatemeasurement/:id", updateMeasurement);

router.post("/submitissue",createClientIssue);
router.get("/workflowpreview", getWorkflowPreview);
router.put("/submitworkflow", submitWorkflow);

router.put("/approveproject/:id",approveProject);

router.get("/getissue",getClientIssues);



module.exports = router;
