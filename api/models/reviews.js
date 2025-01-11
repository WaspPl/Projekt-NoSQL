const { mongo } = require("mongoose")

mongoose = require("mongoose")

const reviewSchema = {
  apartmentId: { type: String, required: true }, //apartaments col ref
  reviewer: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
};
  

module.exports = mongoose.model("Review", reviewSchema)