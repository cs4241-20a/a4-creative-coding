var browserify = require('browserify');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs   = require( 'fs' );
var d3 = require("d3");

//allows body-parser to extract data from the form element
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cors());
//serving the files
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false
});


app.use(expressSession);
app.use(express.static("public"));
app.use(express.static("./"));

/*
const fireReadData = fs.readFileSync('public/data/boston_fire_departments.json','utf8')
const fire= JSON.parse(fireReadData)

const policeReadData = fs.readFileSync('public/data/boston_police.json','utf8')
const police= JSON.parse(policeReadData)

const schoolReadData = fs.readFileSync('public/data/boston_public_schools.json','utf8')
const school= JSON.parse(schoolReadData)

const hospitalReadData = fs.readFileSync('public/data/boston_hospitals.json','utf8')
const hospital= JSON.parse(hospitalReadData)

const mapReadData = fs.readFileSync('public/data/boston_neighborhoods.json','utf8')
const map= JSON.parse(mapReadData)

    app.post("/replace",(req, res) => {
      res.end(replaceData(tasksCollection, req, res));
    });

    //get methods
    app.get("/", function(req, res) {
      console.log("this does print ")
      res.send(map.html);
    });

    app.get("/fire", function(req, res) {
        res.send(fire);
      });
    
      app.get("/school", function(req, res) {
        res.send(school);
      });
    
      app.get("/police", function(req, res) {
        res.send(police);
      });

      app.get("/hospital", function(req, res) {
        res.send(hospital);
      });

      app.get("/map", function(req, res) {
          console.log("map requested")
        res.send(map);
      });


    //delete methods
    app.delete("/delete",function(req, res) {
      res.send(deleteData(tasksCollection, req, res));
    });
*/
//initializing the server
var server = app.listen(3002, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("listening at http://%s:%s", host, port);
});
