const mongoose=require('mongoose');

// user schema
const UserSchema=new mongoose.Schema({
    password:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        unique:true,
        require:true,
    },
    name:{
        type:String,
        require:true,
    }

});

const User=mongoose.model('User',UserSchema);

module.exports=User;