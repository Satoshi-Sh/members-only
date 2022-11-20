var express = require('express');
var router = express.Router();

const messageController = require("../controllers/messageController")

/* GET home page. */
router.get('/', messageController.index);


router.get('/become_member',messageController.become_member);

router.post('/become_member',messageController.become_member_post)

router.get('/become_admin',messageController.become_admin);

router.post('/become_admin',messageController.become_admin_post)

router.post('/delete',messageController.delete_post)

router.post('/newmessage', messageController.new_post)



module.exports = router;

