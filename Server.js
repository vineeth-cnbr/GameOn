var express = require("express"),
    app = express(),
    path = __dirname + '/views/',
    bodyParser = require('body-parser'),
    router = require('./routes.js');


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));   // to support URL-encoded bodie
        

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', path);
app.set('view engine', 'ejs');
// the code ends here

app.use(router);

app.listen(app.get('port'), function() {
console.log('Node app is running on port', app.get('port'));
});
