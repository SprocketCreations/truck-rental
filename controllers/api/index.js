const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
//const { User } = require('../models');

const truckApiRoute = require('./truck');
router.use("/truck", truckApiRoute);


router.delete("/signout", (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

router.post("/signin", (req, res) => {
    res.send("signin post")
})

router.post("/signup", (req, res) => {
    res.send("signup post")

})

router.post("/review", (req, res) => {
    res.send("review post")

})



module.exports = router;