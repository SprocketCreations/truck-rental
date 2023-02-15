const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Truck extends Model { }

Truck.init({
    // add properites here, ex:
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    width: {
        type: DataTypes.FLOAT,
        allowNull: false,
        isNumeric: true,
        min: 0,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: false,
        isNumeric: true,
        min: 0,
    },
    length: {
        type: DataTypes.FLOAT,
        allowNull: false,
        isNumeric: true,
        min:0,
    },
    costPerMile: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        isNumeric: true,
        min:0.01,
    },
    costPerHour: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        isNumeric: true,
        min: 0.01,
    },
    milesPerGallon: {
        type: DataTypes.FLOAT,
        allowNull: false,
        isNumeric: true,
        min: 0.01,
    },
    odometer: {
        type: DataTypes.DECIMAL(9,1),
        allowNull: false,
        isNumeric: true,
        min:0,
    },
    fuelCapacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        isNumeric: true,
        min:1
    },
}, {
    sequelize
});

module.exports = Truck