//zmienne srowdowiskowe
require("dotenv").config()

//importuje express
const express = require("express")

//tworze instacje expressa
const app = express()

//importuje routy
const apartmentRoutes = require("./api/routes/apartments")
const reviewRoutes = require("./api/routes/reviews")
const ownerRoutes = require("./api/routes/owners")

//polaczenie  z baza danych
const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.kwgz6.mongodb.net/Booking?retryWrites=true&w=majority&appName=${process.env.DB_NAME}}`)

//logger
const morgan = require("morgan")
app.use(morgan("dev"))

//parsowanie body
const bodyParser = require("body-parser")
app.use(bodyParser.json())

//stosuje routy
app.use("/apartments", apartmentRoutes)
app.use("/reviews", reviewRoutes)
app.use("/owners", ownerRoutes)

app.use((req, res, next) => {
  res.status(404).json({wiadomosc: "nie odnaleziono"})  
})

module.exports = app
