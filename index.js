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
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Quit"
        ]
    })
        .then(({ action }) => {
            if (action === "View All Employees") {
                viewAllEmps();
            } else if (action === "Add Employee") {
                addEmployee();
            } else if (action === "Update Employee Role") {
                updateEmployeeRole();
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
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, " ", manager.last_name) AS manager 
      FROM employee
      LEFT JOIN employee manager
      ON employee.manager_id = manager.id
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id;
      `,
      (err, rows) => {
        console.table(rows);
        chooseAction();
      }
    );
}

function addEmployee() {
    
    inquirer
      .prompt(
        {
          type: "text",
          name: "firstName",
          message: "What is the employee's first name?",
        },
        {
          type: "text",
          name: "lastName",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: [],
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: [],
        }
      )
        .then((answers) => {
          
      })
      .then(chooseAction);
}
function updateEmployeeRole(){
    inquirer.prompt(
        {
            type: "list",
            name: "employee",
            message: "Which employee's role do you want to update?",
            choices: []
        },
        {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: []
        }
    )
    chooseAction();
}
function viewAllRoles() {
    db.query(
      `SELECT role.id, role.title, role.salary, department.name AS department
      FROM role
      LEFT JOIN department ON role.department_id = department.id 
      
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