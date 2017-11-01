module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        if(req.isAuthenticated()) {
            res.render('loginPage.ejs', { messages: "loggedIn" });
        }else {
            res.render('loginPage.ejs', { messages: null });
        }
         // load the index.ejs file
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
        if(req.isAuthenticated()) {
            res.render('userPage.ejs', { messages: "loggedIn" });
        }else {
            res.render('userPage.ejs', { messages: null });
        }     
    });
    
    
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
    

