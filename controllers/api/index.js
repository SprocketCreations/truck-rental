const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const  User  = require('../../models/User.js');

const truckApiRoute = require('./truck');
router.use("/truck", truckApiRoute);


router.delete("/signout", (req, res) => {
    if (!req.session.userId) {
        return res.status(404).json({ msg: "NOT FOUND" });
    }
    req.session.destroy();
    res.redirect('/signin');
})

router.post("/signin", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(userData => {
        if (!userData) {
            return res.status(403).json({ msg: "incorrect email or password" })
        } else {
            if (bcrypt.compareSync(req.body.password, userData.password)) {
                req.session.userId = userData.id;
                return res.status(201).json(userData)
            } else {
                return res.status(403).json({ msg: "incorrect email or password" })
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
    })
})

router.post("/signup", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(userData => {
        if (userData) {
            return res.status(403).json({ msg: "Email already exist" })
        }
        User.create({
            email: req.body.email,
            password: req.body.password
        }).then(userData => {
            req.session.userId = userData.id;
            res.status(201).json(userData)
        }).catch(err => {
            console.log(err);
            res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
        })
    })
})

router.post("/review", (req, res) => {
    res.send("review post")

})



module.exports = router;