const express = require("express")
const router = express.Router()
const Review = require("../models/reviews")
const Apartment = require("../models/apartments")


router.post("/", (req, res) => {
    //create a new review, skip the date on purpose so that it sets as default
    const review = new Review({
        apartmentId: req.body.apartmentId,
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        comment: req.body.comment
    })

    Apartment.findOne({_id:review.apartmentId})
    .then(apartment => {
        if (!apartment) {
            return res.status(404).json({ 
                message: "Apartment not found." 
            })
        }
        review.save()
        .then((result) => {
            res.status(201).json({
                message: "Successfully added the review",
                data: result
            })
    })
    
    })
    .catch(error => {
        res.status(500).json({ message: "There was an error saving your review.",
        error: error })
    })
})

router.get("/", (req, res) => {
    Review.find()
        .then(reviews => {
            res.status(200).json({
                message: "A list of all opinions",
                data: reviews
            })
        })
        .catch(error => {
            res.status(500).json({ message: "There was an error.", error })
        })
})

router.get("/:reviewId", (req, res) => {
    const id = req.params.reviewId

    Review.aggregate([
        {$match:{"_id":new mongoose.Types.ObjectId(id)}},
        {$lookup:{
            "from":"apartments",
            "localField":"apartmentId",
            "foreignField":"_id",
            "as":"aboutApartment"
        }}
    ])
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: "Review not found." })
            }
            
            res.status(200).json({
                message: `Details of the review with ID ${id}`,
                data: review
            })
        })
        .catch(error => {
            res.status(500).json({ message: "An error occurred.", error })
        })
})

router.put("/:reviewId", (req, res) => {
    const id = req.params.reviewId

    Review.findById(id)
        .then((review) => {
            //if an owner with that id doesnt exist throw an error
            if (!review) {
                return res.status(404).json({ message: `Owner ${id} not found` })
            }

            //update only values included in the body and set the date of posting to now
            if (req.body.reviewer) review.reviewer = req.body.reviewer
            if (req.body.rating) review.rating = req.body.rating
            if (req.body.comment) review.comment = req.body.comment
            review.date = Date.now()
            
            return review.save()
        })
        .then((updatedReview) => {
            return res.status(200).json({
                message: `Review ${id} successfully updated`,
                data: updatedReview
            })
        })
        .catch((error) => {
            console.error(error)
            return res.status(500).json({
                message: "There was an error updating this review",
                error: error.message,
            })
        })
})

router.delete("/:reviewId", (req, res) => {
    const id = req.params.reviewId;

    Review.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({ message: "Review not found." });
            }

            return Review.deleteOne({ _id: id });
        })
        .then(() => {
            res.status(200).json({
                message: `Successfully deleted review ${id}`,
            });
        })
        .catch((error) => {
            res.status(500).json({ message: "An error occurred.", error });
        });
});


module.exports = router
