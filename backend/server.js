const express = require("express");
const mongoose = require("mongoose");
const PORT = 5000;
const app = express();


//Connect to MongoDB
//ccU1umZwh4auNo4K
const dburl = "mongodb+srv://dbuser:ccU1umZwh4auNo4K@cluster0.8hpcduv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dburl, {useNewUrlParser: true,useUnifiedTopology: true,});
  
const connection = mongoose.connection;
connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});


app.get("/",(req,res)=> 
    res.send("Server is Running")
);

// Start Server
app.listen(PORT,() => 
    console.log(`Server is Running on PORT ${PORT}`)
);