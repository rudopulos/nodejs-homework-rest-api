const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecret } = require('../config');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

 
    return res.status(201).json({ user: { email: newUser.email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', async (req, res, next) => {
 
});

router.get('/current', async (req, res, next) => {
 
});

module.exports = router;
