// A simple express server for storing settings data
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(express.static('./'))

//simple server for storing settings and defaults
const settings = { volume: 50, frequency: 262, octaves: 1, piano: true }
const default_settings = { volume: 50, frequency: 262, octaves: 1, piano: true }



//default get method
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

//get default settings
app.get("/reset", bodyParser.json(), (req, res) => {
    console.log("Loading defaults: " + JSON.stringify(default_settings));
    res.json(default_settings);
    console.log("Defaulted!");
})

//get server settings
app.post("/load", bodyParser.json(), (req, res) => {
    console.log("Loading old settings: " + JSON.stringify(settings));
    res.json(settings);
    console.log("Loaded!");
})

//post to update server settings
app.post("/save", bodyParser.json(), (req, res) => {
    console.log("These settings saved: " + req.body);
    settings = req.body
    console.log("Saved!");
})

//listen to port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})