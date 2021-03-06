var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/Users');
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    
     passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        username : 'email',
        password : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
         //console.log(email + " " + password);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            console.log(user);
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            else {
            
            user.comparePassword(password, function(err, isMatch) {
                if(err) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                if(isMatch) {
                    console.log("corrent auth");                    
                     return done(null, user, req.flash('loginMessage', 'loggedIn'));
                }
                else {
                    console.log("incorrent auth");
                     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
            });
            }
            
      /*      if (!user.compaPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
*/
            // all is well, return successful user
      //      console.log("corrent auth")
       //     return done(null, user);
       

    });
     }));
                 
     


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        username : 'email',
        password : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        //console.log(email + " " + password );
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.username    = email;
                newUser.name = req.body.name;
                newUser.password = password;

                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                        console.log("any err: " + err);
                    }
                    return done(null, newUser, req.flash('loginMessage','loggedIn'));
                });
            }

        });    

        });

    }));

};
                 