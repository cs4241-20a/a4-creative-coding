const   http    = require( 'http' ),
        fs      = require( 'fs' ),
        express = require( 'express' ),
        bodyparser = require( 'body-parser' ),
        app = express(),
        port = 3000;

app.use( express.static( 'public' ));
app.use( bodyparser.json() );

app.get('/', (request, response) => {
    response.sendFile( __dirname + '/public/index.html' );
})

app.listen( process.env.PORT || port );