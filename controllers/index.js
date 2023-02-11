const express = require('express');
const router = express.Router();
const { Truck, Review } = require('../models');
//render homepage

router.get("/", (req, res) => {
    Truck.findAll({
        include: [{model:Review}]
    }).then(truckData => {
        const truckArray = []
        for (let trucks of truckData) {
            const truck = {
                truckURL: "truck/view/" + trucks.id,
                imageURL: trucks.image,
                name: trucks.name,
                pricePerHour: trucks.costPerHour,
                pricePerMile: trucks.costPerMile,
                //rating: number
            }
            truckArray.push(truck);
        }
        res.render("home", {
            loggedIn: req.session.userId,
            trucks: truckArray
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

//renders signin page
router.get("/signin", (req, res) => {
    res.render("signin")
})


//add truckRoutes
const truckRoutes = require('./truck');
router.use("/truck", truckRoutes);
//add dashboardRoute 
const dashboardRoute = require('./dashboard');
router.use("/dashboard", dashboardRoute);
//add api routes
const apiRoute = require('./api');
router.use("/api", apiRoute);

module.exports = router;