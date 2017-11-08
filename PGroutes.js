var express = require('express'),
router = express.Router(),
app = express(),
bodyParser = require('body-parser');
PlayGround = require('./models/PlayGrounds');

var ids = new Array();
PlayGround.find({},function(err, playgrounds) {
playgrounds.forEach(function(playground) {
  //  console.log(ids.push(playground._id));
  //  console.log((playground._id));
});
for(var i=0;i<ids.length;i++) {
    console.log(ids[i]);
    PlayGround.findOne({_id: ids[i]},function(err, data) {
    //    console.log(data);
    });
}
});


router.route('/')
.get(function(req, res) {
    PlayGround.find({},function(err, pgs) {
        if(err) {
            res.send(err);
        }
        else {
            if(req.isAuthenticated()) {
                res.render('viewPlaygrounds', {
                    pgs, messages: "loggedIn"
                });
            }else {
                res.render('viewPlaygrounds', { pgs, messages: null });
            }    
            
        }
    });
});

router.route("/create")
.get(function(req,res){
    if(req.isAuthenticated()) {
        res.render("playground-create", { messages: "loggedIn"});
    }
    else {
        res.render("playground-create", { messages: null });
    }
})
.post(function(req, res) {
    PlayGround.find({},function(err, pgs) {
        
        if(err) {
            res.send(err);
        }
        else {
            var length = pgs.length+1;    
            var pg = new PlayGround(  {
                name: req.body.name,
                area: req.body.area, 
                id:  length,
                img: req.body.img,
                desc: req.body.desc,
                contact: req.body.contact,
                sports: req.body.sport
                
            });
            console.log(req.body.sport);
            pg.save( function(err) {
                if(!err) {
                    res.redirect('/playgrounds');
                } 
                else {
                    res.send("error coccurred, playground not saved");
                }
            });
            
        }
    });
    
});

router.route("/edit")
    .get(function(req, res) {
        PlayGround.find({}, function(err, pgs) {
            if (err) {
                res.send("error occured");
            }
            if(req.isAuthenticated())
                res.render('playgroundsEdit',{ messages: "isLoggedIn", pgs });
                else 
                res.render('playgroundsEdit',{ messages: null, pgs});
        });
    })    

router.route("/:id")
.get(function(req,res){
    query = req.params.id;
    console.log(query);
    PlayGround.find({_id: query},function(err,data) {
        if(err) {
            res.err();
        }
        console.log(data);
        if(req.isAuthenticated()) { 
            res.render("Playgrounds", { data, messages: "loggedIn" });
        }
        else {
            res.render('Playgrounds', { data, messages: null })
        }
    });
})
.post(function(req, res) {
    
})



//res.sendFile(path + "index.html");


module.exports = router;