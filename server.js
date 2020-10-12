// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const three = require("three");
const app = express();

// our default array of dreams
app.use(express.static('views'));
app.use(express.static('node_modules/three/build'));
app.use(express.static('node_modules/three/examples/js/renderers'));
app.use(express.static('node_modules/three/examples/js/loaders'));
app.use(express.static('node_modules/three/examples/js/controls'));
app.use(express.static('node_modules/three/examples/js/*'));

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
