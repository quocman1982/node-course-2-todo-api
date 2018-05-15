var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res) => {
    //console.log(req.body);
    var todo = new Todo({
        text:req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos',(req,res) =>{
    Todo.find().then((todos) => {
        res.send({todos})
    },(e) => {
        res.status(400).send(e);
    })
})
app.get('/todos/:id',(req,res) => {
    const id = req.params["id"];
    if(ObjectID.isValid(id)){
        Todo.findById(req.params["id"]).then((todo) => {
            if(!todo){
                res.status(404).send();
            }else{
                res.send({todo})
            }
        },(e) => {
            res.status(400).send(e);
        })
    }else{
        res.status(404).send();
    }
    
})
app.listen(3000,()=>{
    console.log('Start on port 3000')
})

module.exports = {app}