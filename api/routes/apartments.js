const express = require("express")
const router = express.Router()
const Apartment = require("../models/apartments")
const Owner = require("../models/owners")
const mongoose = require("mongoose")


router.post("/", async (req, res, next) => {
    try {
        // Create an apartment object from the request body
        const apartment = new Apartment({
            name: req.body.name,
            address: {
                country: req.body.address.country,
                city: req.body.address.city,
                street: req.body.address.street,
                lon: req.body.address.lon,
                lat: req.body.address.lat
            },
            desc: req.body.desc,
            price: {
                adult: req.body.price.adult,
                child: req.body.price.child
            },
            ownerId: req.body.ownerId,
            reviews: req.body.reviews
        });

        const ownerfound = await Owner.findOne({ _id: apartment.ownerId });

        if (!ownerfound) {
            return res.status(404).json({
                wiadomosc: "Brak właściciela o takim ID"
            });
        }

        const result = await apartment.save()
        const updateResult = await Owner.updateOne(
            { _id: result.ownerId },
            { $push: { apartmentIds: result._id } }
        );
            res.status(201).json({
            wiadomosc: "Dodanie nowego apartamentu",
            dane: result
        })


    } catch (err) {
        // Handle errors and send a 500 response
        res.status(500).json({ wiadomosc: err.message });
    }
});

router.get("/", (req, res, next) => {
    Apartment.aggregate([
        {
            $lookup:{
                "from":"reviews",
                "localField":"reviews",
                "foreignField":"_id",
                "as":"reviewData"
            }
        },
        {
            $lookup:{
                "from":"owners",
                "localField":"ownerId",
                "foreignField":"_id",
                "as":"ownerInfo"
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

