import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
    sender_id: String,
    fullName: String,
    carBrand: String,
    carModel: String,
    carKilometers: String,
    carYear: Number,
    carSerialNumber:{type: String, default: null}

})

const ClientModel = mongoose.model('Client', ClientSchema);

export default ClientModel;