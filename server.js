// PACKAGES
const express = require('express'),
    morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

//Listening Port
const port = process.env.PORT || 3000;

app.listen(port, () => console.log("Server launched on port: ${port}"));

