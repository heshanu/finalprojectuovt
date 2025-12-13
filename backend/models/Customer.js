const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
name:String,
phonenumber:String,
age:Number,
address:String,
accomdation:String,
travelmode:String,
foodlist:String,
beveragelist:String,
duration:String,
email:String,
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Reference model
  }
});

module.exports = mongoose.model("Customer",customerSchema);
