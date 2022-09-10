const inquirer = require("inquirer");
const cTable = require("console.table");

function chooseAction() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department"
        ]
    })
        .then(({ action }) => {
            if (action === "View All Employees") {
                viewAllEmps();
            } else if (action === "Add Employee") {
                addEmployee();
            } else if (action === "Update Employee Role") {
                updateEmployee();
            } else if (action === "View All Roles") {
                viewAllRoles();
            } else if (action === "Add Role") {
                addRole();
            } else if (action === "View All Departments") {
                viewDeps();
            } else if (action === "Add Department") {
                addDep();
            }
    })
}
function viewAllEmps() {
    console.log("reached 1")
    chooseAction();
}
function addEmployee() {
    console.log("reached 2");
    chooseAction();
}
function updateEmployee(){
    console.log("reached 3");
    chooseAction();
}
function viewAllRoles() {
    console.log("reached 4");
    chooseAction();
}
function addRole() {
    console.log("reached 5");
    chooseAction();
}
function viewDeps() {
    console.log("reached 6");
    chooseAction();
}
function addDep() {
    console.log("reached 7");
    chooseAction();
}
chooseAction();