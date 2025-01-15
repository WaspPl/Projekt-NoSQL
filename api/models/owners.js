const { mongo } = require("mongoose")

mongoose = require("mongoose")

//owner schema
const ownerSchema = {
  name: { type: String},
  address: {
    country: { type: String},
    city: { type: String},
    street: { type: String}
  },
  email: { type: String},
  apartmentIds: { type: [mongoose.Schema.Types.ObjectId], default: [] } //from apartmens col
};



module.exports = mongoose.model("Owner", ownerSchema)