const User = require("../models/user");
const Message = require ("../models/message")
const async = require("async");
const mongoose = require("mongoose")
const { body, validationResult } = require("express-validator");
const { post } = require("jquery");



exports.index=(req,res,next)=>{
    //Get messages
    Message.find({},)
    .sort({time_stamp:1}) 
    .populate('user')
    .exec(function (err,messages){
        if(err){
            return next(err)
        }
        messages.map(item=>{
            item.title= item.title.replace('&#x27;',"'")
            item.text = item.text.replace('&#x27;',"'")
            item.user.user_name = item.user.user_name.replace('&#x27;',"'")
            return item
        })
    res.render("index",{title:"Messages",user:req.user,messages:messages})

})
}

exports.become_member=(req,res)=>{
    res.render("become_member",{title:"Become Member",user:req.user})
}

exports.become_member_post = (req,res,next)=>{
    if (!req.user){
        res.render('become_member',{message:['Please login or signin first!'],title:"Become Member"})
        return
    }
    if (req.body.passcode=='member'){
    User.findByIdAndUpdate(req.user._id,{status:'member'},(err,user)=>
    {
        if(err)
        {res.render('become_member',{message:['Cannot find your user data.']})}
    }    
        
    )
    res.redirect('/')
}   
    res.render('become_member',{message:['Passcode is member'],title:"Become Member"})
}



exports.become_admin = (req,res)=>{
    res.render("become_admin",{title:"Become Admin",user:req.user})
}

exports.become_admin_post = (req,res)=>{
    if (!req.user){
        res.render('become_admin',{message:['Please login or signin first!'],title:"Become Admin"})
        return
    }
    if (req.body.passcode=='admin'){
    User.findByIdAndUpdate(req.user._id,{status:'admin'},(err,user)=>
    {
        if(err)
        {res.render('become_admin',{message:['Cannot find your user data.']})}
    }    
        
    )
    res.redirect('/')
}   
    res.render('become_admin',{message:['Passcode is admin'],title:"Become Admin"})
}


exports.delete_post = (req,res,next)=>{
    if (!req.body._id){
        res.redirect('/')
        return
    }
    Message.findByIdAndRemove(req.body._id,function(err,message){
    if(err){
        next(err)
    }
    res.redirect('/')
    })
}

exports.new_post =
    (req,res,next)=>{
    if (!req.user){
        res.redirect('/')
        return
    }
    
    var post = new Message({
        title:req.body.title,
        text: req.body.newmessage,
        user:req.user
    })
    var errors=[]
    if (req.body.title.length<1||req.body.title.length>100){
       errors.push('title length must be between 1 and 100')
    }
    if (req.body.newmessage.length<1||req.body.newmessage.length>500){
        errors.push('title length must be between 1 and 500')
     }
     if(errors.length>0){
        Message.find({},)
    .sort({time_stamp:1}) 
    .populate('user')
    .exec(function (err,messages){
        if(err){
            return next(err)
        }

        messages.map(item=>{
            item.title= item.title.replace('&#x27;',"'")
            item.text = item.text.replace('&#x27;',"'")
            item.user.user_name = item.user.user_name.replace('&#x27;',"'")
            return item
        })
        console.log(post.title)
        console.log(post.text)
        res.render("index",{title:"Messages",user:req.user,messages:messages,errors:errors,post:post})
})
     }
    else{
    post.save((err)=>{
        if(err){
            return next(err)
        }
    })
    res.redirect('/')
    }
}




