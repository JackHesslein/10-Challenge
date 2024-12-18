
const { default: inquirer } = require('inquirer');
const db = require('./db');
const { mainMenuPrompt } = require('./prompt');
const queries = require('./queries');

async function mainMenu() {
    const { action } = await inquirer.prompt(mainMenuPrompt);

    switch(action) {
        case 'View All Departments':
            await queries.viewDepartments();
            break;
        case 'View All Roles':
            await queries.viewRoles();
            break;
        case 'View All Employees':
            await queries.viewEmployees();
            break;
        case 'Add a Department':
            await queries.addDepartment();
            break;
        case 'Add a Role':
            await queries.addRole();
            break;
        case 'Add an Employee':
            await queries.addEmployee();
            break;
        case 'Update an Employee Role':
            await queries.updateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }
    mainMenu();
}

mainMenu();