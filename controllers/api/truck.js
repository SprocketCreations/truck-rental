const express = require('express');
const router = express.Router();
//const { User } = require('../models');


router.post("/reserve", (req, res) => {
    res.send("reserve post")
})

router.post("/pickup", (req, res) => {
    res.send("pickup post")
})

router.post("/return", (req, res) => {
    res.send("return post")
})

router.post("/new", (req, res) => {
    res.send("new post")
})

router.put("/:id", (req, res) => {
    res.send("put at index " + req.params.id)
})

module.exports = router;