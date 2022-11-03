const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    FullName:{
        type:String,
        required:true

    },
    UserName:{
        type:String,
        required:true
        
    },
    Password:{
        type:String,
        required:true
    },
    LastSeen:{
        type:String,
        required:true
    }
})

const UserModel = new  mongoose.model('users',userSchema)
module.exports = UserModel