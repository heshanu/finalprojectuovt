const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
name:String,
phonenumber:String,
age:Number,
address:String,
accomdation:String,
travelmode:String,
foodlist:String,
beveragelist:String,
duration:String,
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Reference model
  }
});

export default mongoose.model("Guide",guideSchema);