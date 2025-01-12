const express = require("express")
const router = express.Router()
const Review = require("../models/reviews")
const Apartment = require("../models/apartments")
const mongoose = require("mongoose")

router.post("/",(req, res, next)=>{
    //tworze objekt bazodanowych
    const reviews = new Review({
        apartmentId: req.body.apartmentId,
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        comment: req.body.comment
    })
    //zapis do db
    reviews.save()
    .then(result=>{
        return Apartment.updateOne(
            { _id: req.body.apartmentId },
            { $push: { reviews: result._id } }
        ).then((updateResult) => {
            // Respond with success
            res.status(201).json({
                message: "Added a new review",
                review: result,
                apartmentUpdate: updateResult
            });
        });
    })
    .catch(err=>{
        res.status(500).json({wiadomosc: err})
    })
})

router.get("/",(req, res, next)=>{
    Review.find()
    .then(reviews=>{
        res.status(200).json({
            wiadomosc: "Lista ocen",
            lista: reviews
        })
    })
    .catch(err=>{
        res.status(500).json({wiadomosc: err})
    })
})
router.get("/:apartmentId",(req, res, next)=>{
    const id = req.params.apartmentId
    Apartment.find({"_id":id})
    .then(apartment=>{
        res.status(200).json({wiadomosc:"Szczegoly apartamentu o id "+ id,apartment})
    })
    .catch(err=>{
        res.status(500).json({wiadomosc: err})
    })
    })
router.put("/:productId",(req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({wiadomosc:"Zmiana produktu o numerze "+ id})
})
router.delete("/:productId",(req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({wiadomosc:"Usuniecie produktu o numerze "+ id})
})
module.exports = router