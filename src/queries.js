
const { default: inquirer } = require('inquirer');
const db = require('./db');

async function viewDepartments() {
    const result = await db.query('SELECT * FROM departments');
    console.table(result.rows);
}

async function viewRoles() {
    const result = await db.query(`
        SELECT roles.id, roles.title, roles.salary, departments.name AS department
        FROM roles
        JOIN departments ON role.department_id = departments.id
    `);
    console.table(result.rows);
}

async function viewEmployees() {
    const result = await db.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary,
               m.first_name || ' ' || m.last_name AS manager
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        JOIN departments d ON r.department_id = d.id
        LEFT JOIN employees m ON e.manager_id = m.id
    `);
    console.table(result.rows);
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter department name:',
        },
    ]);

    await db.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    console.log('Department added!');
}

async function addRole() {
    const departments = await db.query('SELECT * FROM departments');
    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter role title:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter role salary:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select department:',
            choices: departments.rows.map(department => ({
                name: department.name,
                value: department.id,
            })),
        },
    ]);

    await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log('Role added!');
}

async function addEmployee() {
    // Fetch all roles
    const roles = await db.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    // Fetch all employees to use as managers
    const employees = await db.query('SELECT id, first_name, last_name FROM employees');
    const managerChoices = employees.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    // Add a "None" option for managers
    managerChoices.unshift({ name: 'None', value: null });

    // Prompt for employee details
    const answers = await inquirer.prompt([
        { type: 'input', name: 'first_name', message: "Enter employee's first name:" },
        { type: 'input', name: 'last_name', message: "Enter employee's last name:" },
        {
            type: 'list',
            name: 'role_id',
            message: "Select employee's role:",
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Select employee's manager:",
            choices: managerChoices,
        },
    ]);

    // Insert the new employee into the database
    await db.query(
        'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
    );

    console.log(
        `Successfully added ${answers.first_name} ${answers.last_name} as a new employee!`
    );
}

async function updateEmployeeRole() {
    // Fetch all employees
    const employees = await db.query('SELECT id, first_name, last_name FROM employees');
    const employeeChoices = employees.rows.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    // Fetch all roles
    const roles = await db.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    // Prompt user to select an employee and a new role
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
        },
    ]);

    // Update the employee's role in the database
    await db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [
        answers.role_id,
        answers.employee_id,
    ]);

    console.log("Successfully updated the employee's role!");
}


module.exports = { viewDepartments, viewRoles, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };