// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const trackRoute = express.Router();
const multer = require('multer');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const ms = require('mediaserver');


const { Readable } = require('stream');



const app = express();


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use('/tracks', trackRoute);


const uri = "mongodb+srv://wying_glitch:${process.env.DBPASSWORD}@cluster0.zhrg2.mongodb.net/<dbname>?retryWrites=true&w=majority";
let db;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err, database) => {
  const collection = client.db("tracks").collection("music");
  // perform actions on the collection object
  db = database;
});

trackRoute.get('/:trackID',(req,res)=>{
    try {
    var trackID = new ObjectID(req.params.trackID);
  } catch(err) {
    return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
  }
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');
  
    let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'tracks'
    });
  
    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('error', () => {
      res.sendStatus(404);
    });

    downloadStream.on('end', () => {
      res.end();
    });


})


// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
        var AUDIOFILE = 'https://cdn.glitch.com/3f0225bc-d8ea-44d1-a762-d956a20ee84b%2Fbensound-dreams.mp3'
        ms.pipe(request,response,AUDIOFILE);
});


trackRoute.post('/submit',(req,res)=>{
  
  const storage = multer.memoryStorage()
  const upload = multer({ 
    storage: storage, 
    limits: { fields: 1, 
             fileSize: 6000000, 
             files: 1, 
             parts: 2 }});
  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed" });
    } else if(!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let trackName = req.body.name;
    
    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'tracks'
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
    });
  });
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
