const inquirer = require("inquirer");
const db = require("./db/connection");
// const apiRoutes = require("./routes/apiRoutes");
//Use apiRoutes
// app.use("/api", apiRoutes);
// //Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

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
            console.log(action);
    })
}
chooseAction();