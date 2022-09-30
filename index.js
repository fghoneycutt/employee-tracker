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
  let roles = [];
  let managers = [];
  db.query(`SELECT title FROM role`, (err, rows) => {
    for (i = 0; i < rows.length; i++) {
      roles[i] = rows[i].title
    }
  });
  db.query(
    `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employee`,
    (err, rows) => {
      for (i = 0; i < rows.length; i++) {
        managers[i] = rows[i].employee;
      }
      managers.unshift("None");
    });
  inquirer.prompt([
    {
      type: "text",
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      type: "text",
      name: "last_name",
      message: "What is the employee's last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roles
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: managers
    }
  ])
    .then(answers => {
      var role_id;
      var manager_id;
      db.query(`SELECT * FROM role`, (err, rows) => {
        for (i = 0; i < rows.length; i++){
          if (rows[i].title === answers.role) {
            role_id = rows[i].id;
          }
        }
        db.query(
          `SELECT employee.id, CONCAT(first_name, " ", last_name) AS manager FROM employee`,
          (err, rows) => {
            for (i = 0; i < rows.length; i++){
              if (rows[i].manager === answers.manager) {
                manager_id = rows[i].id
              }
            }
            const params = [answers.first_name, answers.last_name, role_id, manager_id ]
            db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, params)
            chooseAction();
          });
        })
    })
}
function updateEmployeeRole() {
  let roles = [];
  let employees = [];
  db.query(`SELECT title FROM role`, (err, rows) => {
    for (i = 0; i < rows.length; i++) {
      roles[i] = rows[i].title;
    }
    db.query(
      `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employee`,
      (err, rows) => {
        for (i = 0; i < rows.length; i++) {
          employees[i] = rows[i].employee;
        }
        inquirer.prompt([
           {
             type: "list",
             name: "employee",
             message: "Which employee's role do you want to update?",
             choices: employees,
           },
           {
             type: "list",
             name: "role",
             message: "Which role do you want to assign the selected employee?",
             choices: roles,
           },
         ])
         .then((results) => {
           var id;
           var role_id;
           db.query(
             `SELECT CONCAT(first_name, " ", last_name) AS employee, employee.id FROM employee
              LEFT JOIN role ON employee.role_id = role.id`,
             (err, rows) => {               
               for (i = 0; i < rows.length; i++){
                 if (rows[i].employee === results.employee) {
                   id = rows[i].id
                 }
               }
               db.query(`SELECT role.id, role.title FROM role`, (err, rows) => {
                 for (i = 0; i < rows.length; i++) {
                   if (rows[i].title === results.role) {
                     role_id = rows[i].id
                   }
                 }
                 const params = [role_id, id];
                 db.query(`UPDATE employee SET role_id = ? WHERE id =?`, params);
                 chooseAction();
               });
             });
         });
      });
  });
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
  let departmentChoices = [];
  db.query(`SELECT name FROM department`, (err, rows) => {
    for (i = 0; i < rows.length; i++){
      departmentChoices[i] = rows[i].name
    }
  });
  inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "What is the name of the role?"
    },
    {
      type: "text",
      name: "salary",
      message: "What is the salary of the role?",
      validate: (salary) => {
        if (isNaN(salary)) {
          console.log("Please enter a number");
          return false;
        }
        return true;
      }
    },
    {
      type: "list",
      name: "department",
      message: "What department does the role belong to?",
      choices: departmentChoices
    }
  ])
    .then(results => {
      var id;
      db.query(`SELECT * FROM department`, (err, rows) => {
        for (i = 0; i < rows.length; i++) {
          if (rows[i].name === results.department) {
              id = rows[i].id
          }
        }
        const params = [results.name, results.salary, id];
        db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, params);
        chooseAction();
      })
    })
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
    name: "department",
    message: "What is the name of the department?"
  })
    .then(department => {
      db.query(`INSERT INTO department (name) VALUES(?)`, department.department, (err, rows) => {
          if (err) {
            console.log(err);
            return;
          }
          chooseAction();
        }
      );
    });
}
function quit() {
    process.exit();
}
chooseAction();