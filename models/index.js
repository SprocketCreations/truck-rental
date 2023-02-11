const Truck = require("./Truck");
const Rent = require("./Rent");
const Review = require("./Review");
const User = require("./User");


// Create models' relationships
User.hasMany(Truck);
Truck.belongsTo(User);

User.hasMany(Rent);
Rent.belongsTo(User);

User.hasMany(Review);
Review.belongsTo(User);

Truck.hasMany(Rent);
Rent.belongsTo(Truck);

Truck.hasMany(Review);
Review.belongsTo(Rent);



module.exports = {
    Truck,
    Rent,
    Review,
    User
}