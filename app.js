require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const User = require('./models/user'); 


mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());


function sendEmailTo(username, email) {
  const nodemailerConfig = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  };

  let transporter = nodemailer.createTransport(nodemailerConfig);

  let mailOptions = {
    from: process.env.OUTLOOK_EMAIL, 
    to: email, 
    subject: "Test Email", 
    text: `Welcome ${username} to myApp!`, 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}


app.post('/users/verify', async (req, res) => {
  try {
      const { email } = req.body;
      console.log('Received request to verify email:', email); 
      if (!email) {
          return res.status(400).json({ message: 'Missing required field email' });
      }

      
      const existingUser = await User.findOne({ email });
      console.log('Existing user:', existingUser); 

      if (existingUser) {
          console.log('User with this email already exists'); 
          return res.status(400).json({ message: 'User with this email already exists' });
      }

    
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const user = new User({ 
          email, 
          verificationToken,
          avatarURL: 'default-avatar.jpg',
          password: 'default-password'
      });

      await user.save();

     
      sendEmailTo('Username', email); 

     
      return res.status(200).json({ message: 'User created successfully. Verification email sent' });

  } catch (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});


app.post('/users/avatars', (req, res) => {
  
  res.send('Avatar uploaded successfully'); 
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
