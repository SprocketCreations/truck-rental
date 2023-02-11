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
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        values: ["returned", "checkedout"]
    }
}, {
    sequelize
});

module.exports = Rent