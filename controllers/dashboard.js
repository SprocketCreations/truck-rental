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
            console.log(rent.Truck.costPerHour)
            console.log(rent.hours)
            
            const truck = {
                
                // const date1 = dayjs()
                // const date2 = dayjs(rent.pickUpDate)
                // console.log(date1.diff(date2,'day'));
                // if(date1.diff(date2,'day') == 0 ) {
                //     do something with true and false to be able to picked up
                // }
                
                pickup:rent.status === "reserved",
                name: rent.Truck.name,
                imageURL: rent.Truck.image,
                pickupDate: rent.pickUpDate,
                status: rent.status,
                dropoffDate: rent.dropOffDate,
                totalCost: (rent.hours * rent.Truck.costPerHour),
                //this needs to be added after the models been updated. 
                //totalCost:1000,
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