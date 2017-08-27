var express = require("express"),
    app = express(),
    path = __dirname + '/views/',
    router = express.Router(),
    MongoClient = require('mongodb').MongoClient;


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

MongoClient.connect('mongodb://localhost:27017/GameOn', function(err, db) {

  router.get("/",function(req,res){
    res.render('login');
    //res.sendFile(path + "index.html");
  });

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

});
