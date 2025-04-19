const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const warrantyRoutes = require('./routes/warranty');
const PORT = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('MongoDB connection error:', err));



//Connect to MongoDB
const uri = "mongodb+srv://dbuser:ccU1umZwh4auNo4K@cluster0.8hpcduv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {useNewUrlParser: true,useUnifiedTopology: true,}); 
const connection = mongoose.connection;

connection.once("open", function() {
  try {
    console.log("MongoDB Connected~");
  } catch (e) {
    console.error(e.message);
  }
});


// Routes
app.use('/api/user', userRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/warranty', warrantyRoutes);


// app.get("/",(req,res)=> 
//     res.send("Server is Running")
// );

// Start Server
app.listen(PORT,() => 
    console.log(`Server is Running on PORT ${PORT}`)
);