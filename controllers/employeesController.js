const data = {
	employees: require("../data/employee.json"),
	SetEmployees: function (data) {
		this.employees = data;
	},
};

const getAllEmployees = (req, res) => {
	res.json(data.employees);
};

const createNewEmployee = (req, res) => {
	const newEmployee = {
		id: data.employees[data.employees.length - 1].id + 1 || 1,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	};

	if (!newEmployee.firstname || !newEmployee.lastname) {
		return res.status(400).json({ message: "firstname & lastname are required" });
	}

	data.SetEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
	const employee = data.employees.find((employee) => employee.id === req.body.id);

	if (!employee) {
		return res.status(404).json({ message: `${req.body.id} is missing to update data` });
	}

	if (req.body.firstname) {
		employee.firstname = req.body.firstname;
	}

	if (req.body.lastname) {
		employee.lastname = req.body.lastname;
	}

	const filteredArray = data.employees.filter((emps) => emps.id !== parseInt(employee.id));
	const unSortedArray = [...filteredArray, employee];
	const sortedArray = unSortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
	res.status(201).json(sortedArray);
};

const deleteEmployee = (req, res) => {
	const deletedEmployee = data.employees.find((employee) => employee.id === parseInt(req.body.id));

	if (!deletedEmployee) {
		res.status(404).json({ message: `Employee ID ${req.body.id} is missing ` });
	}

	const filteredArray = data.employees.filter((employee) => employee.id !== parseInt(deletedEmployee.id));
	const afterDeletedArray = [...filteredArray];
	data.SetEmployees(afterDeletedArray);
	res.json(data.employees);
};

const getAnEmployee = (req, res) => {
	const anEmployee = data.employees.find((employees) => employees.id === parseInt(anEmployee.id));

	if (!anEmployee) {
		return res.status(404).json({ message: `Employee ID ${req.body.id} is missing` });
	}

	res.json(anEmployee);
};

module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getAnEmployee,
};
