const express = require('express');
const router = express.Router();
const { Truck, Review, Rent } = require('../models');
//render homepage

router.get("/", (req, res) => {
	try {
		return res.render("home", { loggedIn: req.session.userId });
	} catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    }
})

//renders signin page
router.get("/signin", (req, res) => {
    res.render("signin")
})


//add truckRoutes
const truckRoutes = require('./truck');
router.use("/truck", truckRoutes);
//add dashboardRoute 
const dashboardRoute = require('./dashboard');
router.use("/dashboard", dashboardRoute);
//add api routes
const apiRoute = require('./api');
router.use("/api", apiRoute);

module.exports = router;