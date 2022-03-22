const express = require('express');
const bodyParser = require("body-parser")
const env = require('dotenv').config().parsed

const UserController = require('./Controllers/UserController')
const TaskController = require('./Controllers/TaskController')

const app = express(); 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.listen(env.PORT, () => console.log(`Listening on port ${env.PORT}`)); 


app.post('/api/login',      (req,res)=>{ return UserController.login(req,res) })
app.post('/api/signin',     (req,res)=>{ return UserController.signin(req,res) })
app.post('/api/getUser',    (req,res)=>{ return UserController.getUser(req,res) })
app.post('/api/getUsers',   (req,res)=>{ return UserController.getUsers(req,res) })
app.post('/api/updateUser', (req,res)=>{ return UserController.updateUser(req,res) })
app.post('/api/addTask',    (req,res)=>{ return TaskController.addTask(req,res) })
app.post('/api/deleteTask', (req,res)=>{ return TaskController.deleteTask(req,res) })
app.post('/api/getTasks',   (req,res)=>{ return TaskController.getAllTasks(req,res) })
app.post('/api/updateTask', (req,res)=>{ return TaskController.updateTask(req,res) })
