const express = require("express")

// Setup
const PORT = 80
const app = express()
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
});

// Static files
app.use(express.static("public"))

