const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Truck extends Model { }

Truck.init({
    // add properites here, ex:
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    width: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    length: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    costPerMile: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    costPerHour: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    milesPerGallon: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    odometer: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fuelCapacity: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    features: {
        type: DataTypes.TEXT,
    }
}, {
    sequelize
});

module.exports = User