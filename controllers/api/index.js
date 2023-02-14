const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Review, Rent, Truck } = require('../../models');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const dayjs = require("dayjs");

const truckApiRoute = require('./truck');
router.use("/truck", truckApiRoute);

const rentApiRoute = require('./rent');
router.use("/rent", rentApiRoute);


router.get("/search", async (req, res) => {
	// Get all the query params
	const pickUpDate = dayjs(req.query.pickUpDate);
	const rentTime = req.query.rentTime;
	const dropOffDate = pickUpDate.add(Math.round(rentTime / 24), "day");
	const sortBy = req.query.sortBy;
	const widthMin = req.query.widthMin;
	const widthMax = req.query.widthMax;
	const heightMin = req.query.heightMin;
	const heightMax = req.query.heightMax;
	const lengthMin = req.query.lengthMin;
	const lengthMax = req.query.lengthMax;

	/** @type { Object<string, [string, string]> } Lookup table for Sequelize order. */
	const getOrder = {
		bestReviews: (a, b) => {
			if(a.rating < b.rating) {
				return -1;
			} else if (a.rating > b.rating) {
				return 1;
			}
			return 0;
		},
		mostReviews: (a, b) => {
			if(a.reviewCount < b.reviewCount) {
				return -1;
			} else if (a.reviewCount > b.reviewCount) {
				return 1;
			}
			return 0;
		},
		leastPerHour: (a, b) => {
			if(a.pricePerHour < b.pricePerHour) {
				return 1;
			} else if (a.pricePerHour > b.pricePerHour) {
				return -1;
			}
			return 0;
		},
		leastPerMile: (a, b) => {
			if(a.pricePerMile < b.pricePerMile) {
				return 1;
			} else if (a.pricePerMile > b.pricePerMile) {
				return -1;
			}
			return 0;
		},
	};

	/**
	 * @typedef TruckData
	 * @type {object} truck The truck object.
	 * @property {string} truck.anchor The url to direct to for viewing this truck.
	 * @property {string} truck.imageUrl The url to fetch the image from.
	 * @property {string} truck.name The display name.
	 * @property {number} truck.pricePerHour The cost of rent per hour .
	 * @property {number} truck.pricePerMile The cost of rent per mile driven.
	 * @property {number} truck.rating The average rating.
	 */
	/** @type {TruckData[]} An array of data to send back to the front end. */
	const truckDatas = [];

	const allTrucks = await Truck.findAll({
		where: {
			width: { [Op.gte]: widthMin, [Op.lte]: widthMax },
			height: { [Op.gte]: heightMin, [Op.lte]: heightMax },
			length: { [Op.gte]: lengthMin, [Op.lte]: lengthMax },

		},
		attributes: [
			"id", "name", "width", "height", "length", "costPerMile", "costPerHour",
		],
		include: [
			{
				model: Rent,
				attributes: [
					"id",
					"pickUpDate",
					"hours",
					"status"
				],
				include: [{
					model: Review,
					attributes: ["rating"],
				}],
			},
		],
	});

	const calculateRent = truck => {
		if(truck.Rents && truck.Rents.length){
			return truck.Rents.reduce(rent => rent.rating, 0) / truck.Rents.length;
		}
		return undefined;
	};

	allTrucks.forEach(model => {
		const truck = model.toJSON();
		const [overlappingRent] = truck.Rents.filter(rent => {
			const rentPickUpDate = dayjs(rent.pickUpDate);
			const rentDropOffDate = rentPickUpDate.add(Math.round(rent.hours/24), "day");
			const startOverlaps = (rentPickUpDate.isAfter(pickUpDate) || rentPickUpDate.isSame(pickUpDate)) && (rentPickUpDate.isBefore(dropOffDate) || rentPickUpDate.isSame(dropOffDate));
			if(startOverlaps) return true; // Exit early cause next line is expensive calc
			const endOverlaps = (rentDropOffDate.isAfter(pickUpDate) || rentDropOffDate.isSame(pickUpDate)) && (rentDropOffDate.isBefore(dropOffDate) || rentDropOffDate.isSame(dropOffDate));
			return endOverlaps;
		});
		if (overlappingRent) {
			// do nothing
		} else {
			truckDatas.push({
				anchor: `/truck/view/${truck.id}`,
				imageUrl: `/uploads/${truck.id}`,
				name: truck.name,
				pricePerHour: truck.costPerHour,
				pricePerMile: truck.costPerMile,
				rating: calculateRent(truck),
				reviewCount: truck.Rents.length,
			});
		}
	});
	truckDatas.sort(getOrder[sortBy]);
	truckDatas.reviewCount = undefined;
	return res.status(200).json(truckDatas);
});

router.delete("/signout", (req, res) => {
	if (!req.session.userId) {
		return res.status(404).json({ msg: "NOT FOUND" });
	}
	req.session.destroy();
	res.status(200).json({ msg: "OK" });
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
	if (!req.session.userId) {
		return res.status(403).json({ msg: "login first to add new review" })
	}
	Review.create({
		rating: req.body.rating,
		blurb: req.body.blurb,
		UserId: req.session.userId,
		TruckId: req.body.TruckId,
		RentId: req.body.RentId
	}).then(reviewData => {
		res.status(201).json(reviewData)
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "INTERNAL SERVER ERROR", err })
	})
})


//debugging
router.get("/review", (req, res) => {
	Review.findAll({
		include: [Rent, User]
	}
	).then(userData => {
		res.json(userData)
	}).catch(err => {
		console.log(err);
		res.status(500).json({ msg: "uh oh", err })
	})
})



module.exports = router;