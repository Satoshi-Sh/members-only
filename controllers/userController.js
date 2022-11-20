const User = require("../models/user");

const Message = require ("../models/message")
const async = require("async");
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator")
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs')


exports.get_sign_up=(req,res)=>{
    res.render("sign-up",{title:"Sign Up"})
}

exports.post_sign_up =[
    body("first_name",'First name required').trim().isLength(
        {min:1}
    ).escape(),
    body("last_name",'Last name required').trim().isLength(
        {min:1}
    ).escape(),
    body("username").trim().isLength(
        {min:1, max:30}
    ).escape()
    .withMessage("Username must be between 1 and 30"),
    body('password').trim().isLength({min:5})
    .withMessage("Password must be at leat 5 letters long"),
    body('confirmation').custom((value, {req})=>{
        if(value!==req.body.password){
            throw new Error("Password confirmation does not match password")
        }
        return true;
    }),

    (req,res,next)=>{
        bcrypt.hash(req.body.password,10,(err,hashedpassword)=>{
        if (err){
            return next(err)
        } 
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            user_name: req.body.username,
            password: hashedpassword,
            status: "none"
        })
    
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        res.render("sign-up",{
            title:'Sign up',
            useri:user,
            errors:errors.array()  
        })
        return;
    }
    
    user.save(err=>{
        if(err){
            return next(err);
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/')
        })
    })
})

}]



exports.get_log_in = (req,res)=>{
    res.render("log-in",{title:"Log In"})
}
