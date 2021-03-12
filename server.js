// create the express server
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// make all the files in 'public' available
app.use(express.static("public"));

//parse json
app.use(bodyParser.json());

// load the index page on request
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/index.html", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})
app.get("/index", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
})

//load the canvas page on request
app.get("/canvas.html", (request, response) => {
  response.sendFile(__dirname + "/views/canvas.html");
})
app.get("/canvas", (request, response) => {
  response.sendFile(__dirname + "/views/canvas.html");
})

//store properties on server
var properties = {
  "reds": true,
  "oranges": true,
  "yellows": true,
  "greens": true,
  "blues": true,
  "purples": true,
  "pinks": true,
  "browns": true,
  "stardust": true,
  "comet": true,
  "ring": true,
  "bouquet": true,
  "spiral": true,
  "peony": true,
  "dahlia": true,
  "crossette": true,
  "airResistance": false, //factor air resistance into equations of motion?
  "windspeed": 0, //horizontal (x-axis) wind speed
  "gravity": 0, //vertical (y-axis) acceleration due to gravity
  "xyFlip": false, //swap the x and y axes
  "launchSpeed": 5, //speed of fireworks when launched
  "launchAngle": 0, //angle of fireworks when launched (relative to y-axis)
  "fuse": 10, //number of 100ms-cycles before firework explodes
  "radius": 4, //radius of particles (in px)
  "length": 6, //length of trails (in px)
  "duration": 10, //number of 100ms-cycles after explosion before particles disappear
  "explodeSpeed": 10, //initial speed of particles after explosion
  "ringParticles": 7, //number of particles per ring (used in Rings, Crossettes, Peonies, and Dahlias)
  "bouquetParticles": 4, //number of particles in Bouquet
  "spiralParticles": 11, //number of particles in Spiral
  "crossetteBursts": 4, //number of particles that each post-explosion Crossette particle splits INTO
  "spiralLoops": 2, //number of rotations in Spiral explosion (positive = clockwise, negative = counterclockwise)
  "emitterRings": 3 //number of rings in Peony and Dahlia explosions
};

//fetch properties from server
app.get("/properties", (request, response) => {
  response.json(properties);
})

//update a property when changed by the user
app.post("/update", (request, response) => {
  properties[request.body.propName] = request.body.newSetting;
})

// listen for requests
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
