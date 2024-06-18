import mongoose from 'mongoose'

const CarSchema = new mongoose.Schema({
    carBrand: String,
    carModel: String,
    carKilometers: String,
    carYear: Number,
    carSerialNumber:{type: String, default: null}

})

const ClientSchema = new mongoose.Schema({
    phoneNumber: String,
    fullName: String,
    cars: {type: [CarSchema], default: null}
})

const ClientModel = mongoose.model('Client', ClientSchema);

export default ClientModel;