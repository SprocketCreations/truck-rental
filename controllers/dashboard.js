const express = require('express');
const router = express.Router();
const { Truck, User, Rent, Review } = require('../models');
const dayjs=require('dayjs')
dayjs().format()

router.get("/renter", (req, res) => {
    User.findByPk(req.session.userId, {
        include: [{ model: Rent, include: [Truck] }]
    }).then(userData => {
        console.log(userData.toJSON());
        const rentArray = []
        
        for (let rent of userData.Rents) {
            const pickupDate = dayjs(rent.pickUpDate);
            const dropoffDate = pickupDate.add(Math.round(rent.hours/ 24),'day');
            const truck = {
                pickup:rent.status === "reserved",
                name: rent.Truck.name,
                imageURL: rent.Truck.image,
                pickupDate: rent.pickUpDate,
                status: rent.status,
                dropoffDate: rent.dropOffDate,
                totalCost: (rent.hours * rent.Truck.costPerHour),
                dropoffDate: dayjs(dropoffDate).format('YYYY-MM-DD'),
                rentId:rent.id,
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
            let totalRev = 0;
            if(trucks.Rents){
                console.log(trucks.Rents.length)
                for(let i = 0; i<trucks.Rents.length; i++){
                    if(trucks.Rents[i].status == "returned"){
                        console.log(trucks.Rents[i].payment);
                        totalRev = totalRev + trucks.Rents[i].payment;
                    }
                }
            }
            const truck = {
                revenue: totalRev,
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