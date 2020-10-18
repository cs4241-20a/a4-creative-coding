const express = require("express");
const app = express();


app.use(function (req, res, next) {
    res.setTimeout(120*1000, function () {
        console.log("Request has timed out.");
        return res.status(408).send("time out!")
    });
    next();
});

app.set('trust proxy', 1) // trust first proxy

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("music"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    // response.sendFile(__dirname + "/views/index.html");
    // response.redirect('/loginto')
    response.sendFile(__dirname + "/views/index.html");
});



const port=3000
// listen for requests :)
const listener = app.listen(port, () => {
    console.log("Your app is listening on port " + port);
});

