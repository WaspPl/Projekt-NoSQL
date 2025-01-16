const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/reviews");
const Apartment = require("../models/apartments");

router.post("/", (req, res) => {
    const review = new Review({
        apartmentId: req.body.apartmentId,
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        comment: req.body.comment,
    });

    Apartment.findOne({ _id: review.apartmentId })
        .then((apartment) => {
            if (!apartment) {
                return res.status(404).json({
                    message: "Apartment not found.",
                });
            }
            return review.save();
        })
        .then((result) => {
            if (result) {
                res.status(201).json({
                    message: "Successfully added the review",
                    data: result,
                });
            }
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({
                    message: "There was an error saving your review.",
                    error,
                });
            }
        });
});

router.get("/", (req, res) => {
    Review.find()
        .then((reviews) => {
            res.status(200).json({
                message: "A list of all opinions",
                data: reviews,
            });
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ message: "There was an error.", error });
            }
        });
});

router.get("/:reviewId", (req, res) => {
    const id = req.params.reviewId;

    Review.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "apartments",
                localField: "apartmentId",
                foreignField: "_id",
                as: "aboutApartment",
            },
        },
    ])
        .then((review) => {
            if (!review || review.length === 0) {
                return res.status(404).json({ message: "Review not found." });
            }
            res.status(200).json({
                message: `Details of the review with ID ${id}`,
                data: review,
            });
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ message: "An error occurred.", error });
            }
        });
});

router.put("/:reviewId", (req, res) => {
    const id = req.params.reviewId;

    Review.findById(id)
        .then((review) => {
            if (!review) {
                return res.status(404).json({ message: `Review ${id} not found` });
            }

            if (req.body.reviewer) review.reviewer = req.body.reviewer;
            if (req.body.rating) review.rating = req.body.rating;
            if (req.body.comment) review.comment = req.body.comment;
            review.dateEdited = Date.now();

            if (req.body.apartmentId) {
                return Apartment.findOne({ _id: req.body.apartmentId })
                    .then((apartmentfound) => {
                        if (!apartmentfound) {
                            return res.status(404).json({
                                wiadomosc: "Can't find an apartment with the specified id",
                            });
                        }

                        review.apartmentId = req.body.apartmentId;
                        return review.save(); 
                    });
            } else {
                return review.save();
            }
        })
        .then((updatedReview) => {
            res.status(200).json({
                message: `Review ${id} successfully updated`,
                data: updatedReview,
            });
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({
                    message: "There was an error updating this review",
                    error: error.message,
                });
            }
        });
});


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
            if (!res.headersSent) {
                res.status(500).json({ message: "An error occurred.", error });
            }
        });
});

module.exports = router;
