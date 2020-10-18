const express = require("express");
const cors = require('cors')
const app = express();

// enable CORS for external audio file loading
app.use(cors());

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/test", (request, response) => {
  console.log(request);
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
