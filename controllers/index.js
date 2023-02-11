const express = require('express');
const router = express.Router();

//render homepage
router.get("/", (req, res) => {
    res.render("home")
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