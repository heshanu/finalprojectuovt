require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGODB_URL;

if (!uri) {
  throw new Error("MONGO_URI is not defined in your environment variables!");
}

// Just pass the URI; do NOT include useUnifiedTopology
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("semester6db"); // your database name
    console.log("Connected to MongoDB");
  }
  return db;
}

module.exports = { connectDB, ObjectId };
