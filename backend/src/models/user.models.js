const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:[true,"Email ID is required"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password ID is required"],
        trim:true
    }
},{timestamps:true})

// Any middleware will come between the schema and the model (Dont put it anywhere else)

const model = mongoose.model("user",Schema);
module.exports= model