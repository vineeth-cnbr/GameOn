var express = require("express"),
    app = express(),
    path = __dirname + '/views/',
    router = require('./routes.js');


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
