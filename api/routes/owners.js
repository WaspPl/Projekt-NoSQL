const express = require("express")
const router = express.Router()
const Owner = require("../models/owners")
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
        res.status(201).json({
             message:"New owner account successfully created",
            data: result
        })
    })
    .catch(err=>{
        res.status(500).json({ message: err})
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
        res.status(200).json({
             message: "List of all owners",
            data: owner
        })
    })
    .catch(err=>{
        res.status(500).json({ message: err})
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
        res.status(200).json({ message:`Information about the owner with id ${id}}`,data:apartment})
    })
    .catch(err=>{
        res.status(500).json({ message: err})
    })
    })
router.put("/:ownerId", (req, res) => {
    const id = req.params.ownerId;

    Owner.findById(id)
        .then((owner) => {
            //if an owner with that id doesnt exist throw an error
            if (!owner) {
                return res.status(404).json({ message: `Owner ${id} not found` });
            }

            //update only values included in the body
            if (req.body.name != null && req.body.name !== undefined) {
                apartment.name = req.body.name;
            }

            if (req.body.address) {
                if (req.body.address.country != null) apartment.address.country = req.body.address.country;
                if (req.body.address.city != null) apartment.address.city = req.body.address.city;
                if (req.body.address.street != null) apartment.address.street = req.body.address.street;
                if (req.body.address.lon != null) apartment.address.lon = req.body.address.lon;
                if (req.body.address.lat != null) apartment.address.lat = req.body.address.lat;
            }

            if (req.body.desc != null) apartment.desc = req.body.desc;
            if (req.body.price) {
                if (req.body.price.adult != null) apartment.price.adult = req.body.price.adult;
                if (req.body.price.child != null) apartment.price.child = req.body.price.child;
            }

            if (req.body.ownerId != null) {
                apartment.ownerId = req.body.ownerId;
            }
            return apartment.save();
        })
        .then((updatedApartment) => {
            res.status(200).json({
                message: `Zaktualizowano apartament o id ${id}`,
                apartment: updatedApartment,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({
                message: "Wystąpił błąd podczas aktualizacji apartamentu",
                error: error.message,
            });
        });
});
router.delete("/:productId",(req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({ message:"Usuniecie produktu o numerze "+ id})
})
module.exports = router