const express = require('express');
const router = express.Router();
const { io } = require('../server');

router.get('/', (req, res) => {
    res.send('It works!');
});

module.exports = router;