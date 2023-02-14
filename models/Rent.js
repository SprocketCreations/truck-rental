const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rent extends Model { }

Rent.init({
    // add properites here, ex:
    pickUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        isDate: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["reserved", "pickedup", "returned", "canceled"],
        defaultValue: "reserved"
    },
    hours: {
        type: DataTypes.DECIMAL(10,1),
        allowNull: false,
        isNumeric: true,
        min: 1,
    },
    payment: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true,
        isNumeric: true,
        min:0.01,
    }
}, {
    sequelize
});

module.exports = Rent