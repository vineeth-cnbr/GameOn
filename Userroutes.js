module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    var Booking = require('./models/Booking');
    app.get('/', function(req, res) {
        if(req.isAuthenticated()) {
            res.render('loginPage.ejs', { messages: "loggedIn" });
        }else {
            var flashMessage = req.flash('loginMessage'); 
            console.log("message " + flashMessage);
            res.render('loginPage.ejs', { messages: flashMessage });
        }
         // load the index.ejs file
    });

    app.get(`/userProfile`, isLoggedIn,  function(req, res){
        var user = req.user;
        res.render(`userProfile.ejs`, {messages: "loggedIn", user});
    });
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/loginUser', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('loginPage.ejs', { message: req.flash('loginMessage') }); 
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    /*app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('loginPage.ejs', { message: req.flash('signupMessage') });
    });*/

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        
            res.redirect('/');
        
        
    });
    
    app.get('/sport', function(req, res) {
        res.render('sport.ejs', { messages: null });
    });
    
    app.get('/user', isLoggedIn,function(req, res) {  
        var user = req.user;
        //var bookids = user.bookings;
        // console.log(user);
        User.findOne({_id: user._id}).populate('bookings').populate( { path: "bookings", populate: { path: 'venue'} }).exec( function(err, users) {
            if(err) {
                console.log("not populating cuz" + err);
            } else {
                console.log(users);
                
                res.render('userPage.ejs', { messages: "loggedIn" ,  users });
            }
        });

            
    });

    app.post('/user/update', function(req, res) { 
        var name = req.body.name;
        var area = req.body.area;
        User.update({ "_id": req.user._id }, { "name": name, "area": area }, function(err, data) {
            if(!err) {
                console.log("User updated");
                res.redirect('/user');
            }
            else {
                console.log("Not updated");
                res.redirect('/user');
            } 
        }) ;

    })
    
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/user', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/user', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    app.post('/register', function(req, res) {
    var currentUser = new UserKitty( {
        name:   req.body.username,
        password:   req.body.password,
        username:   req.body.email
    })
    });

    app.get('/delete-:id',function(req, res) {
        //console.log(req.params.id);
        var id = req.params.id;
        User.remove({_id: id}, function(err, doc) {
            if(err) {
                res.send("User not removed, go back");
            } else {
                req.logout();
                res.redirect('/');
            }
        })
    });
    
    /*/*createUser(currentUser, function(err) {
        if(err) {
            res.send("the following error Occured: " + err);
        }
        else {
            res.redirect("/user");
        }
    }); */

    
}




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
    
    
}
    

