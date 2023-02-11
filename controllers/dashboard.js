const express = require('express');
const router = express.Router();
const { Truck, User, Rent, Review } = require('../models');

router.get("/renter", (req, res) => {
    User.findByPk(req.session.userId, {
        include: [{ model: Rent, include: [Truck] }]
    }).then(userData => {
        console.log(userData.toJSON());
        const rentArray = []
        for (let rent of userData.Rents) {
            const truck = {
                name: rent.Truck.name,
                imageURL: rent.Truck.image,
                pickupDate: rent.PickUpDate,
                dropoffDate: rent.dropOffDate,
                totalCost:1000,
                pricePerMile: rent.Truck.costPerMile
            }
            rentArray.push(truck);
        }
        res.render("dashboardRenter", {
            trucks:rentArray,
            loggedIn: req.session
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

router.get("/rental", (req, res) => {
    User.findByPk(req.session.userId, {
        include: [{ model: Truck, include: [Rent] }]
    }).then(userData => {
        const truckArray = []
        for (let trucks of userData.Trucks) {
            const truck = {
                //figure out this
                revenue: 10000,
                imageURL: trucks.image,
                name: trucks.name,
                //figure out this
                isReserved:true
            }
            truckArray.push(truck);
        }
        res.render("dashboardRental", {
            trucks: truckArray,
            loggedIn: req.session
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})


module.exports = router;