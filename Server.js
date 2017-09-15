var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    path = __dirname + '/views/',
    router = express.Router(),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));   // to support URL-encoded bodie

mongoose.connect('mongodb://localhost:27017/gameon', {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var Schema = mongoose.Schema;
    

var UserSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});



UserSchema.pre('save', function(next){ 
var user = this;
// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}
        


var UserKitty = mongoose.model('UserKitty',UserSchema);
var user1 = new UserKitty( {
    username: "nigga",
    password: "chootiya"
});
console.log(user1);


// addictional code
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
res.render('login');
//res.sendFile(path + "index.html");
});

app.post('/register',function(req, res) {
    var currentUser = new UserKitty( {
        username:    req.body.username,
        password:   req.body.password
    });
    console.log(currentUser);
});

app.listen(app.get('port'), function() {
console.log('Node app is running on port', app.get('port'));
});

