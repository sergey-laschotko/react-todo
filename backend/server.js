const express = require('express');
const app = express();

const router = require('./routes');
const storageAdapter = require('./storage-adapter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

storageAdapter.connect();

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
