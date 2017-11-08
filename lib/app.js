var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '../', 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

module.exports = app;