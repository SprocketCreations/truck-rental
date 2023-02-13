const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Feature extends Model { }

Feature.init({
    featureName: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize
});

module.exports = Feature