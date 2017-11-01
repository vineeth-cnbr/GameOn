var express = require('express'),
    router = express.Router(),
    app = express(),
    PlayGround = require('./models/PlayGrounds');
var PlayG = PlayGround;
var ids = new Array();
/*PlayG.find({},function(err, playgrounds) {
        playgrounds.forEach(function(playground) {
            console.log(ids.push(playground._id));
            console.log((playground._id));
        });
        for(var i=0;i<ids.length;i++) {
            console.log(ids[i]);
            PlayG.findOne({_id: ids[i]},function(err, data) {
                console.log(data);
            });
        }
    }); */


router.route("/pg")
    .post(function(req, res) {

    })
    .get(function(req, res) {
        PlayGround.find(function(err, pgs) {
            if(err) {
                res.send(err);
            }
            else {
                res.json(pgs);
            }
        });
    });

router.route("/pg/:pg_id")
    .get(function(req, res) {
        PlayGround.findById(req.params.pg_id, function(err, pg) {
            if (err)
                res.send(err);
            res.json(pg);
        });
    })
    .put(function(req, res) {
        PlayGround.findById(req.params.pg_id, function(err, pg) {
            
            if (err)
                res.send(err);
            console.log(req.body.name)
            pg.name = req.body.name;  // update the pg's info

            // save the pg
            pg.save(function(er) {
                if (er)
                    res.send(er);

                res.json({ message: 'pg updated!' });
            });
        });
    });


    module.exports = router;