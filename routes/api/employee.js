const express = require("express");
const router = express.Router();
const path = require("path");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getAnEmployee,
} = require("../../controllers/employeesController");
const data = {};
data.employees = require("../../data/employee.json");

router
    .route("/")
    .get(getAllEmployees) // default User role
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route("/:id").get(getAnEmployee);

module.exports = router;
