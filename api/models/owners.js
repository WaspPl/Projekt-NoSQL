const { mongo } = require("mongoose")

mongoose = require("mongoose")

//owner schema
const ownerSchema = {
  name: { type: String, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true }
  },
  email: { type: String, required: true },
  apartments: { type: [String], default: [] } //from apartmens col
};
  

module.exports = mongoose.model("Owner", ownerSchema)