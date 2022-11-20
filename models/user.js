const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type:String, required:true,maxLength:100,minLength:1},
    last_name: {type:String, required:true,maxLength:100,minLength:1},
    user_name: {type:String, required:true,maxLength:100,minLength:1,unique:true},
    password: {type:String, required:true, maxLength:100},
    status : {type:String,enum:['none','member','admin'],required:true,default:'none'}
})

// Virtual for user's URL 
UserSchema.virtual('url').get(function(){
    return `/user/${this._id}`
})

// Export model 

module.exports = mongoose.model("User",UserSchema)