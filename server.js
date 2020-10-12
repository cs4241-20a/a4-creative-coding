// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('connect-flash');
const app = express();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = `mongodb+srv://user:abcdef123@cluster0.z38ps.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true});
let users = null;
client.connect(err => {
  users = client.db("test").collection("fallguys");
});

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/getTiles", (req, res) => {
  if (round !== 'memorization') {
    res.json({poop: "poop"});
  }
  else {
    res.json(tiles);
  }
});

app.get('/getColor', (req, res) => {
  if (round !== 'reveal') {
    res.json({poop: "poop"});
  }
  else {
    res.json(color);
  }
})

app.post('/sendSelection', (req, res) => {
  if (round !== 'reveal') {
    res.json({poop: 'poop'});
  }
  else {
    console.log(req.body);
    users.insertOne(req.body);
  }
})

app.get('/getRound', (req, res) => {
  res.json(round);
})

let rounds = ['memorization', 'reveal', 'selection'];
let round = rounds[0];
let i = 0;
let roundWinners = [];
function switchRound() {
  i++;
  round = rounds[i % 3];
  if (round === "selection") {
    switchColor();
    tiles = [];
    generateTiles();

    users.deleteMany({});
  }
}
setInterval(switchRound, 10 * 1000);
const colors = ['red', 'blue', 'green', 'purple'];
let tiles = [];
generateTiles();
let color = 'red';
function switchColor() {
  color = colors[Math.floor(Math.random() * colors.length)];
}

function generateTiles() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push({x: i * 100, y: j * 100, color: colors[Math.floor(Math.random() * colors.length)]});
    }
  }
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
