require("dotenv").config();
const sequelize = require("../config/connection.js");
const { User, Rent, Review, Truck, Feature } = require("../models");

const seed = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate([
        {
            email: "joe@joe.joe",
            password: "@Password1!"
        },
        {
            email: "Andy@joe.joe",
            password: "@Password2!"
        },
        {
            email: "bob@bob.com",
            password: "@Password3!"
        }
    ], {
        validate: true,
        individualHooks: true
    });

    const trucks = await Truck.bulkCreate([
        {
            name: "Box Truck",
            image: "",
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
            image: "",
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
            status: "reserved",
            hours: 3,
            payment: 100.00
        },
    ], {
        validate: true
    });

    const reviews = await Review.bulkCreate([
        {
            rating: 8,
            blurb: "It was a very easy to drive and roomie truck. Would rent again."
        },
    ], {
        validate: true
    });

    const features = await Feature.bulkCreate([
        {
            featureName: "Cruise Control"
        },
        {
            featureName: "Air conditioning"
        },
        {
            featureName: "Automatic transmission"
        },
        {
            featureName: "Android Auto"
        },
        {
            featureName: "All wheel drive"
        },
    ], {
        validate: true,
    });

    process.exit(1)
};

seed();
