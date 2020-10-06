const express = require("express");
const app = express();

// make all the files in 'public' available
app.use(express.static("public"));

app.get("/", (request, response) => {
        response.sendFile(__dirname + "/views/index.html");
});
app.get("/index.html", (request, response) => {
    response.sendFile(__dirname + "/views/index.html");
});

// listen for requests
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});