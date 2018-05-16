const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
    _id:new ObjectID(),
    text:'First test todo'
},{
    _id:new ObjectID(),
    text:'Second test todo'
},{
    _id:new ObjectID(),
    text:'Third test todo'
}]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos',() => {
    it('Should create a new todo',(done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Todo.find({text}).then((todos) =>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    })

    it('should not create todo with invalid body data',(done) => {
        var text = '';
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) =>{
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((e) => done(e));
            })
    })
})

describe ('GET /todos route',() => {
    it('should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(todos.length)
            })
            .end(done);
    })
})

describe ('GET /todos/:id route',() => {
    var correctId = todos[0]._id;
    var invalidId = todos[0]._id + 1;
    
    it('should get one todo by id',(done) => {
        request(app)
            .get('/todos/' + correctId)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })
    it('should return 404 if todo not found',(done) => {
        request(app)
            .get('/todos/' + new ObjectID())
            .expect(404)
            .end(done);
    })

})

describe ('DELETE /todos/:id route',() => {
    var correctId = todos[0]._id;
    var invalidId = todos[0]._id + 1;
    it('should delete one todo by id',(done) => {
        request(app)
            .delete('/todos/' + correctId)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Todo.findById(correctId).then((todo) =>{
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => done(e));
            });
    })
    it('should return 404 if todo not found',(done) => {
        request(app)
            .delete('/todos/' + new ObjectID())
            .expect(404)
            .end(done);
    })

})