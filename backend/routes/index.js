const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

router.get('/', (req, res) => {
    res.send('It works!');
});

router.use('/v1', apiRouter);

module.exports = router;