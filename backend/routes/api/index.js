const express = require('express');
const router = express.Router();
const storageAdapter = require('../../storage-adapter');

router.get('/todos', (req, res) => {
    res.json(storageAdapter.isReady());
});

router.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

module.exports = router;