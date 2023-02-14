const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model { }

Review.init({
    // add properites here, ex:
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        isint: true,
        defaultValue: 3,
        isEmpty: false,
        validate: {
            min: 0,
            max: 10
        },
    },
    blurb: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize
});

module.exports = Review