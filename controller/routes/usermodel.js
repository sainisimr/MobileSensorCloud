var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    /*latitude: Number,
    longitude: Number,
    ppm: Number,
    timeStamp: Number  */
    Sensor_Id: String,
    Location : String,
    Latitude: String,
    Longitude: String,
    PPM: Number ,
    Ozone: Number,
    N2O :Number,
    SO2: Number,
    CO: Number,
    timeStamp: Number  
});
var User = mongoose.model('User', LocationSchema);
module.exports = User;
