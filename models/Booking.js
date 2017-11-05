const   mongoose =  require('mongoose'),
        Schema = mongoose.Schema;

var BookingSchema = new Schema( {
    date: {type: String, required: true},
    duration: {type: String},
    by: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    venue: {type: Schema.Types.ObjectId, ref: 'playgrounds', required: true}
});

module.exports = mongoose.model('Booking', BookingSchema);
