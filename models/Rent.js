const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rent extends Model { }

Rent.init({
    // add properites here, ex:
    pickUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["reserved", "pickedup", "returned", "canceled"],
        defaultValue: "reserved"
    },
    hours: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment: {
        type: DataTypes.DECIMAL,
        allowNull: true
    }
}, {
    sequelize
});

module.exports = Rent