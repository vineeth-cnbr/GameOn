var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    path = __dirname + '/views/',
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash    = require('connect-flash'),
    secretKey = require('./secretKey.json'),
    router = require('./routes.js'),
    session = require('express-session'),
    APIrouter = require('./api.js'),
    PGrouter = require('./PGroutes.js');

    mongoose.connect(secretKey.key,{useMongoClient: true});
    require('./config/passport.js')(passport); // pass passport for configuration
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: false }));   // to support URL-encoded bodie
        

    app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
app.use('/playgrounds', express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', path);
app.set('view engine', 'ejs');
// the code ends here

//app.use(router);
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./Userroutes.js')(app, passport);

app.use('/playgrounds',PGrouter);
app.use('/api',APIrouter);

app.listen(app.get('port'), function() {
console.log('Node app is running on port', app.get('port'));
});