const Truck = require("./Truck");
const Rent = require("./Rent");
const Review = require("./Review");
const User = require("./User");


// Create models' relationships
User.hasMany(Truck);
Truck.hasOne(User);

User.hasMany(Rent);
Rent.hasOne(User);

User.hasMany(Review);
Review.hasOne(User);

Truck.hasMany(Rent);
Rent.hasOne(Truck);

Truck.hasMany(Review);
Review.hasOne(Rent);



module.exports = {
    Truck,
    Rent,
    Review,
    User
}