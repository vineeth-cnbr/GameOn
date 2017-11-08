var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;

var UserSchema = mongoose.Schema({
        username        : {type:  String, required: true, index: { unique: true } },
        password        : {type:  String, required: true },
        name            : {type:  String, required: true, index: { unique: true } },
        area            : {type: String},
        bookings        : [ { type: Schema.Types.ObjectId, ref: 'Booking' } ]
    //loginAttempts: { type: Number, required: true, default: 0 },
    //lockUntil: { type: Number }
});

UserSchema.virtual('isLocked').get(function() {
    
    return !!(this.lockUntil && this.lockUntil > Date.now());   // check for a future lockUntil timestamp
});

UserSchema.pre('save', function(next) {
    var user = this;


    if (!user.isModified('password')) return next();    // only hash the password if it has been modified (or is new)


    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {  // generate a salt
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });


});

/*(UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};*/

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

/*UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            //$unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
};*/
/*/*UserSchema.statics.getAuthenticated = function(username, password, cb) {
    this.findOne({ username: username }, function(err, user) {
        if (err) return cb(err);

        
        if (!user) {                // make sure the user exists
            return cb(null, null, reasons.NOT_FOUND);
        }

        
        user.comparePassword(password, function(err, isMatch) {  // test for a matching password
            if (err) return cb(err);

            
            if (isMatch) {                      // check if the password was a match
                    return cb(null, user);
            }


        });
    });
};*/
module.exports = mongoose.model('User', UserSchema);