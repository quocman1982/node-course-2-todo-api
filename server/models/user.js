var mongoose = require('mongoose');
var validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var UserSchame = new mongoose.Schema({
    email:{
        type:String,
        required:Boolean,
        trim:true,
        minlength:1,
        unique:true,
        validate:{
            //validator: (value) => validator.isEmail(value),cach nay dung nhung co the dung cach sau cho gon
            validator:validator.isEmail,
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
})
UserSchame.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    user.tokens.push({
        access,token
    })
    // user.save().then(() => {
    //     return token;
    // });
    user.save().then(() => {
        return token;
    });
    return token;
};

UserSchame.methods.toJSON = function () {
    var user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}
var User = mongoose.model('User', UserSchame);

module.exports ={User}