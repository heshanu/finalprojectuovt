const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["hotel", "food", "travel", "guide", "activity"],
    required: true
  },
  title: String,
  description: String,
  startTime: String,
  endTime: String,
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  cost: {
    type: Number,
    default: 0
  }
});

const daySchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  activities: [activitySchema]
});

const travelPlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true
    },

    description: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    days: [daySchema],

    totalCost: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["draft", "confirmed", "completed", "cancelled"],
      default: "draft"
    },
    guideSatisLevel:{type:String,default:"100%"}
  },
  { timestamps: true }
);

module.exports = mongoose.model("TravelPlan", travelPlanSchema);
