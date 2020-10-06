// server.js
// where your node app starts

const express = require("express");
const app = express();

app.set("views", __dirname + "/public/views");
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(request, response) {
  response.render("normal");
});

app.get("/easy", function(request, response) {
  response.render("easy.ejs");
});

app.get("/normal", function(request, response) {
  response.render("normal.ejs");
});

app.get("/hard", function(request, response) {
  response.render("hard.ejs");
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
