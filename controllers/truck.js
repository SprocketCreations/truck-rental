const express = require('express');
const router = express.Router();

router.get("/view/:id", (req, res) => {
    res.render("truckView")
})

router.get("/return/:id", (req, res) => {
    res.render("truckReturn")
})

router.get("/history/:id", (req, res) => {
    res.render("truckHistory")
})

router.get("/new", (req, res) => {
    res.render("truckNew")
})
