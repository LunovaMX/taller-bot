const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    sender_id: String,
    fullName: String,
    carBrand: String,
    carModel: String,
    carKilometers: String,
    carYear: Number,
    carSerialNumber:{type: String, default: null}

})
module.exports = mongoose.model('client', ClientSchema)