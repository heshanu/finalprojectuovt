const express = require("express");
const Guide = require("../../models/Guide")
const router = express.Router();

// Get all guides
router.get("/getGuide", async (req, res) => {
  try {
    const customers = await Guide.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new customer
router.post("/addGuide", async (req, res) => {
  try {
    const customer = new Guide(req.body);
    // Validate required fields
    if (!customer.customerName) {
      return res.status(400).json({
        error: "Customer Name is required",
      });
    }
    if (!customer.address) {
      return res.status(400).json({
        error: "Address is required",
      });
    }
    // Validate phone number
    if (!customer.phoneNo) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }
   // Phone number format validation
      const phoneRegex = /^(07|09)\d{8}$/;
      if (!phoneRegex.test(customer.phoneNo)) {
        return res.status(400).json({
          error:
            "Invalid phone number format. Must be 10 digits and start with 07 or 09",
        });
      }
      // Duplicate phone number check
      const existingCustomerPhoneNo = await Guide.findOne({
        phoneNo: customer.phoneNo,
      });
      if (existingCustomerPhoneNo) {
        return res.status(409).json({
          error: "Phone number already exists.",
        });
      }
    //Validate Email
    if (!customer.email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }
    // Check for duplicate email
    const existingCustomerEmail = await Guide.findOne({ email: customer.email });
    if (existingCustomerEmail) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    // Save the customer
    await customer.save();
    // Return the created customer
    res.json(customer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single customer
router.get("/getGuidebyId/:id", async (req, res) => {
  try {
    const customer = await Guide.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer
router.put("/updateGuide/:id", async (req, res) => {
  try {
    const customer = await Guide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete customer
router.delete("/deleteGuide/:id", async (req, res) => {
  try {
    const customer = await Guide.findByIdAndDelete(req.params.id, req.body);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;