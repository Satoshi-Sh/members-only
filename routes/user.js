var express = require('express');
var router = express.Router();
var passport= require("passport")
const bcrypt = require('bcryptjs')




// controller 

const userController = require("../controllers/userController")


/* GET users listing. */
router.get('/sign-up', userController.get_sign_up )

router.post('/sign-up',userController.post_sign_up)

router.get('/log-in', userController.get_log_in)

router.post("/log-in", passport.authenticate('local',{
    session:true,
    successRedirect:'/',
    failureRedirect:"/user/log-in",
    failureFlash:true,
}))



router.post("/log-out",(req,res,next)=>{
    req.logout()
    res.redirect("/")
})






module.exports = router
