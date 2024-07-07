require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Welcome to ConnectPro server.');
})

app.listen(port, () => {
    console.log(`ConnectPro server is running on port ${port}`);
})