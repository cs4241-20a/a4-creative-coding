// JavaScript source code
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Port
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Application is in local port: " + listener.address().port);
});