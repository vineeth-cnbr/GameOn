var express = require('express'),
    router = express.Router(),
    app = express(),
    bodyParser = require('body-parser');
    PlayGround = require('./public/PlayGrounds');

    

router.route('/')
    .get(function(req, res) {
        PlayGround.find({},function(err, pgs) {
            if(err) {
                res.send(err);
            }
            else {    
                res.render('viewPlaygrounds', {
                    pgs
                });
            }
        });
    });

router.route("/create")
    .get(function(req,res){
        res.render("playground-create");
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
                    contact: req.body.contact
                });
                pg.save( function(err) {
                    if(!err) {
                        res.redirect('/playgrounds');
                    } 
                    else {
                        res.err();
                    }
                });
                
            }
        });
        
    });

router.route("/:id")
    .get(function(req,res){
        query = req.params.id;
        console.log(query);
        PlayGround.find({_id: query},function(err,data) {
            if(err) {
                res.err();
            }
            console.log(data);
            res.render("playgrounds",{ data });
        });
    })
    .post(function(req, res) {
        
    })


    
    //res.sendFile(path + "index.html");


module.exports = router;
