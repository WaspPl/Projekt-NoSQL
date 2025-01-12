const { mongo } = require("mongoose")

mongoose = require("mongoose")

//apartment schema
const apartmentSchema = mongoose.Schema({
    name: { type: String },
    address: {
      country: { type: String },
      city: { type: String },
      street: { type: String },
      lon: { type: Number },
      lat: { type: Number }
    },
    desc: { type: String },
    price: {
      adult: { type: Number },
      child: { type: Number }
    },
    ownerId: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  });
  

module.exports = mongoose.model("Apartment", apartmentSchema)