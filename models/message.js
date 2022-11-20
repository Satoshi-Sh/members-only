const mongoose = require("mongoose");
const { DateTime } =require("luxon")

const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    title: {type:String,required:true,min_length:1,maxLength:100},
    time_stamp: {type:Date, default:Date.now},
    text: {type:String, required:true,min_length:1,maxLength:500},
    user: {type:Schema.Types.ObjectId, ref:"User",required:true}
})

MessageSchema.virtual("date_formatted").get(function(){
    var d = new Date()
    return this.time_stamp? DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.DATE_MED) + ' ' +DateTime.fromJSDate(this.time_stamp).toFormat('h:mm a')  :'';
})




// Export model 
module.exports = mongoose.model("Message",MessageSchema)