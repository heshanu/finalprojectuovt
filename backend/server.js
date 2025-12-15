const mongoose = require("mongoose");
const dotenv=require('dotenv');
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const planeRoutes=require('./routes/travelplan')
const app = express();
const port = (process.env.SERVER_PORT || 3001);

dotenv.config();

// Add environment variables validation
const requiredEnvVars = ['MONGODB_URL', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Security middleware
app.use((req, res, next) => {
  // Remove server information
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
});

// Middleware
app.use(cors({
  origin: [
    'https://finalprojectuovt-snowy.vercel.app',   // Production
    'http://localhost:3001',                // Development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request size limiting
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//Connect to MongoDB
const DATABASE_URL = process.env.MONGODB_URL;

mongoose.connect(DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const connection = mongoose.connection;

connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Root route
app.get("/",(req,res)=> 
    res.send("Server is Running")
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/Customers', customerRoutes);
app.use('/api/plan',planeRoutes);
// 404 Not Found handler
app.use((req, res, next) => { 
  res.status(404).json({ 
    error: "404 Not Found",
    message: "The requested resource could not be found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
