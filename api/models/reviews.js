const { mongo } = require("mongoose")

mongoose = require("mongoose")

const reviewSchema = {
  apartmentId: { type: String, required: "True" }, //apartaments col ref
  reviewer: { type: String, default:"Anonymous reviewer" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String},
  date: { type: Date, default: Date.now }
};
  

module.exports = mongoose.model("Review", reviewSchema)