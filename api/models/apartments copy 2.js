const { mongo } = require("mongoose")

mongoose = require("mongoose")

//apartment schema
const apartmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      lon: { type: Number, required: true },
      lat: { type: Number, required: true }
    },
    desc: { type: String, required: true },
    price: {
      adult: { type: Number, required: true },
      child: { type: Number, required: true }
    },
    ownerId: { type: String, required: true },
  });
  

module.exports = mongoose.model("Apartment", apartmentSchema)