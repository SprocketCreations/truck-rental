const express = require('express');
const router = express.Router();
const { Truck, User, Rent, Review } = require('../models');

const calculateAverageReview = truck => {
    if (truck.Rents && truck.Rents.length) {
        let total = 0;
        let count = 0;
        truck.Rents.forEach(rent => {
            if (rent.Review) {
                total += rent.Review.rating;
                ++count;
            }
        });
        return total / count;
    }
    return undefined;
};

router.get("/view/:id", (req, res) => {
    Truck.findByPk(req.params.id, {
        include: [{ model: Rent, include: [Review] }]
    }).then(truckData => {
        const truck = truckData;
        const reviews = []
        console.log(truck.Rents.length)
        if (truck.Rents.length != 0) {
            for (let i = 0; i < truck.Rents.length; i++) {
                if (truck.Rents[i].Review) {
                    const oneReview = {
                        rating: truck.Rents[i].Review.rating,
                        blurb: truck.Rents[i].Review.blurb
                    }
                    reviews.push(oneReview)
                }
            }
        }
        res.render("truckView", {
            imageURL: truck.image,
            name: truck.name,
            rating: calculateAverageReview(truck),
            fuelTankSize: truck.fuelCapacity,
            milage: truck.odometer,
            mpg: truck.milesPerGallon,
            pricePerHour: truck.costPerHour,
            pricePerMile: truck.costPerMile,
            width: truck.width,
            height: truck.height,
            length: truck.length,
            features: truck.features,
            reviews: reviews,
            loggedIn: req.session.userId
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTER SERVER ERROR", err })
    })
})

router.get("/return/:id", (req, res) => {
    Rent.findByPk(req.params.id, {
        include: [{ model: Truck }]
    }).then(rentData => {
        let returnData = null
        if (rentData && rentData.Truck) {
            returnData = {
                imageURL: rentData.Truck.image,
                name: rentData.Truck.name,
                costPerMile: rentData.Truck.costPerMile,
                price: rentData.Truck.costPerHour * rentData.hours,
                loggedIn: req.session.userId
            }
            res.render("truckReturn", returnData)
        } else {
            res.status(400).json({ msg: "RENT DOES NOT EXIST OR RENT IS NOT ATTACHeD TO TRUCKID" })
        }

    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

router.get("/history/:id", (req, res) => {
    Truck.findByPk(req.params.id, {
        include: [{ model: Rent, include: [Review] }]
    }).then(truckData => {
        const truck = truckData
        console.log("hi")
        console.log(truckData.toJSON());
        const moneyMade = 0;
        const rentHistory = []
        if (truck.Rents) {
            //for loop that goes through all Rents
            for (let rent of truck.Rents) {
                if (rent.status == "returned") {
                    moneyMade += rent.payment
                }
                if (rent.Review) {
                    const history = {
                        status: rent.status,
                        returned: rent.status === "returned" || rent.status === "canceled",
                        rating: rent.Review.rating,
                        pickupDate: rent.pickUpDate,
                        hours: rent.hours
                    }
                    rentHistory.push(history)
                }
            }
        }
        res.render("truckHistory", {
            imageURL: truck.image,
            name: truck.name,
            rentCount: truck.Rents.length,
            milage: truck.odometer,
            moneyMade: moneyMade,
            history: rentHistory,
            loggedIn: req.session.userId
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTER SERVER ERROR", err })
    })
})

router.get("/new", (req, res) => {
    res.render("truckNew", {
        loggedIn: req.session.userId
    })
})


module.exports = router;