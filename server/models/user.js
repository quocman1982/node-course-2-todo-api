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
},{ usePushEach: true })
UserSchame.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};
UserSchame.statics.findByToken = function (token){
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        // return new Promise((resolve,reject) => {
        //     reject()
        // })
        return Promise.reject();
    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}
UserSchame.methods.toJSON = function () {
    var user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
}
var User = mongoose.model('User', UserSchame);

module.exports ={User}