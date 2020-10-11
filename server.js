// A simple express server for storing settings data
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { json } = require('body-parser');
app.use(express.static('./'));
app.use(bodyParser.urlencoded({extended: true}));

//simple server for storing settings and defaults
let settings = { volume: 0.5, waveform: "sine", passtype: "Lowpass", frequency: 1000.0 }
const default_settings = { volume: 0.5, waveform: "sine", passtype: "Lowpass", frequency: 1000.0 }



//default get method
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

//get default settings
app.get("/reset", (req, res) => {
    console.log("Loading defaults: " + JSON.stringify(default_settings));
    settings = default_settings;

    res.json(default_settings);
    console.log("Defaulted!");
})

//get server settings
app.get("/load", (req, res) => {
    console.log("Loading old settings: " + JSON.stringify(settings));

    res.json(settings);
    console.log("Loaded!");
})

//post to update server settings
app.post("/save", bodyParser.json(), (req, res) => {
    console.log("Before change: " + JSON.stringify(settings));
    console.log("The volume is: " + req.body.volume);

    settings = {
        volume: req.body.volume,
        waveform: req.body.waveform,
        passtype: req.body.passtype,
        frequency: req.body.frequency
    }
    
    console.log("These settings saved: " + JSON.stringify(settings));
    //console.log("After change: " + JSON.stringify(settings));
    console.log("Saved!");
    // res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
    // res.end();
})

//listen to port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})