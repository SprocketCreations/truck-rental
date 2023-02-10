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


//add truckRoutes file path
const truckRoutes = require('./truck');
router.use("/truck", truckRoutes);
//add dashboardRoute file path
const dashboardRoute = require('./dashboard');
router.use("/dashboard", dashboardRoute);