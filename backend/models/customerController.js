// customerController.js
const { connectDB, ObjectId } = require("../models/Customer");

async function getAllCustomers() {
  const db = await connectDB();
  const collection = db.collection("customers");
  return collection.find({}).toArray();
}

async function getCustomerById(id) {
  const db = await connectDB();
  const collection = db.collection("customers");
  return collection.findOne({ _id: new ObjectId(id) });
}

async function createCustomer(data) {
  const db = await connectDB();
  const collection = db.collection("customers");
  const result = await collection.insertOne(data);
  return result.insertedId;
}

async function updateCustomer(id, data) {
  const db = await connectDB();
  const collection = db.collection("customers");
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
}

async function deleteCustomer(id) {
  const db = await connectDB();
  const collection = db.collection("customers");
  await collection.deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
