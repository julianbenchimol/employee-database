require('dotenv').config();
const cTable = require('console.table');

const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE_NAME
    },
  );
const startQuestions = [{
    type: 'list',
    message: 'What would you like to do?',
    name: 'choice',
    choices:[
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
    ]
  },
];

initializeApp();


function initializeApp(){
    console.clear();
    inquirer.prompt(startQuestions)
    .then(answers =>{
        checkAnswer(answers.choice)
    })
}
function checkAnswer(choice){
    if(choice === "View All Departments"){
        console.clear();
        viewDept();

    }
    if(choice ===  "View All Roles"){
        console.clear();
        viewRoles();
    }
    if(choice ===  "View All Employees"){
        console.clear();
        viewEmployees();
    }
    if(choice ===  "Add a Department"){
        addDepartment();
    }
    if(choice ===  "Add a Role"){
        console.clear();
        addRole();
    }
    if(choice ===  "Add an Employee"){
        addEmployee();
    }
    if(choice === "Update an Employee Role"){
        console.clear();
        updateEmployee();
    }
}


function viewDept(){
    db.query('SELECT * FROM department', function(err, results){
        if(!results){
            console.log('No Departments Added');
        }
        else{
            console.table(results);
        }
    })
    initializeApp();
}
function viewRoles(){
    db.query('SELECT * FROM role', function(err, results){
        if(!results){
            console.log('No Roles Added');
        }
        else{
            console.table(results);
        }
    })  
    initializeApp();
}
function viewEmployees(){
    db.query('SELECT * FROM employee', function(err, results){
        if(!results){
            console.log('No Employees Added');
        }
        else{
            console.table(results);
        }
    })
    initializeApp();
}


function addDepartment(){
    console.clear();
    inquirer.prompt(
        {
            type: 'text',
            message: 'Please Enter department name: ',
            name: 'deptName'
        }
    )
    .then(answers =>{
        if(!answers){
            console.log("Please input a department name.")
            initializeApp();
        }
        else{
            const q = `INSERT INTO department(name) VALUES ('${answers.deptName}')`
            db.query(q, function(err, results){
                if(err) throw err;
                console.log(`${answers.deptName} has been added to Departments!`);
                initializeApp();
            })
        }
    })
}
function addRole(){
    console.clear();
    const dQuery = `SELECT * FROM department`;
    db.query(dQuery, function(err, results){

        inquirer.prompt([
            {
                type: 'input',
                message: "Please Input the Role's Name: ",
                name: 'roleName'
            },
            {
                type: 'number',
                message: "Please Input the role's Salary: ",
                name: 'roleSalary'
            },
            {
                type: "list",
                message: "Please choose the role's department: ",
                name: 'roleDept',
                choices: results.map((result)=>{
                    return {name: result.name, value: result.id}
                })
            }
    
        ]).then(answers =>{
            const qInsert = `INSERT INTO role(name, salary, department_id) VALUES (?, ?, ?)`
            const q = `SELECT role.department_id, department.name FROM department JOIN role ON role.department_id = department.id;`;
            db.query(qInsert, [answers.roleName, answers.roleSalary, answers.roleDept], function (err, results){
                if(err) throw err
                console.log(`${answers.roleName} has been added!`)
            })
            db.query(q, function(err, results){
                if(err) throw err
                initializeApp();
            })
   
        })
    })
}
function addEmployee(){
    console.clear();
    const dQuery = 'SELECT * FROM role';
    db.query(dQuery, function(err, results){
        inquirer.prompt([
            {
                type: 'input',
                message: "Please Input the Employee's First Name: ",
                name: 'employeeFn'
            },
            {
                type: 'input',
                message: "Please Input the Employee's Last Name: ",
                name: 'employeeLn'
            },
            {
                type: 'list',
                message: "Please Select the Employee's Role: ",
                name: "employeeRole",
                choices: results.map((result)=>{
                    return {name: result.name, value: result.role}
                })
                
            }
        ]).then(answers =>{
            const qInsert = `INSERT INTO employee(first_name, last_name, role_id) VALUES (?, ?, ?);`;
            const q = `SELECT employee.role_id, role.id FROM role JOIN employee ON role.id = role.id;`
            db.query(qInsert, [answers.employeeFn, answers.employeeLn, answers.employeeRole], function (err, results){
                if(err) throw err
                console.log(`${answers. employeeFn} ${answers.employeeLn} has been added!`);
            })
            db.query(q, function (err, results){
                if(err) throw err
                initializeApp();
            })

        })
    })
}