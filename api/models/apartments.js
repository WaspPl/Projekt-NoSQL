const { mongo } = require("mongoose")

mongoose = require("mongoose")

//apartment schema
const apartmentSchema = mongoose.Schema({
    name: { type: String, required: "True" },
    address: {
      country: { type: String },
      city: { type: String },
      street: { type: String },
      lon: { type: Number },
      lat: { type: Number }
    },
    desc: { type: String },
    price: {
      adult: { type: Number,required: "True" },
      child: { type: Number,required: "True" }
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: "True"},
  });
  

module.exports = mongoose.model("Apartment", apartmentSchema)