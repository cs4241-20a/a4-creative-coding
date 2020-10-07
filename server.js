const express = require("express"),
    app = express();
    //detector = require("web-audio-beat-detector");
//import MAIN from './public/js/main'

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/node_modules"));
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/scene.html");
});

//MAIN.init(detector);
//MAIN.animate();

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});