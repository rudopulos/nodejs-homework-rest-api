const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/user');


router.get('/current', verifyToken, async (req, res, next) => {
  try {
    // Obțineți id-ul utilizatorului din token-ul JWT
    const userId = req.user.userId;

    // Căutați utilizatorul în baza de date folosind id-ul
    const user = await User.findById(userId);

    // Verificați dacă utilizatorul există
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Returnați informațiile despre utilizator
    res.status(200).json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
