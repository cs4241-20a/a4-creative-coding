const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

app.use(express.static('public'));
app.use(helmet());
app.use(compression());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/public/js/scripts.js', function (request, response) {
    response.sendFile(path.join(__dirname, '/public/js/scripts.js'));
});

app.get('/public/js/main.js', function (request, response) {
    response.sendFile(path.join(__dirname, '/public/js/main.js'));
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});