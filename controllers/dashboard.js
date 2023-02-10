const express = require('express');
const router = express.Router();

router.get("/renter", (req, res) => {
    res.render("dashboardRenter")
})

router.get("/rental", (req, res) => {
    res.render("dashboardRental")
})

module.exports = router;