const express = require('express'),
      fetch = require('node-fetch'),
      bodyparser = require('body-parser'),
      app = express()

//var favicon = require('serve-favicon')
var path = require('path')

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
 
app.use(bodyparser.json())

// app.get('/', function(request, response) {
//   console.log('GET: ',request.url)
//     response.sendFile( __dirname + '/public/index.html' )
// })

app.use(express.static(__dirname +'/public'))

app.listen(process.env.PORT || 3000, function(){
  console.log('The app is listening on port 3000')
})

