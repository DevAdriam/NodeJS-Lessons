const express = require("express");
const router = express.Router();
const path = require("path");
const {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getAnEmployee,
} = require("../../controllers/employeesController");
const data = {};
data.employees = require("../../data/employee.json");

router.route("/").get(getAllEmployees).post(createNewEmployee).put(updateEmployee).delete(deleteEmployee);

router.route("/:id").get(getAnEmployee);

module.exports = router;
