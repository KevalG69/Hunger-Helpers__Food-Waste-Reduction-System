
//Modules
const ReportRouter = require("express").Router();

//Controller
const {updateReportStatus,createReport,getAllReport} = require('../controllers/ReportController.js');


//middlewares
const { verifyToken, notSelf, isMangerOrSelf, isManager } = require("../middlewares/authValidator");
const {canReport} = require("../middlewares/rolePermValidator.js");



//----------------------APIs

//POST /api/reports/ → Submit a report (e.g., fake donation, abuse)
ReportRouter.post('/',verifyToken,canReport,notSelf,createReport);

//GET /api/reports/ → Get all reports (Admin)
ReportRouter.get("/",verifyToken,isManager,getAllReport);

//PUT /api/reports/:id/status → Update report status
ReportRouter.put("/",verifyToken,isManager,updateReportStatus);

module.exports = ReportRouter;
