const Truck = require("./Truck");
const Rent = require("./Rent");
const Review = require("./Review");
const User = require("./User");
const Feature = require("./Feature")


// Create models' relationships
User.hasMany(Truck);
Truck.belongsTo(User);

User.hasMany(Rent);
Rent.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Truck.hasMany(Rent);
Rent.belongsTo(Truck);

Rent.hasOne(Review);
Review.belongsTo(Rent);

Feature.belongsTo(Truck);
Truck.hasMany(Feature);


module.exports = {
    Truck,
    Rent,
    Review,
    User,
    Feature
}