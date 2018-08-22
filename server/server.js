var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes.js');

//// BASIC SERVER CONFIG, USING EXPRESS ////

var port = process.env.PORT || 8080;

app.use(bodyParser({ extended: true }));

// MIDDLEWARE TO ADD HEADERS TO RESPONSE OF THE SERVER //
app.use(function (req, res, next) {
    console.log("New request : ", req.path)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

console.log("Test env")
console.log(process.env.VOLVO_HTTP_PROXY)


// REDIRECT ALL REQUEST ON "/api" TO THE ROUTES.JS FILE AFTER BEING PASSED IN THE MIDDLEWARE 
app.use('/api', routes)


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);