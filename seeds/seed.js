require("dotenv").config();
const sequelize = require("../config/connection.js");
const { User, Rent, Review, Truck } = require("../models");

const seed = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate([
        {
            email: "joe@joe.joe",
            password: "password"
        },
        {
            email: "Andy@joe.joe",
            password: "password1"
        },
        {
            email: "bob@bob.com",
            password: "12345678"
        }
    ], {
        validate: true,
        individualHooks: true
    });

    const trucks = await Truck.bulkCreate([
        {
            name: "Box Truck",
            image: "Newtown",
            width: 96,
            height: 96,
            length: 294,
            costPerMile: 0.10,
            costPerHour: 0.50,
            milesPerGallon: 8.0,
            odometer: 35000,
            fuelCapacity: 24.0,
            features: "Cruise control"
        },
        {
            name: "Bill's Longbed Chevy Pickup",
            image: "Newtown",
            width: 63.625,
            height: 0.0,
            length: 96.5,
            costPerMile: 0.10,
            costPerHour: 0.50,
            milesPerGallon: 15.0,
            odometer: 10000,
            fuelCapacity: 16.0,
            features: "Cruise control"
        },
    ], {
        validate: true
    });

    const rentals = await Rent.bulkCreate([
        {
            pickUpDate: 2023-03-01,
            dropOffDate: 2023-03-04,
            status: "checkedout"
        },
    ], {
        validate: true
    });

    const reviews = await Review.bulkCreate([
        {
            rating: 4,
            blurb: "It was a very easy to drive and roomie truck. Would rent again."
        },
    ], {
        validate: true
    });

    process.exit(1)
};

seed();
