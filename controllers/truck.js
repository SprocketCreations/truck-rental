const express = require('express');
const router = express.Router();
const { Truck, User, Rent, Review } = require('../models');

router.get("/view/:id", (req, res) => {
    Truck.findByPk(req.params.id, {
        include: [{model:Review}]
    }).then(truckData => {
        const truck = truckData.toJSON();
        
        let avgRating = null;
        if (truckData.Reviews.length != 0) {
            for (let i = 0; i < trucks.Reviews.length; i++) {
                avgRating += trucks.Reviews[i].rating;
            }
            avgRating = avgRating / trucks.Review.length;
        }
        res.render("truckView", {
            imageURL: truck.image,
            name: truck.name,
            rating: avgRating,
            fuelTankSize: truck.fuelCapacity,
            milage: truck.odometer,
            mpg: truck.milesPerGallon,
            pricePerHour: truck.costPerHour,
            pricePerMile: truck.costPerMile,
            width: truck.width,
            height: truck.height,
            length: truck.length,
            features: truck.features,
            reviews:truck.Review,
            loggedIn:req.session.userId
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTER SERVER ERROR", err })
    })
})

router.get("/return/:id", (req, res) => {
    res.render("truckReturn")
})

router.get("/history/:id", (req, res) => {
    res.render("truckHistory")
})

router.get("/new", (req, res) => {
    res.render("truckNew",{
        loggedIn:req.session.userId
    })
})


module.exports = router;