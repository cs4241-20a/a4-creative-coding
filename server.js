var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 3000));




app.get("/", (request, response) => {
    response.redirect("/index")
});

app.get("/index", (request,response)=>{
    response.render("login.html");
})


app.listen(3000);