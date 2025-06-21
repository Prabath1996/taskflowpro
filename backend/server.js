const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
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
const app = express();
const port = (process.env.SERVER_PORT || 5000);

// Middleware
app.use(cors());
app.use(bodyParser.json());


//Connect to MongoDB
const DATABASE_URL = process.env.MONGODB_URL;

mongoose.connect(DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology: true,}); 
const connection = mongoose.connection;

connection.once("open", function() {
  try {
    console.log("MongoDB Connected~");
  } catch (e) {
    console.error(e.message);
  }
});

app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
    
app.get("/",(req,res)=> 
    res.send("Server is Running")
);


// Routes
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/tasks', taskRoutes);


