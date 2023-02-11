const express = require('express');
const router = express.Router();
const { Truck, Rent, User } = require('../../models');


router.post("/reserve", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ msg: "login first to add new truck" })
    }
    Rent.create({
        pickUpDate: req.body.pickUpDate,
        dropOffDate: req.body.dropOffDate,
        UserId: req.session.userId,
        TruckId: req.body.TruckId
    }).then(rentData => {
        res.status(201).json(rentData)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

router.put("/pickup", (req, res) => {
    Rent.findOne({
        where: {
            id: req.params.id
        }
    }).then(rentIdData => {
        if (!(rentIdData.UserId == req.session.userId)) {
            return res.status(403).json({ msg: "NOT YOUR RENTAL" })
        }
        Rent.update(req.body, {
            where: {
                id: req.params.id,
            }
        }).then(rentData => {
            res.status(202).json(rentData)
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
        })
    })
})

router.put("/return", (req, res) => {
    Rent.findOne({
        where: {
            id: req.params.id
        }
    }).then(rentIdData => {
        if (!(rentIdData.UserId == req.session.userId)) {
            return res.status(403).json({ msg: "NOT YOUR RENTAL" })
        }
        Rent.update(req.body, {
            where: {
                id: req.params.id,
            }
        }).then(rentkData => {
            res.status(202).json(rentData)
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
        })
    })
})

router.post("/new", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ msg: "login first to add new truck" })
    }
    Truck.create({
        name: req.body.name,
        image: req.body.image,
        width: req.body.width,
        height: req.body.height,
        length: req.body.length,
        costPerMile: req.body.costPerMile,
        costPerHour: req.body.costPerHour,
        milesPerGallon: req.body.milesPerGallon,
        odometer: req.body.odometer,
        fuelCapacity: req.body.fuelCapacity,
        features: req.body.feautures,
        UserId: req.session.userId
    }).then(blogData => {
        res.status(201).json(blogData)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

router.put("/:id", (req, res) => {
    Truck.findOne({
        where: {
            id: req.params.id
        }
    }).then(truckIdData => {
        if (!truckIdData) {
            return res.status(404).json({ msg: "NO SUCH TRUCK" })
        } else if (!(truckIdData.UserId == req.session.userId)) {
            return res.status(403).json({ msg: "NOT YOUR TRUCK" })
        } else {
            Truck.update(req.body, {
                where: {
                    id: req.params.id,
                }
            }).then(truckData => {
                res.status(202).json(truckData)
            }).catch(err => {
                console.log(err);
                res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
            })
        }
    })
})

//debuging code
router.get("/", (req, res) => {
    Truck.findAll({
        include:[Rent, User]
    }).then(userData => {
        res.json(userData)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "uh oh", err })
    })
})
router.get("/reserve", (req, res) => {
    Rent.findAll().then(userData => {
        res.json(userData)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "uh oh", err })
    })
})

module.exports = router;