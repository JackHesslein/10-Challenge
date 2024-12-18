INSERT INTO departments (name) VALUES
('Sales'),
('Engineering'),
('HR');

INSERT INTO roles (title, salary, department_id) VALUES
('Salesperson', 50000, 1),
('Engineer', 75000, 2),
('HR Specialist', 60000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Williams', 3, NULL);