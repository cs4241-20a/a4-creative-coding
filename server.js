// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require('body-parser')
const app = express();

// our default array of dreams
var objects = [];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/getall", (request, response) => {
  // express helps us take JS objects and send them as JSON
  console.log(objects.length)
  response.json(objects);
  if(objects.length > 50){
    response.json("too many")
  }
});

app.post("/add", bodyParser.json(),(request, response) => {
  // express helps us take JS objects and send them as JSON
  if(objects.length<50){
    var newObj = {x: request.body.x, y: request.body.y, z:request.body.z}
    objects.push(newObj)
    console.log("trying to add")
    response.json("done")
  }
  else{
    response.json("too many")
  }
});

app.get("/clear", (request,response) =>{
  objects = []
  console.log("clearing")
  response.json("cleared")
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
