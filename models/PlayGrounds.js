var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var PlayGroundSchema = new Schema({
name:   {type:  String, required: true, index: { unique: true } },
area: { type: String, required: true}, 
id: {type: Number },
img: {type: String },
desc: {type: String},
contact: {type: String},
bookings: [ { type: Schema.Types.ObjectId, ref: 'Bookings' } ],
sports:[{type: String, required: true}]
//loginAttempts: { type: Number, required: true, default: 0 },
//lockUntil: { type: Number }
});

/*PlayGroundSchema.pre('save', function(next) {
var user = this;
console.log(user);

console.log("HOpefuly saved");

});*/


module.exports = mongoose.model('Playgrounds', PlayGroundSchema);