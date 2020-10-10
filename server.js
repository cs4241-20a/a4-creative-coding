
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// LISTENING PORT
app.listen(process.env.PORT || 3000, function () {
    console.log('The app is listening on port ' + this.address().port);
    console.log('Served at http://localhost:3000');
})