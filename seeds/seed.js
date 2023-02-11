require("dotenv").config();
const sequelize = require("../config/connection.js");
const { User, Rent, Review, Truck } = require("../models");
