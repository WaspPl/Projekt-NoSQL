const express = require("express")
const router = express.Router()
const Apartment = require("../models/apartments")
const mongoose = require("mongoose")


// router.post("/",(req, res, next)=>{
//     //tworze objekt abzodanowych
//     const apartment = new Apartment({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         price: req.body.price
//     })
//     //zapis do db
//     product.save()
//     .then(result=>{
//         res.status(201).json({
//             wiadomosc:"dodanie nowego produktu",
//             dane: result
//         })
//     })
//     .catch(err=>{
//         res.status(500).json({wiadomosc: err})
//     })
// })
router.get("/", (req, res, next) => {
    Apartment.aggregate([
        {
            $lookup:{
                "from":"reviews",
                "localField":"reviews",
                "foreignField":"_id",
                "as":"reviewData"
            }
        }
    ])
      .then(apartments => {
        res.status(200).json({
          message: "Lista apartamentów",
          lista: apartments
        });
      })
      .catch(err => {
        res.status(500).json({ message: err.message });
      });
  });
  

router.get("/:apartmentId",(req, res, next)=>{
    const id = req.params.apartmentId
    Apartment.aggregate([
        {
            $match:{"_id": new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup:{
                "from":"reviews",
                "localField":"reviews",
                "foreignField":"_id",
                "as":"reviewData"
            }
        }
    ])
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

