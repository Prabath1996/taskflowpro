const dotenv=require('dotenv');
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const warrantyRoutes = require('./routes/warranty');
const repairRoutes = require('./routes/repair');
const supplierRoutes = require('./routes/supplier');
const taskRoutes = require('./routes/task');
const sendmailRoutes = require('./routes/sendmail');
const app = express();
const port = (process.env.SERVER_PORT || 5000);

dotenv.config({path:'./.env'});

// Add environment variables validation
const requiredEnvVars = ['MONGODB_URL', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
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
  origin: ['https://taskflowpro-one.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request size limiting
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//Connect to MongoDB
const DATABASE_URL = process.env.MONGODB_URL;

mongoose.connect(DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology: true})
  .then(() => console.log("MongoDB Connected~"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

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
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notify', sendmailRoutes);

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