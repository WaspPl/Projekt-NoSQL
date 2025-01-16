const { mongo } = require("mongoose")

mongoose = require("mongoose")

//owner schema
const ownerSchema = {
  name: { type: String,required: "True"},
  address: {
    country: { type: String},
    city: { type: String},
    street: { type: String}
  },
  email: { type: String,required: "True"}
};



module.exports = mongoose.model("Owner", ownerSchema)