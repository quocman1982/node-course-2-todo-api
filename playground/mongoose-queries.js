const {ObjectID} = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

var id = '5afad1ebb915d82816e76c911';

if(ObjectID.isValid(id)){
    Todo.find({
        _id:id
    }).then((todos) => {
        console.log('Todo ',todos);
    })
    
    Todo.findOne({
        _id:id
    }).then((todo) => {
        console.log('Todo ',todo);
    })
    
    Todo.findById(id).then((todo) => {
        console.log('Todo by id',todo);
    }).catch((e) => console.log(e))
}else{
    console.log('ID not valid');
}

