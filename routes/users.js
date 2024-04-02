const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const jimp = require('jimp');
const auth = require('../middleware/auth');
const User = require('../models/user');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './tmp'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});
const upload = multer({ storage: storage });

router.patch('/avatars', auth, upload.single('avatar'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

   
    const image = await jimp.read(req.file.path);
    await image.resize(250, 250);
    await image.writeAsync(req.file.path);

    
    const uniqueFileName = `${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
    fs.renameSync(req.file.path, path.join(__dirname, `../public/avatars/${uniqueFileName}`));

  
    req.user.avatarURL = `/avatars/${uniqueFileName}`;
    await req.user.save();

    res.status(200).json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
