const express = require('express');
const router = express.Router();
const { Truck, Rent, User } = require('../../models');
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");


router.post("/reserve", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ msg: "login first to add new reservation" })
    }
    Rent.create({
        pickUpDate: req.body.pickUpDate,
        hours: req.body.hours,
        UserId: req.session.userId,
        TruckId: req.body.TruckId
    }).then(rentData => {
        res.status(201).json(rentData)
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

// TODO: FORMIDABLE code goes here:
router.post("/new", (req, res) => {
    if (!req.session.userId) {
        return res.status(403).json({ msg: "login first to add new truck" })
    }
    const form = new formidable.IncomingForm({
        multiples: false,
    });
    form.parse(req, function (err, fields, files) {
        const filename = files.image.newFilename;
        const fileExtension = path.extname(files.image.originalFilename)
        const saveFileName = filename + fileExtension;
        const oldFilePath = files.image.filepath;
        const newFilePath = path.join(__dirname, "../../public/images/") + saveFileName;
        const dbFileName = "/images/" + saveFileName;
        const rawImageData = fs.readFileSync(oldFilePath);
        fs.writeFileSync(newFilePath, rawImageData, function(err){
            if(err){
                console.log(err);
            } else{
                return;
            }
        });
        Truck.create({
            name: fields.name,
            image: dbFileName,
            width: fields.width,
            height: fields.height,
            length: fields.length,
            costPerMile: fields.costPerMile,
            costPerHour: fields.costPerHour,
            milesPerGallon: fields.mpg,
            odometer: fields.milage,
            fuelCapacity: fields.fuelTankSize,
            features: fields.feautures,
            UserId: req.session.userId
        }).then(truckData => {
            res.status(201).json(truckData)
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
        })
    });
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
        include: [Rent, User]
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