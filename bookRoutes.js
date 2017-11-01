var express = require('express'),
    router = express.Router(),
    app = express(),
    bodyParser = require('body-parser');
    PlayGround = require('./models/PlayGrounds'),
    Booking = require('./models/Booking');

router.route('/:id')
    .get(function(req, res) {
        var venueId = req.params.id;
        console.log(req);
        PlayGround.findOne({_id: venueId}, function(err, pg) {
            console.log(pg);
            if(req.isAuthenticated()) {
                var user = req.user;
                req.pg = pg;
                res.render('booking.ejs', { messages: "loggedIn", pg, user});
            }
            else {
                res.render('booking.ejs', { messages: null, pg, user});
            }
            
        });
        
    })

module.exports = router;