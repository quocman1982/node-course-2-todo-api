require('./config/config');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
const {authenticate} = require('../middleware/authentica');
var app = express();

const port = process.env.PORT;

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
        }).catch((e) => {
            res.status(400).send();
        })
    }else{
        res.status(404).send();
    }
    
})
app.delete('/todos/:id',(req,res) => {
    const id = req.params["id"];
    if(ObjectID.isValid(id)){
        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo){
                res.status(404).send();
            }else{
                res.send({todo})
            }
        }).catch((e) => {
            res.status(400).send();
        })
    }else{
        res.status(400).send();
    }
})

app.patch ('/todos/:id',(req,res) => {
    var id = req.params["id"];
    var body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo) => {

        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    })
})

app.post('/users', (req,res) => {
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})



app.get ('/users/me', authenticate ,(req,res) => {
    res.send(req.user)
})
app.listen(port,()=>{
    console.log(`Start on port ${port}`);
})

module.exports = {app}