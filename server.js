const express = require('express'),
      fetch = require('node-fetch'),
      bodyparser = require('body-parser'),
      app = express()

var path = require('path')
 
app.use(bodyparser.json())
app.use(express.static(__dirname +'/public'))

app.listen(process.env.PORT || 3000, function(){
  console.log('The app is listening on port 3000')
})

