const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Regiter User
router.post('/signup', async (req,res)=> {
  try {
    const { username,email, password,confirmPassword} = req.body;
    //Check if username was entered
    if(!username){
      return res.json({
        error: 'Name is Required'
      })
    };
    //Check if email was entered
    if(!email){
      return res.json({
        error: 'Email is Required'
      })
    };
     //Check if Password is good
    if(!password || password.length < 6){
      return res.json({
        error: 'Password is Required and should be at least 6 characters long'
      })
    };
    //Check password and confirmPassword are same
    if(password !== confirmPassword){
      return res.json({
        error: 'Password does not match'
      })
    }
    //Check Email
    const exist = await User.findOne({email});
     //Check if username was entered
    if(exist){
      return res.json({
        error: 'Email is taken already'
      })
    };

    //Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create User
    const user = await User.create({
      username,email,password:hashedPassword
    })

    return res.json(user)

  } catch (error) {
      console.log(error)
  }
})


// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check if user exist
    const user = await User.findOne({ email });
    if(!user){
      return res.json({
        error: 'No user found'
      })
    }
       //Check if email was entered
    if(!email){
      return res.json({
        error: 'Email is Required'
      })
    };
     //Check if Password is good
    if(!password || password.length < 6){
      return res.json({
        error: 'Password is Required and should be at least 6 characters long'
      })
    };
    //Check if password match
    const match = await bcrypt.compare(password, user.password)
    if(match){
      return res.json('password match')
    }
    else{
      return res.json({
        error: 'Password does not match'
      })
    }
  } catch (error) {
    console.log( error);  
}
});

module.exports = router;