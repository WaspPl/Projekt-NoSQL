const express = require("express")
const router = express.Router()
const Apartment = require("../models/apartments")
const Owner = require("../models/owners")
const Review = require("../models/reviews")
const mongoose = require("mongoose")


router.post("/", async (req, res, next) => {
    try {
        //create an apartment
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
            ownerId: req.body.ownerId
    
        });

        //check if owner with ownerId exists, if not throw an error
        const ownerfound = await Owner.findOne({ _id: apartment.ownerId });

        if (!ownerfound) {
            return res.status(404).json({
                wiadomosc: "Can't find an owner with the specified id"
            });
        }
        //save an apartment and update owner's appartmentIds array
        const result = await apartment.save()
        const updateResult = await Owner.updateOne(
            { _id: result.ownerId },
            { $push: { apartmentIds: result._id } }
        );
        return res.status(201).json({
            wiadomosc: "Apartment added successfully",
            dane: result
        })

        //handle errors
    } catch (err) {
        return res.status(500).json({ wiadomosc: err.message });
    }
});

router.get("/", (req, res, next) => {
    //add all review data and owner info to apartments
    Apartment.aggregate([
        {
            $lookup:{
                "from":"reviews",
                "localField":"_id",
                "foreignField":"apartmentId",
                "as":"reviews"
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
    //display apartments
      .then(apartments => {
        return res.status(200).json({
          message: "Lista apartamentów",
          lista: apartments
        });
      })
      .catch(err => {
        return res.status(500).json({ message: err.message });
      });
  });
  

router.get("/:apartmentId",(req, res, next)=>{
    //find an apartment with matching id
    //add owner and review info to apartment
    const id = req.params.apartmentId
    Apartment.aggregate([
        {
            $match:{"_id": new mongoose.Types.ObjectId(id)}
        },
        {
            $lookup:{
                "from":"reviews",
                "localField":"_id",
                "foreignField":"apartmentId",
                "as":"reviews"
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
    .then(apartment=>{
        return res.status(200).json({wiadomosc:"Details on the apartment "+ id, data: apartment})
    })
    .catch(err=>{
        return res.status(500).json({wiadomosc: err})
    })
    })
router.put("/:apartmentId", (req, res) => {
    const id = req.params.apartmentId;

    Apartment.findById(id)
        .then((apartment) => {
            //if an apartment with that id doesnt exist throw an error
            if (!apartment) {
                return res.status(404).json({ message: "Apartment not found" });
            }

            //update only values included in the body and save the apartment
            if (req.body.name   && req.body.name !== undefined) {
                apartment.name = req.body.name;
            }
            if (req.body.address) {
                if (req.body.address.country  ) apartment.address.country = req.body.address.country;
                if (req.body.address.city  ) apartment.address.city = req.body.address.city;
                if (req.body.address.street  ) apartment.address.street = req.body.address.street;
                if (req.body.address.lon  ) apartment.address.lon = req.body.address.lon;
                if (req.body.address.lat  ) apartment.address.lat = req.body.address.lat;
            }
            if (req.body.desc  ) apartment.desc = req.body.desc;
            if (req.body.price) {
                if (req.body.price.adult  ) apartment.price.adult = req.body.price.adult;
                if (req.body.price.child  ) apartment.price.child = req.body.price.child;
            }
            if (req.body.ownerId  ) {
                apartment.ownerId = req.body.ownerId;
            }
            return apartment.save();
        })
        //return the confirmation message
        .then((updatedApartment) => {
            return res.status(200).json({
                message: `Apartment ${id} updated`,
                data: updatedApartment,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                message: "There was an error updating the apartment",
                error: error.message,
            });
        });
});
    

router.delete("/:apartmentId", (req, res, next) => {
    const id = req.params.apartmentId;
    Apartment.findOne({_id:id})
    .then((apartment)=>{
        if (!apartment){
            return res.status(500).json({
                message: "Apartment with that id doesnt exist",
            });
        }
        //delete the apartment
        Apartment.deleteOne({ _id: id })
        .then(()=>{
        //delete connected reviews
        Review.deleteMany({apartmentId: id})
        })
        .then(() => {
            // respond
            return res.status(200).json({ message: `Successfully deleted apartment ${id} and its reviews` });
        })
        .catch((err) => {
            // Catch any errors in the chain
            return res.status(500).json({
                message: "There was an error deleting this apartment",
                error: err.message
            });
        });
    })
    .catch((err)=>{
        return res.status(500).json({
            message: "There was an error deleting this apartment",
            error: err.message
        });
    })
    
});

module.exports = router


