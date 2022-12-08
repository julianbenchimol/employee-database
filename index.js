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
        "Update an Employee Role"
    ]
  },
];
const deptAdd = [
    {
        type: 'text',
        message: 'Please enter the name of the department: ',
        name: 'deptName'
    }
]

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
            console.log(results);
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
    inquirer.prompt(deptAdd)
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
    const qDepartment = `SELECT * FROM department;`
    db.query(qDepartment, function(err, results){
        if(err) throw err;
        inquirer.prompt(
            {
                type: 'text',
                message: 'Please input the name of the role: ',
                name: 'roleName',
            },
            {
                type: 'list',
                message: 'Please choose a department: ',
                name: 'roleDept',
                choices: results
            }
        ).then(answers =>{
            //const q = `INSERT INTO role(name, salary, department_id) VALUES ('${answers.roleName}, ${answers.roleSalary}, ${answers.roleDept}')`
            console.log(answers);
        })
    })
}