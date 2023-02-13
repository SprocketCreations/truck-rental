const express = require('express');
const router = express.Router();
const { Truck, Rent, User } = require('../../models');

router.put("/pickup/:id", (req, res) => {
    Rent.update({
        status: "pickedup"
    },
        {
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

router.put("/return/:id", (req, res) => {
    Rent.findByPk(req.params.id, {
        include: [Truck]
    }).then(rentData => {
        //const paymentTotalHour = rentData.Truck.costPerMile * rentData.hour
        const paymentTotalMile = req.body.milesDriven * rentData.Truck.costPerHour
        Rent.update({
            status: "returned",
            payment: paymentTotalMile
        },
            {
                where: {
                    id: req.params.id,
                }
            }).then(updateData => {
                res.json(updateData);
                Truck.update({
                    odometer: rentData.Truck.odometer + req.body.milesDriven,
                },
                    {
                        where: {
                            id: rentData.Truck.id,
                        }
                    }).then(truckData => {
                    })
            }).catch(err => {
                console.log(err);
                res.status(500).json({ msg: "INTERNAL SERVER ERROR inside updating", err })
            })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "oh noes!", err })
    })

})

router.put("/cancel/:id", (req, res) => {
    Rent.update({
        status: "canceled"
    },
        {
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

module.exports = router;