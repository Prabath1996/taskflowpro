const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');
const employeeRoutes = require('./routes/employee');
const warrantyRoutes = require('./routes/warranty');
const repairRoutes = require('./routes/repair');
const taskRoutes = require('./routes/task');
const PORT = 5000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());


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
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/tasks', taskRoutes);


app.get("/",(req,res)=> 
    res.send("Server is Running")
);


// Start Server
app.listen(PORT,() => 
    console.log(`Server is Running on PORT ${PORT}`)
);
