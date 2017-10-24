var express = require('express'),
    router = express.Router(),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    User = require('./public/Users'),
    PlayGround = require('./public/PlayGrounds'),
    secretKey = require('./secretKey.json');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));   // to support URL-encoded bodie

mongoose.connect(secretKey.key,{useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("mLabs Connected! ");
});



var UserKitty = User;
var PlayG = PlayGround;
setTimeout(function() {
    var currentPG = new PlayG( {
    name : "Decathlone",
    area : "Marathhalli"
    });
currentPG.save( function(err) {
    console.log("inside save");
    if(err) {
        console.log("error is became");
    } else {
        console.log("Magic");
    }
});

},3000);

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
res.render('loginPage');
//res.sendFile(path + "index.html");
});

router.get("/user", function(req, res) {
    res.render("user_homepage");
});

router.get("/playgrounds", function(req, res) {
    res.render("Playgrounds");
});

router.post("/register", function(req, res) {
    var currentUser = new UserKitty( {
        name:   req.body.username,
        password:   req.body.password,
        username:   req.body.email
    })
    createUser(currentUser, function(err) {
        if(err) {
            res.send("the following error Occured: " + err);
        }
        else {
            res.redirect("/user");
        }
    }); 
});

router.post('/login',function(req, res) {
    var currentUser = new UserKitty( {
        username:   req.body.username,
        password:   req.body.password
    });
    getAuth(currentUser, function(sucess) {
        if(sucess)
            res.redirect("/user");
        else
            res.redirect("/");
    });
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

function createUser(user, cb) {

    user.save(function(err) {
        if(err) {
            cb(err);
            throw err;
        }
        else {
            cb(null);
        }
    });
    

}

module.exports = router;
