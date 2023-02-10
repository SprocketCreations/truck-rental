const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Review extends Model { }

Review.init({
    // add properites here, ex:
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
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