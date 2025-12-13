const express = require("express");
const router = express.Router();
const TravelPlan = require("../models/TravelPlan");


//get all plans
router.get("/getAll", async (req, res) => {
  try {
    const tripplans = await TravelPlan.find();
    res.json(tripplans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get plan by id
router.get("/getplan/:planId", async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await TravelPlan.find({ User: planId });

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE Travel Plan
router.post("/create", async (req, res) => {
  try {
    const {
      planName,
      description,
      user,
      customer,
      startDate,
      endDate,
      days
    } = req.body;

    // Basic validation
    if (!planName || !user || !customer || !startDate || !endDate) {
      return res.status(400).json({
        error: "Required fields are missing"
      });
    }

    // Calculate total cost from activities
    let totalCost = 0;
    if (days && Array.isArray(days)) {
      days.forEach(day => {
        if (day.activities) {
          day.activities.forEach(activity => {
            totalCost += activity.cost || 0;
          });
        }
      });
    }

    const travelPlan = await TravelPlan.create({
      planName,
      description,
      user,
      customer,
      startDate,
      endDate,
      days,
      totalCost,
      status: "draft"
    });

    res.status(201).json({
      message: "Travel plan created successfully",
      travelPlan
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.put("/updateplan/:id", async (req, res) => {
  try {
    const plan = await TravelPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!plan) return res.status(404).json({ error: "plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//delete plan by id
router.delete("/deleteplan/:id", async (req, res) => {
  try {
    const plan = await TravelPlan.findByIdAndDelete(req.params.id, req.body);
    if (!plan) return res.status(404).json({ error: "PLan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
