const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  step: { type: Number, default: 0 },
  data: {
    name: String,
    age: Number,
    address: String,
    foods: [String],
    beverages: [String],
    hotels: String,
    mode_of_travel: String,
    duration: String,
    budget: String,
    phonenumber: String,
    email: String,
    guideUsername: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
}, { timestamps: true }); 

module.exports = mongoose.model("Customer", customerSchema);
