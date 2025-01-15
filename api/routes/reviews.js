const express = require("express");
const router = express.Router();
const Review = require("../models/reviews");
const Apartment = require("../models/apartments");

router.post("/", (req, res) => {
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
                });
            }
            review.save()
                .then(result => {
                    Apartment.updateOne({ _id: review.apartmentId }, { $push: { reviews: result._id } })
                        .then(() => {
                            res.status(201).json({
                                message: "Pomyslnie dodano nowa opinie",
                                review: result
                            });
                        })
                        .catch(error => {
                            res.status(500).json({ message: "Nie udalo sie dodac opinii", error });
                        });
                })
                .catch(error => {
                    res.status(500).json({ message: "Failed to save review.", error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to find apartment.", error });
        });
});

router.get("/", (req, res) => {
    Review.find()
        .then(reviews => {
            res.status(200).json({
                message: "Lista wszystkich opinii",
                reviews
            });
        })
        .catch(error => {
            res.status(500).json({ message: "Nie udalo sie wyswietlic opinii", error });
        });
});

router.get("/:apartmentId", (req, res) => {
    const { apartmentId } = req.params;

    Apartment.findById(apartmentId)
        .populate("reviews")
        .then(apartment => {
            if (!apartment) {
                return res.status(404).json({ message: "Apartment not found." });
            }
            res.status(200).json({
                message: `Details of apartment with ID ${apartmentId}`,
                apartment
            });
        })
        .catch(error => {
            res.status(500).json({ message: "An error occurred.", error });
        });
});

router.put("/:reviewId", (req, res) => {
    const { reviewId } = req.params;

    Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        .then(updatedReview => {
            if (!updatedReview) {
                return res.status(404).json({ message: "Review not found." });
            }
            res.status(200).json({
                message: `Review with ID ${reviewId} updated successfully.`,
                updatedReview
            });
        })
        .catch(error => {
            res.status(500).json({ message: "An error occurred.", error });
        });
});

router.delete("/:reviewId", (req, res) => {
    const { reviewId } = req.params;

    Review.findByIdAndDelete(reviewId)
        .then(deletedReview => {
            if (!deletedReview) {
                return res.status(404).json({ message: "Review not found." });
            }

            Apartment.updateOne({ reviews: reviewId }, { $pull: { reviews: reviewId } })
                .then(() => {
                    res.status(200).json({
                        message: `Review with ID ${reviewId} deleted successfully.`
                    });
                })
                .catch(error => {
                    res.status(500).json({ message: "Failed to update apartment after review deletion.", error });
                });
        })
        .catch(error => {
            res.status(500).json({ message: "An error occurred.", error });
        });
});

module.exports = router;
