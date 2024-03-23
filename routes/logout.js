const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/logout', verifyToken, async (req, res, next) => {

});

module.exports = router;
