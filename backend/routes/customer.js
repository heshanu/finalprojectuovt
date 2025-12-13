const express = require("express");
const Customer = require("../models/Customer")
const router = express.Router();

// Get all guides
router.get("/getCustomer", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new customer
router.post("/addCustomer", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    // Validate required fields
    if (!customer.name) {
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
    if (!customer.phonenumber) {
      return res.status(400).json({
        error: "Phone number is required",
      });
    }
   // Phone number format validation
      const phoneRegex = /^(07|09)\d{8}$/;
      if (!phoneRegex.test(customer.phonenumber)) {
        return res.status(400).json({
          error:
            "Invalid phone number format. Must be 10 digits and start with 07 or 09",
        });
      }
      // Duplicate phone number check
      const existingCustomerPhoneNo = await Customer.findOne({
        phonenumbe: customer.phonenumber,
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
    const existingCustomerEmail = await Customer.findOne({ email: customer.email });
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

// Get customers by User ID
// Get ALL customers for a specific user
router.get("/getCustomersByUser/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const customers = await Customer.find({ User: userId });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get one customer by email
// Get one customer by email
router.get("/getCustomerByEmail/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update customer
router.put("/updateCustomer/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete customer
router.delete("/deleteCustomer/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id, req.body);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;