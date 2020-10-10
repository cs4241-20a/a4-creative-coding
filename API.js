const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;

const host = process.env.MONGODB_HOST
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD
const database = process.env.MONGODB_DATABASE

const uri = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`

const client = new MongoClient(uri);
client.connect();

// Get the specified number of words from the db
const getWords = function(num) {
  var queryDoc = {};
  
  return client.db("a4-webware").collection("words").find().toAray();
}