const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rent extends Model { }

Rent.init({
    // add properites here, ex:
    pickUpDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    dropOffDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["available", "checkedout", "outforservice"]
    }
}, {
    sequelize
});

module.exports = Rent