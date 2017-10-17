var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    path = __dirname + '/views/',
    router = express.Router(),
    mongoose = require('mongoose'),
    User = require('./public/Users'),
    secretKey = require('./secretKey.json');


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));   // to support URL-encoded bodie

mongoose.connect(secretKey.key, {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var Schema = mongoose.Schema;

// create a user a new user
var UserKitty = User;
var user1 = new UserKitty( {
    username: "user1",
    password: "pass1"
});
console.log(user1);

User.getAuthenticated("nigga", "chootiya", function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }
        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
});
/*
// save user to database

user1.save(function(err) {

    if(err) {
        throw err;
    }
    // attempt to authenticate user
    User.getAuthenticated(user1.username, 'chootiya', function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            return;
        }
        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                break;
            case reasons.MAX_ATTEMPTS:
                // send email or otherwise notify user that account is
                // temporarily locked
                break;
        }
    });
});
<<<<<<< HEAD
=======

>>>>>>> 9a58c6df1082e97e0bb904377a3d195b9ed39512
*/
// additional code
app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
// the code ends here

app.use("/",router);

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});


router.get("/",function(req,res){
res.render('loginPage');
//res.sendFile(path + "index.html");
});

app.get("/user", function(req, res) {
    res.render("user_homepage");
});

app.post("/register", function(req, res) {
    var currentUser = new UserKitty( {
        name:   req.body.username,
        password:   req.body.password,
        username:   req.body.email
    })
    if(createUser(currentUser)) {
    res.redirect("/user");
    }
});

app.post('/login',function(req, res) {
    var currentUser = new UserKitty( {
        username:    req.body.username,
        password:   req.body.password
    });
    getAuth(currentUser, function(sucess) {
        if(sucess)
            res.redirect("/user");
        else
            res.redirect("/");
    });
});


app.listen(app.get('port'), function() {
console.log('Node app is running on port', app.get('port'));
});

function getAuth(user, sucess) {


    // attempt to authenticate user
    User.getAuthenticated(user.username, user.password, function(err, user, reason) {
        if (err) throw err;

        // login was successful if we have a user
        if (user) {
            // handle login success
            console.log('login success');
            sucess(true);
        }
        // otherwise we can determine why we failed
        var reasons = User.failedLogin;
        switch (reason) {
            case reasons.NOT_FOUND:
                console.log("NOT FOUND");
                sucess(false);
                break;
            case reasons.PASSWORD_INCORRECT:
                // note: these cases are usually treated the same - don't tell
                // the user *why* the login failed, only that it did
                console.log("password incorrect");
                sucess(false);
                break;
        }

    });
}
function createUser(user) {

    user.save(function(err) {
        if(err) {
            return false;
            throw err;
        }
    });
    return true;

}
