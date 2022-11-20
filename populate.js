#! /usr/bin/env node

console.log('This script populates some users and messages to your database. Specified database as argument');


var userArgs = process.argv.slice(2)

var async = require("async")
var Message = require("./models/message")
var User = require("./models/user")

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var users = []
var messages = []

function userCreate(first_name,last_name,user_name,password,status,cb){
    var user = new User(
        {first_name,
         last_name,
         user_name,
         password,
         status}) 
    user.save(function(err){
        if(err){
            cb(err,null)
            return
        }
        console.log("New User: " +user);
        users.push(user)
        cb(null,user)
    })
}

function messageCreate(title,text,user,cb){
    var message = new Message(
        {title,
         text,
         user}
    )
    message.save(function (err){
        if(err){
            cb(err,null);
            return
        }
        console.log('New message: ' + message)
        messages.push(message)
        cb(null,message)
    })

}
function createUsers(cb){
    async.series([
        function(callback){
            userCreate('Satoshi','S.','satoss','123456','admin',callback)
        },
        function(callback){
            userCreate('Relakku','Ma','relakku','123456','member',callback)
        },
        function(callback){
            userCreate('Relakku','Ko','korelakku','123456','none',callback)
        },
    ],cb)
}

function createMessages(cb){
    async.parallel([
        function(callback){
            messageCreate('Intoroduction1','Hi this is Satoshi',users[0],callback)
        },
        function(callback){
            messageCreate('Intoroduction2','Hi this is Rekallu',users[1],callback)
        },
        function(callback){
            messageCreate('Intoroduction3','Hi this is Korelakku',users[2],callback)
        },
    ],cb)
}

async.series([
    createUsers,
    createMessages
],

function(err,results){
    if(err){
        console.log('Final ERR:' +err)
    }
    else {
        console.log('Messages: ' + messages)
    }
    mongoose.connection.close()
})