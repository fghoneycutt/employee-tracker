const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: '',
    database: 'employees'
  },
  console.log('Connected to the employees database.')
);

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
            "Add Department",
            "Quit"
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
            } else if (action === "Quit") {
                quit();
            }
    })
}
function viewAllEmps() {
    db.query(
      `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name
      FROM employee
      LEFT JOIN roles ON employee.role_id = roles.id
    `,
      (err, rows) => {
        console.table(rows);
        chooseAction();
      }
    );
}
function addEmployee() {

    chooseAction();
}
function updateEmployee(){

    chooseAction();
}
function viewAllRoles() {
    db.query(
      `SELECT roles.id, roles.title, roles.salary, department.name AS department
      FROM roles
      LEFT JOIN department ON roles.department_id = department.id 
      
    `,
      (err, rows) => {
        console.table(rows);
        chooseAction();
      }
    );
}
function addRole() {
    inquirer.prompt(
        {
            type: "text",
            name: "name",
            message: "What is the name of the role?"
        },
        {
            type: "text",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department",
            message: "What department does the role belong to?",
            choices: []
        }
    );
    db.query(`SELECT * FROM department`, (err, rows) => {
        console.table(rows);
        chooseAction();
    });
}
function viewDeps() {
    db.query(`SELECT * FROM department`, (err, rows) => {
        console.table(rows);
        chooseAction();
    });
}
function addDep() {
    inquirer.prompt({
        type: "text",
        name: "name",
        message: "What is the name of the department?"
    });
    db.query(`SELECT * FROM department`, (err, rows) => {
        console.table(rows);
        chooseAction();
    });
}
function quit() {
    console.log("add quit function");
}
chooseAction();