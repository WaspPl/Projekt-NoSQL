const express = require("express")
const router = express.Router()
const Owner = require("../models/owners")
const mongoose = require("mongoose")

router.post("/",(req, res, next)=>{
    //tworze objekt abzodanowych
    const owner = new Owner({
        name: req.body.name,
        address: {
          country: req.body.address.country,
          city: req.body.address.city,
          street: req.body.address.city
        },
        email: req.body.email,
        apartmentIds: req.body.apartmentIds //from apartmens col
      })
    //zapis do db
    owner.save()
    .then(result=>{
        res.status(201).json({
            wiadomosc:"dodanie nowego własciciela",
            dane: result
        })
    })
    .catch(err=>{
        res.status(500).json({wiadomosc: err})
    })
})

router.get("/",(req, res, next)=>{
     Owner.aggregate([
            {
                $lookup:{
                    "from":"apartments",
                    "localField":"apartmentIds",
                    "foreignField":"_id",
                    "as":"apartmentsData"
                }
            }
     ])
    .then(owner=>{
        res.status(200).json({
            wiadomosc: "Lista wlascicieli",
            lista: owner
        })
    })
    .catch(err=>{
        res.status(500).json({wiadomosc: err})
    })
})
router.get("/:ownerId",(req, res, next)=>{
    const id = req.params.ownerId
    Owner.find({"_id":id})
    .then(apartment=>{
        res.status(200).json({wiadomosc:"informacje o wlascicnielu o id "+ id,apartment})
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