const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Rent extends Model { }

Rent.init({
    // add properites here, ex:
    pickUpDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    dropOffDate: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize
});

module.exports = Rent