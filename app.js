const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer'); 
const fs = require('fs'); 
app.set('view engine', 'jade');
app.use(express.static(__dirname));




app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'avatars'));
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

const upload = multer({ storage: storage });


app.post('/users/avatars', upload.single('avatar'), (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }


    const filename = req.file.filename;
    

    console.log('Uploaded avatar:', filename);

    const avatarURL = `/avatars/${filename}`;


    return res.status(200).json({ avatarURL });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
