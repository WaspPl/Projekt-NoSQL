const express = require("express")
const router = express.Router()
const Owner = require("../models/owners")
const Apartment = require("../models/apartments")
const Review = require("../models/reviews")
const mongoose = require("mongoose")

router.post("/",(req, res, next)=>{
    //create an owner account
    const owner = new Owner({
        name: req.body.name,
        address: {
          country: req.body.address.country,
          city: req.body.address.city,
          street: req.body.address.street
        },
        email: req.body.email
    })
    //zapis do db
    owner.save()
    .then(result=>{
        return res.status(201).json({
             message:"New owner account successfully created",
            data: result
        })
    })
    .catch(err=>{
        return res.status(500).json({ message: err})
    })
})

router.get("/",(req, res, next)=>{
     Owner.aggregate([
            {
                $lookup:{
                    "from":"apartments",
                    "localField":"_id",
                    "foreignField":"ownerId",
                    "as":"apartmentsData"
                }
            }
     ])
    .then(owner=>{
        return res.status(200).json({
             message: "List of all owners",
            data: owner
        })
    })
    .catch(err=>{
        return res.status(500).json({ message: err})
    })
})

router.get("/:ownerId",(req, res, next)=>{
    const id = req.params.ownerId
    
    Owner.aggregate([
        {
            $match:{"_id": new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup:{
                "from":"apartments",
                "localField":"_id",
                "foreignField":"ownerId",
                "as":"apartmentsData"
            }
        }
 ])
    .then(apartment=>{
        return res.status(200).json({ message:`Information about the owner with id ${id}}`,data:apartment})
    })
    .catch(err=>{
        return res.status(500).json({ message: err})
    })
    })
    
router.put("/:ownerId", (req, res) => {
    const id = req.params.ownerId

    Owner.findById(id)
        .then((owner) => {
            //if an owner with that id doesnt exist throw an error
            if (!owner) {
                return res.status(404).json({ message: `Owner ${id} not found` })
            }

            //update only values included in the body
            if (req.body.name) {
                owner.name = req.body.name
            }

            if (req.body.address) {
                if (req.body.address.country) owner.address.country = req.body.address.country
                if (req.body.address.city) owner.address.city = req.body.address.city
                if (req.body.address.street) owner.address.street = req.body.address.street
                }

            if (req.body.email) owner.email = req.body.email
            
            return owner.save()
        })
        .then((updatedOwner) => {
            return res.status(200).json({
                message: `Owner ${id} successfully updated`,
                data: updatedOwner,
            })
        })
        .catch((error) => {
            console.error(error)
            return res.status(500).json({
                message: "There was an error updating this owner account",
                error: error.message,
            })
        })
})

router.delete("/:ownerId", (req, res) => {
    const id = req.params.ownerId

    Owner.findOne({ _id: id })
        .then((owner) => {
            if (!owner) {
                return res.status(500).json({
                    message: `Owner ${id} doesnt exist`,
                })
            }
            // delete the owner
            return Owner.deleteOne({ _id: id })
        })
        .then(() => {
            return Apartment.find({ ownerId: id })
        })
        .then((apartments) => {
            const apartmentIds = apartments.map((apartments) => apartments._id)
            // delete connected reviews
            return Review.deleteMany({ apartmentId: { $in: apartmentIds } })
        })
        .then(() => {
            // delete all connected apartments
            // has to be done in this order, otherwise there'd be no apartment id to reference
            return Apartment.deleteMany({ ownerId: id })
        })
        .then(() => {
            // respond success
            return res.status(200).json({
                message: `Successfully deleted owner account ${id} and its apartments along with their reviews`,
            })
        })
        .catch((err) => {
            // respont if errors
            return res.status(500).json({
                message: "There was an error deleting this owner accound",
                error: err.message
            })
        })
})

module.exports = router