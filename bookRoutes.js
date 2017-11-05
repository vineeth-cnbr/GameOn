var express = require('express'),
    router = express.Router(),
    app = express(),
    bodyParser = require('body-parser');
    PlayGround = require('./models/PlayGrounds'),
    Booking = require('./models/Booking');

router.get('/confirm-:id',function(req, res) {
    var venueId = req.params.id;
    PlayGround.findOne({_id: venueId}, function(err, pg) {
        var user = req.user;
        var book = new Booking( {
            date: req.query.date,
            duration: req.query.time,
            by: user,
            venue: pg
        });
        book.save(function(err) {
            if(err) {
                console.log("booking not saved");
                res.send("booking not saved");
                
            }else {
                res.redirect("/user")
            }
        })
    })
    
})


router.route('/:id')
    .get(function(req, res) {
        var venueId = req.params.id;
        //console.log(req);
        PlayGround.findOne({_id: venueId}, function(err, pg) {
            //console.log(pg);
            if(req.isAuthenticated()) {
                var user = req.user;
                req.pg = pg;
                res.render('booking.ejs', { messages: "loggedIn", pg, user});
            }
            else {
                res.render('booking.ejs', { messages: null, pg, user});
            }
            
        });
        
    });

module.exports = router;